#!/usr/bin/env bash
# Everything that must pass before a deploy: credentials, lint, types, unit tests with coverage, e2e.
# Usage: scripts/gate.sh [web|api|all]   (default all). Stops at the first failure.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TARGET="${1:-all}"
step() { printf '\n\033[1m→ %s\033[0m\n' "$1"; }

if [ "$TARGET" = "web" ] || [ "$TARGET" = "all" ]; then
  step "Check website + HR portal credentials"
  if [ "$TARGET" = "web" ]; then
    node scripts/check-env.mjs --remote
  else
    # The API deploys first in a full release, so the live API is checked after it is up.
    node scripts/check-env.mjs
  fi
fi

step "Lint"
npm run lint

step "Typecheck"
npm run typecheck

step "Unit tests (with coverage thresholds)"
npm run test

step "End-to-end tests"
npm run test:e2e

printf '\n\033[32m✓ All checks passed\033[0m\n'
