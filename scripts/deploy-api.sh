#!/usr/bin/env bash
# Runs ON the droplet from the repo root: pulls, checks credentials, tests, builds only the API, then reloads its pm2 process.
# Never builds the website or HR portal here (those deploy to Firebase Hosting from a laptop).
# Usage: scripts/deploy-api.sh [expected-version]   (scripts/deploy.sh passes the version it just released)
set -euo pipefail
EXPECTED_VERSION="${1:-}"

cd "$(dirname "$0")/.."

if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  source "$HOME/.nvm/nvm.sh"
fi

if [ ! -f apps/api/.env ]; then
  echo "apps/api/.env is missing. Create it (chmod 600) before deploying." >&2
  exit 1
fi

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Working tree has local changes. Clean it with git (stash/checkout) before deploying." >&2
  git status --short --untracked-files=no >&2
  exit 1
fi

echo "→ git pull"
git pull --ff-only

VERSION="$(node -p "require('./package.json').version")"
if [ -n "$EXPECTED_VERSION" ] && [ "$VERSION" != "$EXPECTED_VERSION" ]; then
  echo "Pulled v$VERSION but expected v$EXPECTED_VERSION. Is the droplet on the release branch?" >&2
  exit 1
fi
echo "  v$VERSION"

echo "→ check credentials"
node scripts/check-env.mjs api apps/api/.env

echo "→ install (shared + api only)"
npm ci -w @dekko-isho/shared -w @dekko-isho/api

echo "→ build shared"
npm run build -w @dekko-isho/shared

echo "→ unit tests"
npm run test:unit -w @dekko-isho/api

echo "→ build api"
npm run build -w @dekko-isho/api

if pm2 describe dekkoisho-website-api >/dev/null 2>&1; then
  echo "→ pm2 reload dekkoisho-website-api"
  pm2 reload ecosystem.config.cjs --only dekkoisho-website-api --update-env
else
  echo "→ pm2 start dekkoisho-website-api (first run)"
  pm2 start ecosystem.config.cjs --only dekkoisho-website-api
  pm2 save
fi

sleep 3
PORT="$(grep -E '^PORT=' apps/api/.env | cut -d= -f2 || true)"
HEALTH="$(curl -fsS "http://127.0.0.1:${PORT:-8794}/api/health" || true)"
if [ -z "$HEALTH" ]; then
  echo "✗ Health check failed — check: pm2 logs dekkoisho-website-api --lines 50" >&2
  exit 1
fi
LIVE="$(node -e 'process.stdout.write(JSON.parse(process.argv[1]).version || "")' "$HEALTH")"
if [ "$LIVE" != "$VERSION" ]; then
  echo "✗ API is up but reports v$LIVE instead of v$VERSION" >&2
  exit 1
fi
echo "✓ API healthy on port ${PORT:-8794} (v$LIVE)"
