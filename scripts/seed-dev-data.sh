#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SEED_SQL_PATH="$ROOT_DIR/supabase/seeds/00_task_000a_dev_seed.sql"

TRUTHY_VALUES_REGEX='^(1|true|yes|on)$'

if [[ "${NODE_ENV:-development}" == "production" || "${VERCEL_ENV:-}" == "production" ]]; then
  echo "[task-000a] Refusing to seed while running with production environment flags." >&2
  exit 1
fi

if ! [[ "${ALLOW_DEV_BYPASS:-false}" =~ $TRUTHY_VALUES_REGEX ]]; then
  echo "[task-000a] ALLOW_DEV_BYPASS must be enabled to run dev seed." >&2
  exit 1
fi

if [[ ! -f "$SEED_SQL_PATH" ]]; then
  echo "[task-000a] Seed SQL file is missing: $SEED_SQL_PATH" >&2
  exit 1
fi

if ! command -v supabase >/dev/null 2>&1; then
  echo "[task-000a] Supabase CLI not found. Install it to apply dev seed." >&2
  exit 1
fi

timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "[task-000a] $timestamp applying dev seed from $SEED_SQL_PATH"
supabase db query --file "$SEED_SQL_PATH"
echo "[task-000a] seed apply completed"
