#!/usr/bin/env bash
# Playwright suite on throwaway emulators: seeds them, then runs the tests. Extra args go to Playwright, e.g.
#   scripts/e2e.sh --project=functional
#   scripts/e2e.sh --update-snapshots          (refresh screenshot baselines after an intended design change)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

npm run build -w @dekko-isho/shared >/dev/null
ARGS=""
for a in "$@"; do ARGS+=" $(printf '%q' "$a")"; done
exec bash scripts/with-test-emulators.sh "API_ENV_FILE=apps/api/test/test.env npx tsx apps/api/test/e2e-seed.ts && npx playwright test$ARGS"
