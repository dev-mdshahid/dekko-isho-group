import type { NextFunction, Request, Response } from 'express'
import { STAFF_ROLES, type StaffRole } from '@dekko-isho/shared'
import { auth } from '../lib/firebase.js'
import { HttpError } from '../lib/http.js'

export type StaffPrincipal = { uid: string; email: string; name: string; role: StaffRole }

declare module 'express-serve-static-core' {
  interface Request {
    staff?: StaffPrincipal
  }
}

export function requireStaff(...roles: StaffRole[]) {
  const allowed = roles.length ? roles : [...STAFF_ROLES]
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.staff) {
        if (!allowed.includes(req.staff.role)) throw new HttpError(403, 'Your role does not allow this action')
        return next()
      }
      const header = req.headers.authorization ?? ''
      const token = header.startsWith('Bearer ') ? header.slice(7) : ''
      if (!token) throw new HttpError(401, 'Please sign in')
      let decoded
      try {
        decoded = await auth().verifyIdToken(token, true)
      } catch {
        throw new HttpError(401, 'Your session has expired. Please sign in again')
      }
      const role = decoded.role as StaffRole | undefined
      if (!role || !STAFF_ROLES.includes(role)) throw new HttpError(403, 'This account does not have HR Portal access')
      if (!allowed.includes(role)) throw new HttpError(403, 'Your role does not allow this action')
      req.staff = { uid: decoded.uid, email: decoded.email ?? '', name: (decoded.name as string) ?? decoded.email ?? '', role }
      next()
    } catch (error) {
      next(error)
    }
  }
}

export const canEdit = requireStaff('hr_admin', 'recruiter')
export const adminOnly = requireStaff('hr_admin')
export const anyStaff = requireStaff()
