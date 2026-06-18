import fs from 'node:fs/promises'
import path from 'node:path'

const sourceRoot = 'C:/dev/dekko-isho-group-website'
const targetRoot = 'C:/dev/dekko-isho-group/public/legacy'
const manifestPath = 'C:/dev/dekko-isho-group/src/data/asset-manifest.json'

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function copyTree(srcDir, destDir) {
  await ensureDir(destDir)
  const entries = await fs.readdir(srcDir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === '.git') continue
    const src = path.join(srcDir, entry.name)
    const dest = path.join(destDir, entry.name)
    if (entry.isDirectory()) {
      await copyTree(src, dest)
    } else if (entry.isFile()) {
      await fs.copyFile(src, dest)
    }
  }
}

async function collectFiles(dir, base = dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === '.git') continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await collectFiles(fullPath, base, out)
    } else if (entry.isFile()) {
      out.push(path.relative(base, fullPath).replace(/\\/g, '/'))
    }
  }
  return out
}

async function main() {
  await copyTree(sourceRoot, targetRoot)
  const files = await collectFiles(targetRoot)
  const htmlFiles = files.filter((f) => f.endsWith('.html'))
  const imageFiles = files.filter((f) => f.startsWith('images/'))
  const videoFiles = files.filter((f) => f.startsWith('videos/'))

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceRoot,
    targetRoot,
    totalFiles: files.length,
    htmlFiles: htmlFiles.length,
    imageFiles: imageFiles.length,
    videoFiles: videoFiles.length,
    files,
  }

  await ensureDir(path.dirname(manifestPath))
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  console.log(`Copied ${files.length} files from ${sourceRoot} to ${targetRoot}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
