import pino from 'pino'
import { config } from '../config.js'

export const logger = pino({
  level: config.logLevel,
  redact: ['req.headers.authorization', 'password', 'appPassword', 'token'],
  ...(config.isProd ? {} : { transport: { target: 'pino-pretty', options: { colorize: true, ignore: 'pid,hostname' } } }),
})
