import { spawnSync } from 'node:child_process'
import { existsSync, renameSync, rmSync, statSync } from 'node:fs'
import { basename, resolve } from 'node:path'

import ffmpeg from 'ffmpeg-static'

const USAGE = `Usage: node scripts/optimize-video.mjs <input> [output] [options]

Re-encodes a video for web delivery: caps the resolution, strips audio, and
moves the metadata to the front so playback can start before the download ends.

Options:
  --width <px>   Maximum output width, height follows the source ratio (default 900)
  --crf <n>      Quality, lower is better and larger (default 26)
  --keep-audio   Keep the audio track, which is dropped by default
  --replace      Overwrite the input file with the optimized result

Example:
  node scripts/optimize-video.mjs public/videos/about-overview-machine.mp4 --replace
`

function parseArgs(argv) {
  const positional = []
  const options = { width: 900, crf: 26, keepAudio: false, replace: false }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--help' || arg === '-h') return null
    if (arg === '--keep-audio') {
      options.keepAudio = true
    } else if (arg === '--replace') {
      options.replace = true
    } else if (arg === '--width' || arg === '--crf') {
      const value = Number(argv[index + 1])
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`${arg} needs a positive number`)
      }
      options[arg === '--width' ? 'width' : 'crf'] = value
      index += 1
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`)
    } else {
      positional.push(arg)
    }
  }

  if (positional.length === 0) return null
  return { input: positional[0], output: positional[1], options }
}

function formatSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

const parsed = (() => {
  try {
    return parseArgs(process.argv.slice(2))
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
})()

if (!parsed) {
  console.log(USAGE)
  process.exit(parsed === null && process.argv.length > 2 ? 0 : 1)
}

const { input, output, options } = parsed
const inputPath = resolve(process.cwd(), input)

if (!existsSync(inputPath)) {
  console.error(`Input not found: ${inputPath}`)
  process.exit(1)
}

if (!ffmpeg) {
  console.error('ffmpeg-static did not provide a binary for this platform.')
  process.exit(1)
}

const outputPath = options.replace
  ? `${inputPath}.optimized.mp4`
  : resolve(process.cwd(), output ?? inputPath.replace(/\.[^.]+$/, '.optimized.mp4'))

if (!options.replace && outputPath === inputPath) {
  console.error('Output would overwrite the input. Pass a different output path or --replace.')
  process.exit(1)
}

const args = [
  '-y',
  '-i',
  inputPath,
  // Only scale down, and keep both dimensions even so yuv420p stays valid.
  '-vf',
  `scale='min(${options.width},iw)':-2:flags=lanczos`,
  '-c:v',
  'libx264',
  '-preset',
  'slow',
  '-tune',
  'animation',
  '-crf',
  String(options.crf),
  '-profile:v',
  'high',
  '-pix_fmt',
  'yuv420p',
  '-movflags',
  '+faststart',
  options.keepAudio ? '-c:a' : '-an',
]

if (options.keepAudio) args.push('aac', '-b:a', '96k')
args.push(outputPath)

console.log(`Optimizing ${basename(inputPath)} (${formatSize(statSync(inputPath).size)})`)

const result = spawnSync(ffmpeg, args, { stdio: ['ignore', 'ignore', 'inherit'] })

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

if (result.status !== 0) {
  rmSync(outputPath, { force: true })
  console.error(`ffmpeg exited with code ${result.status}`)
  process.exit(result.status ?? 1)
}

const before = statSync(inputPath).size
const after = statSync(outputPath).size

// Windows refuses to rename over a file another process still holds open, so the
// original is moved aside first and only removed once the swap succeeds.
function replaceInput() {
  const backupPath = `${inputPath}.backup`
  rmSync(backupPath, { force: true })
  renameSync(inputPath, backupPath)

  try {
    renameSync(outputPath, inputPath)
  } catch (error) {
    renameSync(backupPath, inputPath)
    rmSync(outputPath, { force: true })
    throw error
  }

  rmSync(backupPath, { force: true })
}

if (options.replace) {
  try {
    replaceInput()
  } catch (error) {
    console.error(
      `Could not replace ${basename(inputPath)}: ${error.message}\n` +
        `The optimized file is at ${outputPath}; close anything using the original and move it manually.`,
    )
    process.exit(1)
  }
}

const saved = ((1 - after / before) * 100).toFixed(1)
console.log(
  `Wrote ${basename(options.replace ? inputPath : outputPath)} (${formatSize(after)}), ${saved}% smaller`,
)
