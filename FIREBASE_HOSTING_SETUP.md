# Firebase Hosting Setup

This repo is configured for Firebase Hosting with project `dekko-isho-group`.

## 1) Generate browser Firebase config from `.env`

```bash
node scripts/generate-firebase-config.mjs
```

This creates `js/firebase-config.js` (gitignored), which is loaded by `index.html`.

## 2) Login to Firebase

```bash
npx -y firebase-tools@latest login
```

## 3) Verify selected project

```bash
npx -y firebase-tools@latest use
```

It should show `dekko-isho-group`.

## 4) Test locally (Hosting emulator)

```bash
npx -y firebase-tools@latest emulators:start --only hosting
```

## 5) Deploy

```bash
npx -y firebase-tools@latest deploy --only hosting
```
