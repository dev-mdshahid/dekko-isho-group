#!/usr/bin/env bash
# Release from a laptop: checks → version bump → commit + tag → push → deploy.
#   scripts/deploy.sh web    website + HR portal to Firebase Hosting
#   scripts/deploy.sh api    API on the droplet (git pull there; never file copies)
#   scripts/deploy.sh all    API first, then the website
# Options (env): BUMP=patch|minor|major (default patch), DEPLOY_BRANCH (default main).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TARGET="${1:-}"
case "$TARGET" in web | api | all) ;; *)
  echo "Usage: scripts/deploy.sh web|api|all" >&2
  exit 1
  ;;
esac

DROPLET="${DROPLET:-root@159.223.50.93}"
REMOTE_DIR="${REMOTE_DIR:-~/dekko-isho-group-website}"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
EXPECTED_BRANCH="${DEPLOY_BRANCH:-main}"
step() { printf '\n\033[1m→ %s\033[0m\n' "$1"; }

if [ "$BRANCH" != "$EXPECTED_BRANCH" ]; then
  echo "You are on '$BRANCH'. Deploys go out from '$EXPECTED_BRANCH' (set DEPLOY_BRANCH to override)." >&2
  exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
  echo "Commit or stash your changes first, so what ships is exactly what was tested." >&2
  git status --short >&2
  exit 1
fi

step "Pre-deploy checks"
bash scripts/gate.sh "$TARGET"

step "Version"
VERSION="$(node scripts/bump-version.mjs "${BUMP:-patch}")"
git add package.json package-lock.json
git commit -m "release: v$VERSION ($TARGET)"
git tag -a "v$VERSION" -m "Release v$VERSION ($TARGET)"
echo "v$VERSION"

step "Push"
git push origin "$BRANCH"
git push origin "v$VERSION"

deploy_api() {
  step "Deploy API on $DROPLET"
  ssh -o BatchMode=yes "$DROPLET" "cd $REMOTE_DIR && bash scripts/deploy-api.sh $VERSION"
}

deploy_web() {
  step "Deploy website + HR portal"
  node scripts/check-env.mjs --remote
  node scripts/prepare-firebase-hosting.mjs
  npm run build:hosting
  FIREBASE_SKIP_UPDATE_CHECK=true npx firebase deploy --only hosting,firestore:rules,firestore:indexes --project dekko-isho-group
}

case "$TARGET" in
  api) deploy_api ;;
  web) deploy_web ;;
  all)
    deploy_api
    deploy_web
    ;;
esac

printf '\n\033[32m✓ Released v%s (%s)\033[0m\n' "$VERSION" "$TARGET"
