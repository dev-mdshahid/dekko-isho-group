#!/usr/bin/env bash
# Runs a command against throwaway Auth + Firestore emulators on test ports (firebase.test.json),
# so tests never touch the dev emulators or real data. Usage: scripts/with-test-emulators.sh "<command>"
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/scripts/java-env.sh"
export FIREBASE_SKIP_UPDATE_CHECK=true

exec "$ROOT/node_modules/.bin/firebase" emulators:exec \
  --config "$ROOT/firebase.test.json" \
  --only auth,firestore \
  --project demo-dekko-isho \
  "$1"
