#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/5] React Native full suite"
npm run test:rn -- --watch=false

echo "[2/5] Backend integration suite"
npm run test:backend

echo "[3/5] Prepare web E2E dependencies"
npm --prefix Reference/react_agriconnect install
npm --prefix Reference/node_agriconnect/admin-panel install

echo "[4/5] User web Playwright E2E"
(
  cd Reference/react_agriconnect
  E2E_BACKEND_PORT=3000 npm run test:e2e
)

echo "[5/5] Admin web Playwright E2E"
(
  cd Reference/node_agriconnect/admin-panel
  E2E_BACKEND_PORT=3000 npm run test:e2e
)

echo "Aggressive test campaign completed"
