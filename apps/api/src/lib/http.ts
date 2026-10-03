import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { ZodError, type ZodType, type ZodTypeDef } from 'zod'

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message)
  }
}

export const badRequest = (message: string, details?: unknown) => new HttpError(400, message, details)
export const notFound = (message = 'Not found') => new HttpError(404, message)
export const forbidden = (message = 'You do not have access to this') => new HttpError(403, message)

export function parse<T>(schema: ZodType<T, ZodTypeDef, unknown>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) throw zodToHttp(result.error)
  return result.data
}

export function zodToHttp(error: ZodError): HttpError {
  const fields: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_'
    fields[key] ??= issue.message
  }
  const first = error.issues[0]?.message ?? 'Invalid request'
  return new HttpError(400, first, { fields })
}

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

export function ah(fn: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

export function param(req: Request, name: string): string {
  const value = req.params[name]
  return Array.isArray(value) ? value[0] : String(value ?? '')
}
