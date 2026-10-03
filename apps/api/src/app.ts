import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import helmet from 'helmet'
import { MulterError } from 'multer'
import { config } from './config.js'
import { HttpError } from './lib/http.js'
import { logger } from './lib/logger.js'
import { hrRouter } from './routes/hr.js'
import { publicRouter, rootRouter } from './routes/public.js'

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', 'loopback')

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  )
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || config.corsOrigins.includes(origin)),
      credentials: false,
      maxAge: 600,
    }),
  )
  app.use(express.json({ limit: '1mb' }))

  app.use((req, res, next) => {
    const started = Date.now()
    res.on('finish', () => {
      if (req.path === '/api/health') return
      logger.info({ method: req.method, path: req.path, status: res.statusCode, ms: Date.now() - started }, 'request')
    })
    next()
  })

  app.use(rootRouter)
  app.use('/api/public', publicRouter)
  app.use('/api/hr', hrRouter)

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: err.message, ...(err.details ? { details: err.details } : {}) })
      return
    }
    if (err instanceof MulterError) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'This file is too large. The limit is 10 MB.' : 'We could not read that upload. Please try again.'
      res.status(400).json({ error: message })
      return
    }
    if (err instanceof SyntaxError && 'body' in err) {
      res.status(400).json({ error: 'Invalid request' })
      return
    }
    logger.error({ err, method: req.method, path: req.path }, 'unhandled error')
    res.status(500).json({ error: 'Something went wrong on our side. Please try again.' })
  })

  return app
}
