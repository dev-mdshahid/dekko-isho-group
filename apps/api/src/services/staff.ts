import { randomBytes } from 'node:crypto'
import { STAFF_ROLE_LABELS, type StaffRole, type StaffUser, type StaffUserInput } from '@dekko-isho/shared'
import { config } from '../config.js'
import { hrInvite, passwordReset } from '../email/templates.js'
import { auth, firestore, nowIso } from '../lib/firebase.js'
import { badRequest, notFound } from '../lib/http.js'
import { logger } from '../lib/logger.js'
import { mailCtx, sendMail } from './mail.js'

type StaffDoc = { email: string; name: string; role: StaffRole; disabled: boolean; createdAt: string; invitedBy: string | null; notifyDigest: boolean }

const col = () => firestore().collection('staff')

/** Links to our own set-password page instead of Firebase's hosted one. */
async function passwordLink(email: string, mode: 'invite' | 'reset'): Promise<string> {
  const link = await auth().generatePasswordResetLink(email)
  const code = new URL(link).searchParams.get('oobCode')
  if (!code) throw new Error('Password link missing oobCode')
  const params = new URLSearchParams({ mode, code, email })
  return `${config.hrPortalUrl}/set-password?${params.toString()}`
}

export async function listStaff(): Promise<StaffUser[]> {
  const snap = await col().get()
  const users = await Promise.all(
    snap.docs.map(async (doc) => {
      const data = doc.data() as StaffDoc
      const record = await auth()
        .getUser(doc.id)
        .catch(() => null)
      return {
        uid: doc.id,
        email: data.email,
        name: data.name,
        role: data.role,
        disabled: record?.disabled ?? data.disabled,
        createdAt: data.createdAt,
        lastLoginAt:
          record?.metadata.lastSignInTime && record.metadata.lastSignInTime !== record.metadata.creationTime
            ? new Date(record.metadata.lastSignInTime).toISOString()
            : null,
      } satisfies StaffUser
    }),
  )
  return users.sort((a, b) => a.name.localeCompare(b.name))
}

export async function staffRecipients(roles: StaffRole[] = ['hr_admin', 'recruiter']) {
  const snap = await col().get()
  return snap.docs
    .map((d) => ({ uid: d.id, ...(d.data() as StaffDoc) }))
    .filter((s) => !s.disabled && roles.includes(s.role) && s.notifyDigest !== false)
}

export async function staffName(uid: string): Promise<{ name: string; email: string } | null> {
  const snap = await col().doc(uid).get()
  return snap.exists ? { name: snap.get('name'), email: snap.get('email') } : null
}

export async function createStaff(input: StaffUserInput, invitedBy: { uid: string; name: string } | null, opts: { sendInvite?: boolean } = {}) {
  const existing = await auth()
    .getUserByEmail(input.email)
    .catch(() => null)
  if (existing && (await col().doc(existing.uid).get()).exists) throw badRequest('This person already has an HR Portal account')

  const user =
    existing ??
    (await auth().createUser({ email: input.email, displayName: input.name, password: randomBytes(24).toString('base64url'), emailVerified: false }))
  await auth().updateUser(user.uid, { displayName: input.name, disabled: false })
  await auth().setCustomUserClaims(user.uid, { role: input.role })
  const doc: StaffDoc = {
    email: input.email,
    name: input.name,
    role: input.role,
    disabled: false,
    createdAt: nowIso(),
    invitedBy: invitedBy?.uid ?? null,
    notifyDigest: true,
  }
  await col().doc(user.uid).set(doc)

  const setPasswordUrl = await passwordLink(input.email, 'invite')
  if (opts.sendInvite !== false) {
    sendMail(
      input.email,
      hrInvite(mailCtx(), {
        name: input.name,
        email: input.email,
        role: STAFF_ROLE_LABELS[input.role],
        invitedBy: invitedBy?.name ?? 'Dekko ISHO Group HR',
        setPasswordUrl,
      }),
      'hr-invite',
    )
  }
  return { uid: user.uid, setPasswordUrl }
}

async function activeAdminCount(exceptUid?: string) {
  const snap = await col().where('role', '==', 'hr_admin').get()
  return snap.docs.filter((d) => d.id !== exceptUid && !d.get('disabled')).length
}

export async function updateStaff(uid: string, patch: { name?: string; role?: StaffRole; disabled?: boolean }, actorUid: string) {
  const ref = col().doc(uid)
  const snap = await ref.get()
  if (!snap.exists) throw notFound('User not found')
  const current = snap.data() as StaffDoc
  const losingAdmin = current.role === 'hr_admin' && ((patch.role && patch.role !== 'hr_admin') || patch.disabled === true)
  if (losingAdmin && uid === actorUid) throw badRequest('You cannot remove your own admin access')
  if (losingAdmin && (await activeAdminCount(uid)) === 0) throw badRequest('Keep at least one active HR Admin')

  const update: Partial<StaffDoc> = {}
  if (patch.name) update.name = patch.name
  if (patch.role) update.role = patch.role
  if (patch.disabled != null) update.disabled = patch.disabled

  if (patch.role && patch.role !== current.role) await auth().setCustomUserClaims(uid, { role: patch.role })
  if (patch.name || patch.disabled != null) await auth().updateUser(uid, { displayName: patch.name, disabled: patch.disabled })
  if (patch.disabled || (patch.role && patch.role !== current.role)) await auth().revokeRefreshTokens(uid)
  await ref.update(update)
  return { ...current, ...update, uid }
}

export async function deleteStaff(uid: string, actorUid: string) {
  if (uid === actorUid) throw badRequest('You cannot delete your own account')
  const snap = await col().doc(uid).get()
  if (!snap.exists) throw notFound('User not found')
  if (snap.get('role') === 'hr_admin' && (await activeAdminCount(uid)) === 0) throw badRequest('Keep at least one active HR Admin')
  await auth().deleteUser(uid).catch((err) => logger.warn({ err, uid }, 'auth user delete failed'))
  await col().doc(uid).delete()
}

export async function resendInvite(uid: string, actor: { name: string }) {
  const snap = await col().doc(uid).get()
  if (!snap.exists) throw notFound('User not found')
  const data = snap.data() as StaffDoc
  const setPasswordUrl = await passwordLink(data.email, 'invite')
  sendMail(
    data.email,
    hrInvite(mailCtx(), { name: data.name, email: data.email, role: STAFF_ROLE_LABELS[data.role], invitedBy: actor.name, setPasswordUrl }),
    'hr-invite-resend',
  )
}

/** Always resolves, so the response never reveals whether an account exists. */
export async function requestPasswordReset(email: string) {
  try {
    const user = await auth().getUserByEmail(email.toLowerCase())
    const snap = await col().doc(user.uid).get()
    if (!snap.exists || snap.get('disabled')) return
    const resetUrl = await passwordLink(user.email!, 'reset')
    sendMail(user.email!, passwordReset(mailCtx(), { name: snap.get('name'), resetUrl }), 'password-reset')
  } catch (err) {
    logger.info({ err: (err as Error).message }, 'password reset requested for unknown account')
  }
}

export async function setDigestPreference(uid: string, notifyDigest: boolean) {
  await col().doc(uid).update({ notifyDigest })
}

export async function me(uid: string) {
  const snap = await col().doc(uid).get()
  if (!snap.exists) throw notFound('User not found')
  const d = snap.data() as StaffDoc
  return { uid, email: d.email, name: d.name, role: d.role, notifyDigest: d.notifyDigest !== false }
}
