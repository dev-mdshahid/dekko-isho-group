# Careers Platform Plan

**Status:** Plan only, not implemented
**Date:** 3 Oct 2026 (revised: Firebase Hosting + Firestore, Express on the RPA droplet, Backblaze `hr-main-website/`, Vercel retired)

## 1. What we're building

| Part | Where | Who uses it |
|---|---|---|
| All open roles page | Public website, `/career/jobs` | Applicants |
| Circular details page with application form | Public website, `/career/jobs/:slug` | Applicants |
| "Apply for a future position" form | Public website, `/career/apply` | Applicants |
| Careers page update | Public website, `/career` (existing) | Applicants |
| HR portal: recruitment app (circulars, form builder, settings) | `/hr/admin` on the same domain | Named HR staff only |
| CV Bank | Inside the HR portal | Named HR staff only |
| API: Backblaze, CV reading, emails, spam checks, all data access | Express app in this repo, running at `https://hr.dekkoai.online` | Website + HR portal |

### Decisions taken

| Area | Choice |
|---|---|
| Live site | Firebase Hosting (project `dekko-isho-group`) is the **only** live site, for both the website and `/hr/admin`. Vercel is retired. |
| Database | Firestore (same Firebase project) |
| API | Express (TypeScript) on the **RPA automation droplet** `159.223.50.93`, behind Caddy at `hr.dekkoai.online` (DNS already points there) |
| File storage | Backblaze B2, same account as the DMS, everything under the `hr-main-website/` folder |
| Repo | This repo becomes a monorepo: website, HR portal, API, shared types |
| HR access | `/hr/admin`, email + password, only accounts that an admin creates |

### Current state

- **Roles:** hardcoded in `src/data/career/content.ts` (title, department, location, type only).
- **Applications:** a single Google Form (`forms.gle/7v7Xybpjd5wboKi9A`).
- **Backend:** none. Contact and subscribe forms only log to the console (`src/lib/forms.ts`).
- **Firebase:** project `dekko-isho-group`, used for hosting only. The site is also on Vercel (to be retired, section 2).

### What we reuse from the DMS backend

`Dekko-DMS-Backend-Server` (NestJS) already has working code we port into Express:

| DMS file | What it does | Reused for |
|---|---|---|
| `src/backblaze/backblaze.service.ts` | `b2_authorize_account`, `b2_get_upload_url`, `b2_get_download_authorization`, `b2_delete_file_version`, `b2_create_key` | CV upload, short-lived CV links, deletes, creating a scoped key |
| `scripts/configure-b2-cors.ts` | Bucket CORS setup | Not needed: uploads go through Express, so browsers never talk to B2 |
| `src/ocr/pdf-text.util.ts` + `openai-ocr.client.ts` | Read the PDF text layer first, OpenAI OCR only for scans | CV text extraction |
| `nodemailer` setup | SMTP email | Applicant and HR emails |

Env var names in the DMS: `BACKBLAZE_ACCOUNT_ID`, `BACKBLAZE_APPLICATION_KEY`, `BACKBLAZE_*_BUCKET_ID/NAME`, `OPENAI_API_KEY`, `OPENAI_OCR_MODEL`.

**Backblaze, as checked on 3 Oct 2026 (read-only):**
- The account has one bucket, `Dekko-Document-Management-System`, and it is **`allPrivate`**. The "public bucket" comment in the DMS `.env` is out of date.
- So CVs can live in that bucket under `hr-main-website/`, without being publicly reachable.
- The DMS key is a full-access key (it includes `writeKeys`). The plan uses it **once** to create a new application key that only works on that bucket **and only inside `hr-main-website/`** (B2 key `namePrefix`). The website API runs on that scoped key, so it can never read or delete DMS documents.

---

## 2. Monorepo layout

npm workspaces (no extra tooling needed):

```text
dekko-isho-group-website/
├── apps/
│   ├── web/            ← the current website, moved as-is (React + Vite)
│   ├── hr-admin/       ← new HR portal (React + Vite, base path /hr/admin/)
│   └── api/            ← new Express API (TypeScript)
├── packages/
│   └── shared/         ← zod schemas + types: job, form definition, CV profile, application
├── firebase.json       ← hosting only (web + hr-admin), Firestore rules
├── .firebaserc         ← default: dekko-isho-group
├── firestore.rules     ← deny all client access
├── firestore.indexes.json
├── ecosystem.config.cjs ← pm2 entry for the API on the droplet
└── package.json        ← workspaces + root scripts
```

**Root scripts**

| Script | Does |
|---|---|
| `npm run dev` | Runs web (`http://localhost:5173`), hr-admin (`http://localhost:5174/hr/admin/`) and api (`http://localhost:8794`) together. Both Vite apps proxy `/api` to the local API. |
| `npm run build` | Builds shared, then web, hr-admin and api |
| `npm run deploy:web` | Builds web + hr-admin and runs `firebase deploy --only hosting,firestore:rules,firestore:indexes --project dekko-isho-group` (from a laptop) |
| `npm run deploy:api` | Runs on the droplet only: `git pull`, install API deps, build, `pm2 reload dekkoisho-website-api` (section 3.3) |

**Build output:** `apps/web/dist` is the hosting root and the HR portal builds into `apps/web/dist/hr/admin/`, so both deploy as one Firebase Hosting site.

**Moving the website:** `git mv` everything website-related into `apps/web`. Imports, `public/` and the Vite config stay relative, so code changes should be close to zero. Existing scripts (`prepare-firebase-hosting.mjs`, `optimize-video.mjs`) move with it and their paths get updated.

### Retiring Vercel

1. Delete `vercel.json` from the repo.
2. In Vercel, disconnect the Git integration and delete the `dekko-isho-group` project, so pushes to `main` stop deploying `dekko-isho-group.vercel.app`.
3. Remove any Vercel references from the README and docs. `https://dekko-isho-group.web.app` (and the custom domain, once attached) is the only live site.

---

## 3. Architecture

```text
              Firebase Hosting — the only live site (dekko-isho-group.web.app / custom domain)
   ┌──────────────────────────────────────────┬───────────────────────────────────────┐
   │ /  /career  /career/jobs  /career/apply  │ /hr/admin/**                          │
   │ apps/web (public SPA)                    │ apps/hr-admin (HR SPA, Firebase Auth) │
   └────────────────────┬─────────────────────┴───────────────────┬───────────────────┘
                        │ fetch https://hr.dekkoai.online/api/...
                        │ (public routes)                         │ (+ Firebase ID token)
                        ▼                                         ▼
     RPA droplet 159.223.50.93 ── Caddy (TLS) ── hr.dekkoai.online
                                                   │ reverse_proxy 127.0.0.1:8794
                                                   ▼
                                  apps/api (Express) under pm2: dekkoisho-website-api
            ┌──────────────┬──────────────────┬──────────────┼─────────────┬──────────────┐
            ▼              ▼                  ▼              ▼             ▼              ▼
       Firestore     Backblaze B2        OpenAI         Turnstile     SMTP email    Firebase Auth
      (Admin SDK)   DMS bucket,        (OCR + CV       (spam check)  (nodemailer)  (verify HR
                    hr-main-website/    extraction)                                 ID tokens)
```

**Rules of the system**
- Browsers never talk to Firestore or Backblaze directly. Everything goes through Express, which uses the Firebase Admin SDK and holds the Backblaze, OpenAI, Turnstile and SMTP secrets.
- `firestore.rules` denies all client reads and writes, so no CV data can leak from the browser.
- The website and HR portal call the API on its own subdomain, so the API allows only listed origins (CORS):
  - `https://dekko-isho-group.web.app`
  - `https://dekko-isho-group.firebaseapp.com`
  - The custom domain, once attached.
  - `http://localhost:5173` and `http://localhost:5174` for development.
- The frontends read the API address from `VITE_API_BASE_URL`: `https://hr.dekkoai.online` in production, and empty in development so the Vite proxy is used.

### 3.1 Droplet facts (checked read-only on 3 Oct 2026)

| Item | Value |
|---|---|
| Host | `root@159.223.50.93`, the same droplet as `rpa.dekkoai.online`, `dms-api.dekkoai.online` and `azra-collective.dekkoai.online` |
| DNS | `hr.dekkoai.online` resolves to `159.223.50.93` |
| Node | v22.20.0 via nvm at `/root/.nvm` |
| Process manager | pm2 (8 apps running: dekko-api, dekko-dashboard, dekko-dms-api, azra-api, azra-mcp, bonotech-mail-api, ddas-mcp, dvm-mcp) |
| Reverse proxy | Caddy, `/etc/caddy/Caddyfile`, automatic HTTPS |
| Ports in use | 5173, 7412, 8456, 8787, 8790–8793. **New API port: `8794`** (loopback only) |
| Memory | 2 GB RAM after the resize (about 790 MB available, swap unused) |
| Disk | 48 GB, 39 GB free |
| Secrets folder | `/root/secrets/` exists |

**Memory:** the new API should use about 100–150 MB. To be a good neighbour to the DMS and RPA apps on the same server, the plan still:
- Never builds the website or HR portal on the droplet. Only the API and shared workspaces are installed and built there.
- Limits CV reading to 2 at a time.
- Sets a pm2 `max_memory_restart` of 400 MB.

### 3.2 One-time droplet setup

1. Clone this repo to `/root/dekko-isho-group-website` (git, not file copies).
2. Create `apps/api/.env` (`chmod 600`) containing:
   - `PORT=8794`, `HOST=127.0.0.1`, `NODE_ENV=production`
   - `CORS_ORIGINS`
   - `GOOGLE_APPLICATION_CREDENTIALS=/root/secrets/dekko-isho-group-firebase-sa.json`
   - `B2_*` (the scoped key)
   - `OPENAI_API_KEY`, `TURNSTILE_SECRET`, `SMTP_*`
3. Put the Firebase service account for `dekko-isho-group` (Firestore + Auth admin) at `/root/secrets/dekko-isho-group-firebase-sa.json`, `chmod 600`.
4. Install and build only the API: `npm ci -w packages/shared -w apps/api --include-workspace-root`, then `npm run build -w packages/shared -w apps/api`.
5. Start under pm2 with the repo's `ecosystem.config.cjs`. The process is `dekkoisho-website-api`, it runs `node apps/api/dist/server.js` through nvm (the same pattern as the RPA repo), and has `max_memory_restart: 400M`. Then `pm2 save`.
6. Add a site block to `/etc/caddy/Caddyfile`, then `caddy validate` and reload Caddy (**this needs your go-ahead at the time, since it touches a shared production proxy**):

```caddyfile
hr.dekkoai.online {
	encode gzip zstd
	request_body {
		max_size 12MB
	}
	header {
		Strict-Transport-Security "max-age=31536000"
		X-Content-Type-Options "nosniff"
		-Server
	}
	reverse_proxy 127.0.0.1:8794
}
```

7. Smoke test with `curl https://hr.dekkoai.online/api/health`.

Express sets `trust proxy` to loopback, so rate limits see the real visitor IP from Caddy.

### 3.3 Deploy flow (git only, no file copying)

**API (droplet):**
1. Commit and push to `origin`.
2. `ssh root@159.223.50.93`, then `cd ~/dekko-isho-group-website && npm run deploy:api`. That runs:
   - `git pull`
   - `npm ci -w packages/shared -w apps/api --include-workspace-root`
   - Build shared and api
   - `pm2 reload dekkoisho-website-api`
3. Only the new API process reloads. The DMS, RPA and other apps on the droplet aren't touched.

**Website + HR portal (Firebase):** `npm run deploy:web` from a laptop. This also deploys `firestore.rules` and the Firestore indexes to `dekko-isho-group` only.

---

## 4. HR portal: `/hr/admin`

### 4.1 Access

- **Sign-in:** Firebase Authentication, email + password. Self sign-up is disabled, so accounts only exist if an admin creates them.
- **Creating accounts:** an admin adds the person in the portal (Users screen). Express creates the Firebase user with the Admin SDK, sets their role, and emails a "set your password" link. The first admin, **`ekram@bonotech.io`** (role `hr_admin`), is created with a one-off script on the droplet (`npm run create-admin -w apps/api -- ekram@bonotech.io`), which emails a "set your password" link.
- **Roles:** stored as Firebase custom claims and mirrored in a `staffUsers` document.

| Role | Can do |
|---|---|
| `hr_admin` | Everything, plus manage HR users and settings |
| `recruiter` | Circulars, form builder, CV Bank |
| `viewer` (optional) | Read-only CV Bank and circulars |

- **Every API call** from the portal sends the Firebase ID token. Express verifies it, checks the role claim, and rejects disabled users. Removing someone in the portal disables them immediately and revokes their sessions.
- **Extra protection:**
  - Login lockout after repeated failures (Firebase built-in).
  - Optional two-step verification (TOTP) for admins.
  - Sessions expire after inactivity.
  - Password reset by email.
- **Not public:** `/hr/admin` sends `noindex` headers and is excluded from `robots.txt` and the sitemap. The public website bundle contains no HR code, because the portal is a separate app.

### 4.2 Portal screens

| Screen | Contents |
|---|---|
| Sign in | Email, password, "Forgot password" |
| Dashboard | Open circulars, new applications this week, closing soon |
| Circulars | List, editor, preview (4.3) |
| Form templates | Form builder (4.4) |
| CV Bank | Search, filters, candidate detail (4.6) |
| Settings | Departments, locations, job types, custom fields, email templates, privacy (4.5) |
| Users | Add, change role, disable HR users (admin only) |

### 4.3 Circulars

**List view**
- Tabs: Drafts, Published, Scheduled, Closed, Archived
- Search by title; filter by department and location
- Columns: title, department, applications count, deadline, status
- Actions: edit, preview, duplicate, close, reopen, archive, copy public link

**Editor sections**
1. **Basics:** title, URL slug (auto-generated, editable), department, one or more locations, job type.
2. **Compensation:** salary minimum and maximum, currency (BDT by default), period, and display mode: show range, "Negotiable", or hide.
3. **Dates:** publish now or schedule, plus an application deadline that closes the role automatically.
4. **Card summary:** the 2–3 lines shown on the all-roles page. Pre-filled from the description and editable, with a character counter.
5. **Description:** rich text editor (TipTap) with headings, bold and italic, lists, links, quotes and dividers. Pasted content from Word or Google Docs is cleaned up, and the HTML is sanitised on the server before it's saved.
6. **Custom fields:** values for any extra fields defined in Settings.
7. **Application form:** pick a template or build one (4.4).
8. **Preview:** the card and details page as they'll look on the website, on desktop and mobile.

**Publishing:** a circular can only be published once its required fields are filled and the form contains the locked fields.

### 4.4 Form builder

A simple vertical builder: add fields, drag to reorder, edit and remove.

- **Locked fields** (always present): CV upload (always first), full name, email, phone, consent.
- **Field types:**
  - Text: short text, long text, email, phone, number, date, URL.
  - Choice: dropdown, multi-select, checkboxes, yes/no.
  - Other: file upload, and repeatable education and work-experience groups.
- **Per field:**
  - Label, help text and placeholder.
  - Required or optional, plus options for choice fields.
  - Length and size limits.
  - **Autofill mapping** to a CV value.
- **Templates** for reuse.
- **Versioning:** editing a form that already has applicants creates a new version, so older answers keep their original questions.

### 4.5 Settings

- **Lists:** departments, locations and job types.
- **Custom fields:**
  - Each has a name and a type: text, number, number range, dropdown, multi-select or yes/no.
  - Three toggles: show on role cards, filter on the website, filter in the CV Bank.
- **Email templates:** application received, talent pool acknowledgement.
- **Privacy:** the consent text. CVs are kept forever (no automatic deletion).

### 4.6 CV Bank

Every application across every circular, including the talent pool, in one list.

**Search**
- By name, phone or email, with partial matches. Phone numbers are normalised, so `01711…`, `+8801711…` and `880 1711…` all match.
- "Search inside CVs" covers the extracted CV text, e.g. "SAP", "IELTS", "merchandising".

**Filters**

| Group | Filters |
|---|---|
| Circular | Circular, department, location, job type, custom fields |
| Application | Status (New, Reviewed, Shortlisted, Interview, Offer, Hired, Rejected), date applied, source (circular or talent pool) |
| From the CV | Years of experience (range), highest education level, field of study, skills, current or last title, current or last company, candidate city, languages, certifications |

**List and detail**
- **Table:** name, applied for, department, location, years of experience, highest education, status and date.
- **Lists:** saved filters, bulk status change, tags, and export to CSV or Excel.
- **Candidate detail:**
  - CV preview through a link that expires in a few minutes.
  - Extracted profile, which recruiters can correct (the original is kept).
  - Form answers.
  - Other applications by the same person, so repeat applicants show as one candidate.
  - Status, tags, notes and an activity history.

**How search works with Firestore:** Firestore can't do partial-text search, search inside text, or several range filters in one query. So:
- The CV Bank API in Express keeps a search index in memory (MiniSearch), built from Firestore when the server starts and updated on every write.
- All search, filters, sorting and paging happen in Express against that index. Results come back instantly, and only the current page's documents are read from Firestore.
- This comfortably handles tens of thousands of applications. If volume ever goes well beyond that, swap the index for Typesense or Algolia without changing the portal.
- This fits the droplet well: one long-lived pm2 process (fork mode, a single instance) holds the index and rebuilds it on restart in a few seconds. For a few thousand applications the index is a few MB of RAM.

---

## 5. Public website changes (`apps/web`)

### 5.1 All open roles page: `/career/jobs`

Modelled on the Google Careers results page.

- **Layout:** filters on the left and results on the right on desktop. On mobile, a "Filters" button opens a full-screen drawer.
- **Search:** searches role titles, plus department and summary text.
- **Filters:** department, location and job type (multi-select), experience level, and any custom field marked "filter on the website".
- **Active filters** show as removable chips, with "Clear all".
- **Result count and sort:** newest first, or closing soon.
- **Role card:**
  - Title, department, location, job type and salary (or "Negotiable", or hidden).
  - Deadline and a 2–3 line summary.
  - "Posted 3 days ago", plus a "New" tag for the first 7 days.
  - The whole card links to the details page.
- **URL state:** search and filters live in the URL (e.g. `/career/jobs?dept=technology&location=dhaka&q=engineer`), so links can be shared and the back button works.
- **Data:** `GET /api/jobs` returns all published jobs (cached in API memory and sent with a 60-second `Cache-Control`), and filtering runs in the browser.
- **Empty state:** "No roles match your search", a button to clear the filters, and a link to "Apply for a future position".

### 5.2 Circular details page: `/career/jobs/:slug`

- **Header:** title, department, location, job type, salary, deadline, posted date, and share buttons (copy link, LinkedIn, WhatsApp, Facebook).
- **Body:** the full rich text description, plus custom field rows.
- **Apply section:**
  - A sticky "Apply now" button on mobile.
  - **CV upload first**, with autofill (section 6).
  - The rest of the form comes from that circular's form version, plus consent.
  - Turnstile, then a thank-you screen and a confirmation email.
- **Closed or expired:** "This role is no longer accepting applications", plus similar roles and "Apply for a future position". An unknown slug shows the 404 page.
- **SEO:**
  - Per-job title, description and Open Graph tags.
  - `JobPosting` structured data so roles show in Google's job listings.
  - Firebase Hosting can only forward requests to Google Cloud backends, not to the droplet. So the tags are added in the browser: Google reads `JobPosting` data added by JavaScript, so roles still appear in Google's job listings.
  - **Link previews** (WhatsApp, LinkedIn, Facebook) don't run JavaScript. The share buttons therefore use `https://hr.dekkoai.online/share/jobs/:slug`: Express returns a tiny page with the job's title, summary and image tags, which forwards visitors straight to the real job page. (Decision 4 in section 13: accept this share link, or keep plain links with generic previews.)

### 5.3 "Apply for a future position": `/career/apply`

The same page, backed by a permanent "Talent pool" circular that HR owns. It uses the same CV upload and autofill, plus fields for departments and locations of interest. These CVs land in the CV Bank tagged "Future position".

### 5.4 Careers page update: `/career`

- **Open Positions:** the latest 6 roles from `/api/jobs`, each linking to its details page.
- **"All Roles"** goes to `/career/jobs`.
- **New last row:**
  > **Don't see a role you're interested in?** Drop your CV and we'll get in touch when a matching role opens. → *Apply for a future position*
- **If the API can't be reached:** hide the job list and keep the "future position" row and "See all roles" link.
- This also covers the Doc 1 "drop your CV" request and meeting item 18.

---

## 6. CV upload, extraction and autofill

### 6.1 What the applicant sees

1. They choose or drop a PDF, DOCX, DOC, JPG or PNG (up to 10 MB).
2. A progress bar shows, then "Reading your CV…".
3. Within about 5–10 seconds the form fills in. Filled fields are highlighted and stay editable.
4. If reading fails, they fill the form in themselves and the CV is still attached.

### 6.2 Pipeline (all inside Express)

```text
Browser ──POST /api/cv/upload (multipart, Turnstile token)──► Express
   1. verify Turnstile, rate limit per IP
   2. check real file type by magic bytes + size
   3. upload to B2: hr-main-website/cv/pending/{yyyy}/{mm}/{uploadId}.{ext}   (b2_get_upload_url + upload)
   4. extract text:
        PDF with text layer → pdf-parse            (DMS pdf-text.util)
        DOCX                → mammoth
        scanned PDF / image → OpenAI OCR           (DMS openai-ocr.client)
   5. OpenAI structured output → CV profile JSON (zod-validated, from packages/shared)
   6. normalise: phone → E.164, lowercase email, dates, total years
   7. save uploads/{uploadId} in Firestore (status, profile, raw text, B2 file id)
◄── { uploadId, autofill: { only the fields this form maps to } }

Browser ──POST /api/applications (answers, uploadId, Turnstile)──► Express
   - validate answers against the circular's form version
   - find or create candidate (by email, then phone)
   - copy B2 file to hr-main-website/cv/candidates/{candidateId}/{applicationId}/cv.{ext}, delete pending
   - write application with denormalised filter fields; update search index
   - send confirmation email
Cleanup (scheduled): delete pending uploads older than 24 hours from B2 and Firestore
```

Proxying uploads through Express (rather than browser → B2 direct) means the API checks every file before it's stored, and no B2 CORS setup is needed. Caddy caps request bodies at 12 MB and multer at 10 MB per file.

### 6.3 CV profile schema (`packages/shared`)

```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string (E.164)",
  "location": { "city": "string", "country": "string" },
  "links": { "linkedin": "string", "portfolio": "string", "other": ["string"] },
  "summary": "string",
  "currentTitle": "string",
  "currentCompany": "string",
  "totalExperienceYears": "number",
  "experience": [
    { "title": "string", "company": "string", "location": "string",
      "startDate": "YYYY-MM", "endDate": "YYYY-MM | present", "description": "string" }
  ],
  "education": [
    { "degree": "string", "level": "SSC | HSC | Diploma | Bachelor | Master | PhD | Other",
      "field": "string", "institution": "string", "startYear": "number",
      "endYear": "number", "result": "string" }
  ],
  "highestEducationLevel": "string",
  "skills": ["string"],
  "languages": ["string"],
  "certifications": [{ "name": "string", "issuer": "string", "year": "number" }]
}
```

Each extraction also stores the raw text, model, prompt version, status and a confidence note, so CVs can be re-processed later.

### 6.4 Autofill mapping

| CV value | Form field |
|---|---|
| `fullName`, `email`, `phone` | Locked name, email and phone fields |
| `location` | Fields mapped to "Location" |
| `education[]` | Education group, or a highest-degree field |
| `experience[]` | Work experience group, or current title and company |
| `totalExperienceYears` | "Years of experience" |
| `skills`, `links.linkedin` | Mapped text or URL fields |

The applicant's final answers are what's stored as the application. The extraction is stored separately, so the CV Bank can filter on both.

---

## 7. Backblaze setup

**Bucket:** `Dekko-Document-Management-System` (`allPrivate`, shared with the DMS). Everything this project stores lives under one top-level folder, `hr-main-website/`, so it never mixes with DMS files.

### 7.1 Folder structure

```text
hr-main-website/
├── cv/
│   ├── pending/{yyyy}/{mm}/{uploadId}.{ext}                    ← uploaded, not yet submitted (auto-deleted after 1 day)
│   └── candidates/{candidateId}/{applicationId}/cv.{ext}       ← the CV attached to a submitted application
├── attachments/{candidateId}/{applicationId}/{fieldKey}/{safeFileName}   ← extra files from form "file upload" fields
├── circulars/{jobId}/images/{imageId}.{ext}                    ← images used inside job descriptions
├── exports/{yyyy-mm-dd}/{exportId}.{csv|xlsx}                  ← CV Bank exports (auto-deleted after 1 day)
└── imports/google-form/{yyyy-mm-dd}/…                          ← only if past Google Form responses are migrated
```

- **Naming:**
  - IDs are Firestore document IDs and file names are slugified, so paths stay stable and contain no personal data.
  - The original file name and size are kept in Firestore metadata instead.
- **Job description images:** these must be visible to the public, but the bucket is private. Express serves them at `/api/media/circulars/{jobId}/{imageId}` with long cache headers (fetched from B2 once and cached on disk on the droplet).

### 7.2 One-off setup script (`npm run b2:setup -w apps/api`)

Run once from a laptop. It reads the DMS account credentials (`BACKBLAZE_ACCOUNT_ID`, `BACKBLAZE_APPLICATION_KEY`) from a local, uncommitted env file, then:
1. Creates a new application key `dekkoisho-main-website-api`, limited to the DMS bucket **with `namePrefix: hr-main-website/`**. It gets `listFiles`, `readFiles`, `writeFiles`, `deleteFiles` and `shareFiles`, and nothing else (no bucket or key admin).
2. Adds two lifecycle rules to the bucket, scoped by prefix so they can't affect DMS files:
   - `hr-main-website/cv/pending/`: hide after 1 day, delete 1 day later.
   - `hr-main-website/exports/`: hide after 1 day, delete 1 day later.
   - The script reads the existing lifecycle rules first and appends to them. There are none today.
3. Prints the new key ID and key once, to paste into `apps/api/.env` on the droplet.

### 7.3 Runtime

- **API secrets** in `apps/api/.env` (droplet, `chmod 600`):
  - `B2_KEY_ID`, `B2_APPLICATION_KEY`
  - `B2_BUCKET_ID`, `B2_BUCKET_NAME=Dekko-Document-Management-System`
  - `B2_PREFIX=hr-main-website/`
  - The DMS full-access key is never stored in this repo or used by this API.
- **Path guard:** every path is built by one helper that always prepends `B2_PREFIX`. The scoped key would reject anything outside the folder anyway.
- **Downloads:** when HR clicks "View CV", Express checks the role, calls `b2_get_download_authorization` for that one file with a 5-minute expiry, logs the view, and returns the link.
- **Deletes:** CVs are kept forever. Files are only removed when an admin deletes a candidate by hand (e.g. on request), which calls `b2_delete_file_version` on every version under that candidate's folders. Unsubmitted `pending/` uploads and old exports are still cleaned up.

---

## 8. Data model (Firestore)

| Collection | Key fields |
|---|---|
| `departments`, `locations`, `jobTypes` | name, slug, sortOrder, active |
| `customFields` | key, label, type, options, showOnCard, filterPublic, filterCvBank |
| `jobs` | slug, title, departmentId, locationIds[], jobTypeId, salary {min, max, currency, period, display}, summary, descriptionJson, descriptionHtml, customFields {}, status, publishAt, deadline, isTalentPool, formVersionId, applicationsCount, createdBy, timestamps |
| `formTemplates` | name, schema |
| `formVersions` | jobId or templateId, version, schema (immutable once used) |
| `uploads` | status, b2FileId, b2FileName, mime, size, sha256, rawText, profile, model, promptVersion, createdAt (24-hour TTL policy) |
| `candidates` | fullName, email, phoneE164, city, latestProfile, cvFileIds[], applicationIds[], createdAt |
| `applications` | jobId, candidateId, formVersionId, answers {}, cvFile {b2FileId, name}, status, source, tags[], submittedAt, plus **denormalised filter fields**: departmentId, locationIds[], jobTypeId, customFields {}, expYears, eduLevel, skills[], currentTitle, currentCompany, city |
| `applications/{id}/notes` | authorUid, body, createdAt |
| `staffUsers` | uid, email, name, role, disabled, lastLoginAt |
| `auditLog` | actorUid, action (incl. CV view/download, export, delete), target, at |
| `counters` / `meta` | slug uniqueness, index rebuild markers |

- **Rules:**
  - `firestore.rules` is deny-all for clients; the Admin SDK in Express bypasses the rules.
  - A Firestore TTL policy on `uploads.createdAt` deletes stale pending uploads.
- **Indexes:** only what Express needs to read pages: jobs by status + publishAt, and applications by jobId + submittedAt. Everything else is served from the in-memory search index.

---

## 9. API routes (`apps/api`)

| Route | Access | Purpose |
|---|---|---|
| `GET /api/jobs`, `GET /api/jobs/:slug` | Public | Published jobs, with the form version for the details page |
| `GET /api/meta` | Public | Departments, locations, job types, public custom fields |
| `POST /api/cv/upload` | Public, Turnstile, rate limited | Upload, extract, return autofill |
| `POST /api/applications` | Public, Turnstile, rate limited | Submit an application |
| `POST /api/contact`, `POST /api/subscribe` | Public, Turnstile | Wire up the existing website forms (fixes `src/lib/forms.ts`) |
| `/api/hr/jobs/*` | HR | Circular CRUD, publish, close, duplicate |
| `/api/hr/forms/*` | HR | Templates and versions |
| `/api/hr/cv-bank/search` | HR | Search + filters + paging |
| `/api/hr/candidates/:id`, `/api/hr/applications/:id/*` | HR | Detail, status, tags, notes, CV link |
| `/api/hr/export` | HR | CSV or Excel export (logged) |
| `/api/hr/settings/*` | `hr_admin` | Lists, custom fields, templates, privacy |
| `/api/hr/users/*` | `hr_admin` | Create, change role, disable HR users |
| `GET /api/health` | Public | Health check for Caddy and uptime monitoring |
| `GET /api/media/circulars/:jobId/:imageId` | Public | Job description images from B2, cached on disk |
| `GET /share/jobs/:slug` | Public | Link-preview page that forwards to the website job page |
| Scheduled jobs (`node-cron` inside the API process) | Internal | Auto-publish and auto-close every minute, pending cleanup hourly |

**Stack:**
- Express 5 and helmet; zod validation using the shared schemas.
- `multer` for in-memory uploads, `express-rate-limit`, and `firebase-admin`.
- `openai`, `pdf-parse` and `mammoth` for reading CVs; `nodemailer` for email.
- `sanitize-html` for job descriptions, `libphonenumber-js` for phone numbers, `minisearch` for the CV Bank index, `pino` for logs.

---

## 10. Security and privacy

- **CV storage:** the private DMS bucket, inside `hr-main-website/` only, with a key that can't reach anything else. CVs are only viewable through 5-minute links, and every view, download and export is logged.
- **API exposure:** Express listens on `127.0.0.1:8794` only. The public reaches it through Caddy (HTTPS) on `hr.dekkoai.online`. CORS allows only the Firebase Hosting origins, and helmet sets security headers.
- **Shared droplet:** the API runs as its own pm2 process with a memory cap. Its `.env` and the Firebase service account are `chmod 600`.
- **No client data access:** Firestore rules deny everything, and all reads and writes go through Express with role checks.
- **Upload checks:** real file type checks, size limits, and Turnstile plus rate limits on upload, submit, contact and subscribe, so bots can't run up OpenAI costs.
- **HR accounts:**
  - Created by admins only, with no self sign-up.
  - Optional two-step verification, and instant disable with session revoke.
- **Secrets:** Backblaze, OpenAI, Turnstile and SMTP secrets exist only in `apps/api/.env` on the droplet (and a local copy for development). None of them get the `VITE_` prefix, so none reach the browser.
- **Consent and retention:**
  - Applicants agree to the privacy notice, and the talent pool asks for explicit opt-in.
  - CVs are kept forever. The privacy notice says so, and admins can still delete a candidate on request.
- **OpenAI:** use the API with no data retention for training (`store: false`, as in the DMS `OPENAI_RESPONSES_STORE`), and mention it in the privacy notice.
- **Safe rendering:** job HTML is sanitised on the server before it's saved.

---

## 11. Emails (nodemailer, Gmail) — built

**Sender:** `Dekko Isho Group Careers <dekkoishogroup.info@gmail.com>`. It uses a Google app password stored in `apps/api/.env`, which is git-ignored and goes on the droplet at deploy time. The SMTP login and real sends were tested on 3 Oct 2026.

**Code:** `apps/api/src/email/`
- `brand.ts`: site colours, fonts, contact details and social links.
- `layout.ts`: the shared shell. It has a blue-to-navy header with the white logo, the three-colour logo stripe, a white card, and a dark footer (public) or short footer (staff). It also holds the reusable blocks: details card, numbered steps, callout, stats, table and pill button.
- `templates.ts`: the six emails below. Each returns a subject, HTML and an auto-generated plain-text version, and every dynamic value is HTML-escaped.
- `mailer.ts`: a pooled Gmail transport.

| Email | Sent to | Template |
|---|---|---|
| Application received | Applicant | `applicationReceived` |
| Talent pool acknowledgement | Applicant | `talentPoolAcknowledgement` |
| HR account invite | New HR user | `hrInvite` (the link comes from Firebase Admin `generatePasswordResetLink`, sent in our styled email instead of Firebase's default) |
| Password reset | HR user | `passwordReset` (same approach) |
| New applications daily digest | Recruiters | `newApplicationsDigest` |
| Circular closing soon or closed | Circular owner | `circularClosing` |

**Scripts:**
- `npm run email:preview` writes HTML and text previews to `apps/api/.email-previews/` (git-ignored).
- `npm run email:test -- <to> [name|all]` sends real samples.

**Gmail limit:** about 500 emails a day. Move to a domain mailbox or a sending service (only the settings change) if volume grows.

---

## 12. Delivery phases

| Phase | Scope | Rough effort (1 developer) |
|---|---|---|
| 0. Decisions and design | Answer section 13; design the roles page, details page, HR portal and CV Bank | 3–5 days |
| 1. Monorepo + foundation | Move the website to `apps/web` and confirm it builds and deploys to Firebase unchanged. Retire Vercel. Scaffold `apps/api`, `apps/hr-admin` and `packages/shared`. Enable Firestore on `dekko-isho-group` with deny-all rules and the `/hr/admin` hosting rewrite. Droplet setup: clone, `.env`, service account, pm2 `dekkoisho-website-api`, Caddy block for `hr.dekkoai.online`. Backblaze scoped key and lifecycle rules for `hr-main-website/`. HR sign-in, roles, Users screen, settings lists | 1.5 weeks |
| 2. Circulars live | Circular editor with TipTap, publish and close, scheduled jobs. Public `/career/jobs` and `/career/jobs/:slug` with a fixed basic form. `/career` update, talent pool. Contact and subscribe wired up | 1.5–2 weeks |
| 3. CV upload and autofill | Upload to B2, text extraction and OCR fallback (ported from the DMS), OpenAI extraction, autofill, candidate matching, cleanup | 1–1.5 weeks |
| 4. CV Bank | Search index, search and filters, candidate detail with CV links, statuses, notes, export, saved filters, audit log | 1.5–2 weeks |
| 5. Form builder and custom fields | Builder UI, field types, autofill mapping, templates, versioning, custom fields on cards and filters | 1–1.5 weeks |
| 6. Hardening | Emails, `JobPosting` SEO, responsive and accessibility pass, abuse testing, two-step verification for admins | 1 week |

**Total:** about 8–10 weeks for one developer. Phase 2 can go live on its own and replace the Google Form early.

---

## 13. Decisions

### Settled

- **API:** Express on the RPA droplet (`159.223.50.93`) at `https://hr.dekkoai.online`, port 8794, pm2 `dekkoisho-website-api`.
- **Live site:** Firebase Hosting is the only live site, and Vercel is retired.
- **Storage:** Backblaze, the DMS account and its private bucket, under `hr-main-website/`, with a key scoped to that folder.
- **Droplet:** resized to 2 GB RAM.
- **First HR admin:** `ekram@bonotech.io`.
- **CV retention:** kept forever.

### Defaults (used unless changed)

1. **Reading CVs:** OpenAI, the same as the DMS.
2. **HR login:** email and password; two-step verification is available but not forced.
3. **Sharing a job on WhatsApp/LinkedIn:** share links go through `hr.dekkoai.online/share/jobs/…`, so the preview shows the job title and summary, then opens the website job page.
4. **Website address:** `dekko-isho-group.web.app` for now. When a custom domain is attached, add it to the API's allowed origins and Firebase Auth.
5. **Salary on circulars:** optional. HR can show a range, show "Negotiable", or hide it.
6. **Emails:** sent from `dekkoishogroup.info@gmail.com` as "Dekko Isho Group Careers" (settled).
7. **Google Form:** switched off once the new application form is live; old responses aren't imported.
