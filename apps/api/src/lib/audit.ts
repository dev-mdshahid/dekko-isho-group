import type { Request } from 'express'
import { firestore, nowIso } from './firebase.js'
import { logger } from './logger.js'

export async function audit(req: Request, action: string, target: string, meta: Record<string, unknown> = {}) {
  try {
    await firestore()
      .collection('auditLog')
      .add({
        actorUid: req.staff?.uid ?? null,
        actorEmail: req.staff?.email ?? null,
        action,
        target,
        meta,
        ip: req.ip ?? null,
        at: nowIso(),
      })
  } catch (err) {
    logger.error({ err, action, target }, 'audit write failed')
  }
}
