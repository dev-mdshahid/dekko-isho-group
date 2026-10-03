import {
  slugify,
  type CustomFieldDefinition,
  type CustomFieldInput,
  type LookupItem,
  type LookupItemInput,
  type LookupKind,
  type PublicMeta,
} from '@dekko-isho/shared'
import { firestore } from '../lib/firebase.js'
import { badRequest, notFound } from '../lib/http.js'

type Cache = Record<LookupKind, LookupItem[]> & { customFields: CustomFieldDefinition[] }

const cache: Cache = { departments: [], locations: [], jobTypes: [], customFields: [] }

const bySort = <T extends { sortOrder: number; name?: string; label?: string }>(a: T, b: T) =>
  a.sortOrder - b.sortOrder || String(a.name ?? a.label).localeCompare(String(b.name ?? b.label))

export async function loadLookups() {
  const db = firestore()
  for (const kind of ['departments', 'locations', 'jobTypes'] as const) {
    const snap = await db.collection(kind).get()
    cache[kind] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<LookupItem, 'id'>) })).sort(bySort)
  }
  const cf = await db.collection('customFields').get()
  cache.customFields = cf.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CustomFieldDefinition, 'id'>) })).sort(bySort)
}

export const lookups = {
  list: (kind: LookupKind) => cache[kind],
  get: (kind: LookupKind, id: string | null | undefined) => (id ? cache[kind].find((x) => x.id === id) ?? null : null),
  customFields: () => cache.customFields,
}

export async function createLookup(kind: LookupKind, input: LookupItemInput): Promise<LookupItem> {
  const slug = slugify(input.name)
  if (cache[kind].some((x) => x.slug === slug)) throw badRequest(`"${input.name}" already exists`)
  const ref = await firestore().collection(kind).add({ ...input, slug })
  const item = { id: ref.id, ...input, slug }
  cache[kind] = [...cache[kind], item].sort(bySort)
  return item
}

export async function updateLookup(kind: LookupKind, id: string, input: LookupItemInput): Promise<LookupItem> {
  const existing = lookups.get(kind, id)
  if (!existing) throw notFound()
  const slug = slugify(input.name)
  if (cache[kind].some((x) => x.slug === slug && x.id !== id)) throw badRequest(`"${input.name}" already exists`)
  const item = { ...existing, ...input, slug }
  await firestore().collection(kind).doc(id).set(item)
  cache[kind] = cache[kind].map((x) => (x.id === id ? item : x)).sort(bySort)
  return item
}

export async function deleteLookup(kind: LookupKind, id: string, inUse: boolean) {
  if (inUse) throw badRequest('This item is used by a circular. Mark it inactive instead.')
  await firestore().collection(kind).doc(id).delete()
  cache[kind] = cache[kind].filter((x) => x.id !== id)
}

export async function saveCustomField(id: string | null, input: CustomFieldInput): Promise<CustomFieldDefinition> {
  if (cache.customFields.some((f) => f.key === input.key && f.id !== id)) throw badRequest(`Key "${input.key}" is already used`)
  const col = firestore().collection('customFields')
  if (id) {
    if (!cache.customFields.some((f) => f.id === id)) throw notFound()
    await col.doc(id).set(input)
    const item = { id, ...input }
    cache.customFields = cache.customFields.map((f) => (f.id === id ? item : f)).sort(bySort)
    return item
  }
  const ref = await col.add(input)
  const item = { id: ref.id, ...input }
  cache.customFields = [...cache.customFields, item].sort(bySort)
  return item
}

export async function deleteCustomField(id: string) {
  await firestore().collection('customFields').doc(id).delete()
  cache.customFields = cache.customFields.filter((f) => f.id !== id)
}

const toPublic = (x: LookupItem) => ({ id: x.id, name: x.name, slug: x.slug })

export function publicMeta(): PublicMeta {
  return {
    departments: cache.departments.filter((x) => x.active).map(toPublic),
    locations: cache.locations.filter((x) => x.active).map(toPublic),
    jobTypes: cache.jobTypes.filter((x) => x.active).map(toPublic),
    customFields: cache.customFields
      .filter((f) => f.filterPublic)
      .map(({ key, label, type, options }) => ({ key, label, type, options })),
  }
}
