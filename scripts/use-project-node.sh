#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_VERSION_FILE="$ROOT_DIR/.node-version"
NVMRC_FILE="$ROOT_DIR/.nvmrc"

if [ "${PREPHATCH_NODE_READY:-0}" = "1" ]; then
  exec "$@"
fi

current_major=""
if command -v node >/dev/null 2>&1; then
  current_major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || true)"
fi

if [ "$current_major" = "20" ]; then
  export PREPHATCH_NODE_READY=1
  exec "$@"
fi

unset npm_config_prefix
unset NPM_CONFIG_PREFIX
unset PREFIX

if [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"

  if [ -f "$NVMRC_FILE" ]; then
    nvm use --silent >/dev/null
  elif [ -f "$NODE_VERSION_FILE" ]; then
    nvm use --silent "$(cat "$NODE_VERSION_FILE")" >/dev/null
  else
    nvm use --silent default >/dev/null
  fi

  export PREPHATCH_NODE_READY=1
  exec "$@"
fi

if command -v fnm >/dev/null 2>&1; then
  export PREPHATCH_NODE_READY=1

  if [ -f "$NODE_VERSION_FILE" ]; then
    exec fnm exec --using-file "$NODE_VERSION_FILE" -- "$@"
  fi

  exec fnm exec --using-file "$NVMRC_FILE" -- "$@"
fi

echo "PrepHatch requires Node 20.x. Install or initialize nvm/fnm before running project scripts." >&2
exit 1
