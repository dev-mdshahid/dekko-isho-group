/**
 * One-off: creates a Backblaze application key that can only touch `hr-main-website/`
 * inside the shared DMS bucket. The master (DMS) key is passed for this run only and never saved.
 *
 *   B2_MASTER_KEY_ID=... B2_MASTER_APPLICATION_KEY=... B2_BUCKET_NAME=Dekko-Document-Management-System \
 *     npm run b2:setup -w @dekko-isho/api
 *
 * Prints the env lines to paste into the API's .env on the server.
 */
const masterId = process.env.B2_MASTER_KEY_ID
const masterKey = process.env.B2_MASTER_APPLICATION_KEY
const bucketName = process.env.B2_BUCKET_NAME || 'Dekko-Document-Management-System'
const prefix = (process.env.B2_PREFIX || 'hr-main-website/').replace(/^\/+/, '')

if (!masterId || !masterKey) {
  console.error('Set B2_MASTER_KEY_ID and B2_MASTER_APPLICATION_KEY for this command only.')
  process.exit(1)
}

const authRes = await fetch('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', {
  headers: { Authorization: `Basic ${Buffer.from(`${masterId}:${masterKey}`).toString('base64')}` },
})
if (!authRes.ok) throw new Error(`authorize failed: ${authRes.status} ${await authRes.text()}`)
const auth = (await authRes.json()) as { accountId: string; authorizationToken: string; apiInfo: { storageApi: { apiUrl: string } } }
const api = auth.apiInfo.storageApi.apiUrl

async function call<T>(op: string, body: unknown): Promise<T> {
  const res = await fetch(`${api}/b2api/v3/${op}`, {
    method: 'POST',
    headers: { Authorization: auth.authorizationToken, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${op} failed: ${res.status} ${await res.text()}`)
  return (await res.json()) as T
}

const { buckets } = await call<{ buckets: Array<{ bucketId: string; bucketName: string; bucketType: string }> }>('b2_list_buckets', {
  accountId: auth.accountId,
  bucketName,
})
const bucket = buckets[0]
if (!bucket) throw new Error(`Bucket ${bucketName} not found`)
if (bucket.bucketType !== 'allPrivate') console.warn(`Warning: bucket ${bucketName} is ${bucket.bucketType}. Files are expected to be private.`)

const key = await call<{ applicationKeyId: string; applicationKey: string }>('b2_create_key', {
  accountId: auth.accountId,
  keyName: 'hr-main-website-api',
  capabilities: ['listFiles', 'readFiles', 'writeFiles', 'deleteFiles', 'shareFiles'],
  bucketId: bucket.bucketId,
  namePrefix: prefix,
})

console.log(`\nScoped key created for ${bucketName}/${prefix}\n`)
console.log('# Paste into the API .env on the server')
console.log('STORAGE_DRIVER=b2')
console.log(`B2_KEY_ID=${key.applicationKeyId}`)
console.log(`B2_APPLICATION_KEY=${key.applicationKey}`)
console.log(`B2_BUCKET_ID=${bucket.bucketId}`)
console.log(`B2_BUCKET_NAME=${bucket.bucketName}`)
console.log(`B2_PREFIX=${prefix}`)
console.log('\nThe application key is shown only once. Store it now.')
