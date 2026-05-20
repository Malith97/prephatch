#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCHEMA_SQL_PATHS=(
  "$ROOT_DIR/database/001_init_schema.sql"
  "$ROOT_DIR/database/002_enterprise_hardening.sql"
  "$ROOT_DIR/database/003_partitioning.sql"
  "$ROOT_DIR/database/004_indexes.sql"
  "$ROOT_DIR/database/005_rls_policies.sql"
)
SEED_SQL_PATH="${SEED_SQL_PATH:-$ROOT_DIR/supabase/seeds/00_dev_seed.sql}"

TRUTHY_VALUES_REGEX='^(1|true|yes|on)$'

if [[ "${NODE_ENV:-development}" == "production" || "${VERCEL_ENV:-}" == "production" ]]; then
  echo "[task-000a] Refusing to seed while running with production environment flags." >&2
  exit 1
fi

if ! [[ "${ALLOW_DEV_BYPASS:-false}" =~ $TRUTHY_VALUES_REGEX ]]; then
  echo "[task-000a] ALLOW_DEV_BYPASS must be enabled to run dev seed." >&2
  exit 1
fi

for schema_sql_path in "${SCHEMA_SQL_PATHS[@]}"; do
  if [[ ! -f "$schema_sql_path" ]]; then
    echo "[task-000a] Finalized schema SQL file is missing: $schema_sql_path" >&2
    exit 1
  fi
done

if [[ ! -f "$SEED_SQL_PATH" ]]; then
  echo "[task-000a] Seed SQL file is missing: $SEED_SQL_PATH" >&2
  exit 1
fi

SUPABASE_BIN="${SUPABASE_CLI_PATH:-}"
if [[ -z "$SUPABASE_BIN" ]]; then
  if command -v supabase >/dev/null 2>&1; then
    SUPABASE_BIN="$(command -v supabase)"
  else
    for candidate in /opt/homebrew/bin/supabase /usr/local/bin/supabase "$HOME/.supabase/bin/supabase" "$HOME/bin/supabase"; do
      if [[ -x "$candidate" ]]; then
        SUPABASE_BIN="$candidate"
        break
      fi
    done
  fi
fi

if [[ -z "$SUPABASE_BIN" || ! -x "$SUPABASE_BIN" ]]; then
  echo "[task-000a] Supabase CLI not found. Install it to apply dev seed." >&2
  echo "[task-000a] You can also set SUPABASE_CLI_PATH=/absolute/path/to/supabase." >&2
  exit 1
fi

timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "[task-000a] $timestamp using Supabase CLI: $SUPABASE_BIN"
for schema_sql_path in "${SCHEMA_SQL_PATHS[@]}"; do
  echo "[task-000a] applying finalized schema from $schema_sql_path"
  "$SUPABASE_BIN" db query --file "$schema_sql_path"
done
echo "[task-000a] $timestamp applying dev seed from $SEED_SQL_PATH"
"$SUPABASE_BIN" db query --file "$SEED_SQL_PATH"
echo "[task-000a] seed apply completed"
