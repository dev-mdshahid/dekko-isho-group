import { createApp } from './app.js'
import { config, productionConfigProblems } from './config.js'
import { logger } from './lib/logger.js'
import { storage } from './lib/storage.js'
import { startCron, stopCron } from './services/cron.js'
import { buildIndex } from './services/cvbank.js'
import { loadJobs } from './services/jobs.js'
import { loadLookups } from './services/lookups.js'

async function main() {
  const problems = productionConfigProblems()
  if (problems.length) throw new Error(`Refusing to start in production: ${problems.join('; ')}`)
  storage()
  await loadLookups()
  await loadJobs()
  await buildIndex()

  const server = createApp().listen(config.port, config.host, () => {
    logger.info({ url: `http://${config.host}:${config.port}`, project: config.firebase.projectId, emulators: config.firebase.useEmulators }, 'api listening')
  })
  // CV reading can queue behind other uploads and retry once, so allow more than two OpenAI round trips.
  server.requestTimeout = 240_000
  startCron()

  const shutdown = (signal: string) => {
    logger.info({ signal }, 'shutting down')
    stopCron()
    server.close(() => process.exit(0))
    setTimeout(() => process.exit(0), 10_000).unref()
  }
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

process.on('unhandledRejection', (err) => logger.error({ err }, 'unhandled rejection'))

main().catch((err) => {
  logger.fatal({ err }, 'failed to start')
  process.exit(1)
})
