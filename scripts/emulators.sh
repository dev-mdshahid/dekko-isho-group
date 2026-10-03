#!/usr/bin/env bash
# Local Firestore + Auth emulators (needs Java 21+). Data persists in .emulator-data.
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/java-env.sh

mkdir -p .emulator-data
IMPORT=()
if [ -f .emulator-data/firebase-export-metadata.json ]; then IMPORT=(--import .emulator-data); fi

exec npx firebase emulators:start --only auth,firestore --project demo-dekko-isho ${IMPORT[@]+"${IMPORT[@]}"} --export-on-exit .emulator-data
