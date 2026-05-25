#!/usr/bin/env bash
# =============================================================================
# StackX Deployment Script
# Usage:  ./scripts/deploy.sh [testnet|mainnet] [--contract-only] [--skip-contract]
# =============================================================================
set -euo pipefail

# ── helpers ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()   { echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} $*"; }
ok()    { echo -e "${GREEN}✓${NC} $*"; }
warn()  { echo -e "${YELLOW}⚠${NC}  $*"; }
err()   { echo -e "${RED}✗${NC} $*" >&2; }
step()  { echo -e "\n${BOLD}${CYAN}▶ $*${NC}"; }
fatal() { err "$*"; exit 1; }

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTRACTS_DIR="$ROOT_DIR/contracts/clarity"
SCRIPTS_DIR="$ROOT_DIR/scripts"
DEPLOY_LOG="$ROOT_DIR/deployments/deploy-$(date +%Y%m%d-%H%M%S).log"

# ── parse args ────────────────────────────────────────────────────────────────
NETWORK="${1:-}"
DEPLOY_CONTRACT=true
DEPLOY_INFRA=true

[[ "$*" == *"--contract-only"* ]] && DEPLOY_INFRA=false
[[ "$*" == *"--skip-contract"* ]] && DEPLOY_CONTRACT=false

if [[ "$NETWORK" != "testnet" && "$NETWORK" != "mainnet" ]]; then
  fatal "Usage: $0 [testnet|mainnet] [--contract-only] [--skip-contract]"
fi

# ── mainnet guard ─────────────────────────────────────────────────────────────
if [[ "$NETWORK" == "mainnet" ]]; then
  echo -e "\n${RED}${BOLD}⚠  MAINNET DEPLOYMENT${NC}"
  echo -e "You are about to deploy to the ${BOLD}Stacks mainnet${NC}."
  echo -e "This will spend real STX and is ${BOLD}irreversible${NC}.\n"
  read -rp "Type 'deploy mainnet' to confirm: " CONFIRM
  [[ "$CONFIRM" != "deploy mainnet" ]] && fatal "Aborted."
fi

# ── env file ──────────────────────────────────────────────────────────────────
ENV_FILE="$ROOT_DIR/.env.$NETWORK"
if [[ ! -f "$ENV_FILE" ]]; then
  fatal "Missing $ENV_FILE — copy scripts/env.$NETWORK.example and fill in your values."
fi

log "Loading environment from $ENV_FILE"
set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

# ── required vars ─────────────────────────────────────────────────────────────
REQUIRED_VARS=(
  STACKS_PRIVATE_KEY
  DEPLOYER_STX_ADDRESS
  MONGODB_URI
  JWT_SECRET
)

step "Checking required environment variables"
for var in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    fatal "Required variable $var is not set in $ENV_FILE"
  fi
  ok "$var"
done

# ── tool checks ───────────────────────────────────────────────────────────────
step "Checking required tools"

for tool in node pnpm docker; do
  if ! command -v "$tool" &>/dev/null; then
    fatal "$tool is not installed or not in PATH"
  fi
  ok "$tool $(${tool} --version 2>&1 | head -1)"
done

NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
if (( NODE_MAJOR < 20 )); then
  fatal "Node.js 20+ required (found $NODE_MAJOR)"
fi

if ! command -v ts-node &>/dev/null && ! command -v npx &>/dev/null; then
  fatal "ts-node or npx is required to run the contract deployment script"
fi

# ── ensure deployments dir ────────────────────────────────────────────────────
mkdir -p "$ROOT_DIR/deployments"

# ── step 1: install dependencies ─────────────────────────────────────────────
step "Installing dependencies"
cd "$ROOT_DIR"
pnpm install --frozen-lockfile 2>&1 | tail -5
ok "Dependencies ready"

# ── step 2: run contract tests ────────────────────────────────────────────────
if [[ "$DEPLOY_CONTRACT" == "true" ]]; then
  step "Checking Clarity contract syntax"
  if command -v clarinet &>/dev/null; then
    clarinet check --manifest-path "$CONTRACTS_DIR/Clarinet.toml" && ok "Contract syntax OK"
  else
    warn "clarinet not found — skipping static check (install from https://github.com/hirosystems/clarinet)"
  fi
fi

# ── step 3: build API and web ─────────────────────────────────────────────────
if [[ "$DEPLOY_INFRA" == "true" ]]; then
  step "Building applications"

  log "Building API..."
  pnpm --filter @stackx/api build 2>&1 | tail -5
  ok "API built"

  log "Building Web..."
  NEXT_PUBLIC_STACKS_NETWORK="$NETWORK" \
  NEXT_PUBLIC_CONTRACT_ADDRESS="${CONTRACT_ADDRESS:-}" \
  NEXT_PUBLIC_API_URL="${API_URL:-}" \
  pnpm --filter @stackx/web build 2>&1 | tail -5
  ok "Web built"
fi

# ── step 4: deploy smart contract ─────────────────────────────────────────────
CONTRACT_ADDRESS=""
CONTRACT_TX_ID=""

if [[ "$DEPLOY_CONTRACT" == "true" ]]; then
  step "Deploying smart contract to $NETWORK"

  DEPLOY_OUTPUT=$(cd "$CONTRACTS_DIR" && \
    STACKS_PRIVATE_KEY="$STACKS_PRIVATE_KEY" \
    DEPLOY_NETWORK="$NETWORK" \
    npx ts-node "$SCRIPTS_DIR/deploy-contract.ts" 2>&1) || {
    err "Contract deployment failed"
    echo "$DEPLOY_OUTPUT"
    exit 1
  }

  echo "$DEPLOY_OUTPUT"

  # Parse results from deploy-contract.ts JSON output on last line
  RESULT_LINE=$(echo "$DEPLOY_OUTPUT" | grep '^DEPLOY_RESULT:' | tail -1)
  if [[ -n "$RESULT_LINE" ]]; then
    RESULT_JSON="${RESULT_LINE#DEPLOY_RESULT:}"
    CONTRACT_ADDRESS=$(echo "$RESULT_JSON" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); process.stdout.write(d.contractId)")
    CONTRACT_TX_ID=$(echo "$RESULT_JSON" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); process.stdout.write(d.txId)")
    ok "Contract deployed: $CONTRACT_ADDRESS"
    ok "Transaction: $CONTRACT_TX_ID"
  else
    warn "Could not parse contract address from output — set CONTRACT_ADDRESS manually before deploying infra"
  fi
else
  # Use address from env file
  CONTRACT_ADDRESS="${CONTRACT_ADDRESS:-}"
  warn "Skipping contract deployment — using CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
fi

# ── step 5: deploy infrastructure ────────────────────────────────────────────
if [[ "$DEPLOY_INFRA" == "true" ]]; then
  step "Deploying infrastructure ($NETWORK)"

  INFRA_SCRIPT="$SCRIPTS_DIR/deploy-infra-${NETWORK}.sh"

  if [[ -f "$INFRA_SCRIPT" ]]; then
    log "Running infra script: $INFRA_SCRIPT"
    CONTRACT_ADDRESS="$CONTRACT_ADDRESS" \
    NETWORK="$NETWORK" \
    bash "$INFRA_SCRIPT"
  else
    # Default: docker compose
    log "No infra script found — using docker compose"
    _deploy_docker_compose
  fi
fi

# ── step 6: post-deployment health checks ────────────────────────────────────
if [[ "$DEPLOY_INFRA" == "true" ]]; then
  step "Running post-deployment health checks"
  _health_check
fi

# ── summary ───────────────────────────────────────────────────────────────────
echo -e "\n${GREEN}${BOLD}════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  Deployment complete!${NC}"
echo -e "${GREEN}${BOLD}════════════════════════════════════════${NC}"
echo -e "  Network:  ${BOLD}$NETWORK${NC}"
[[ -n "$CONTRACT_ADDRESS" ]] && echo -e "  Contract: ${BOLD}$CONTRACT_ADDRESS${NC}"
[[ -n "$CONTRACT_TX_ID"  ]] && echo -e "  TxID:     ${BOLD}$CONTRACT_TX_ID${NC}"
[[ -n "${API_URL:-}"     ]] && echo -e "  API:      ${BOLD}$API_URL${NC}"
[[ -n "${APP_URL:-}"     ]] && echo -e "  App:      ${BOLD}$APP_URL${NC}"
if [[ "$NETWORK" == "testnet" ]]; then
  [[ -n "$CONTRACT_TX_ID" ]] && echo -e "  Explorer: https://explorer.hiro.so/txid/$CONTRACT_TX_ID?chain=testnet"
else
  [[ -n "$CONTRACT_TX_ID" ]] && echo -e "  Explorer: https://explorer.hiro.so/txid/$CONTRACT_TX_ID?chain=mainnet"
fi
echo ""

# Record summary in deployments log
{
  echo "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "network=$NETWORK"
  echo "contract_address=${CONTRACT_ADDRESS:-unknown}"
  echo "contract_tx_id=${CONTRACT_TX_ID:-unknown}"
  echo "api_url=${API_URL:-}"
  echo "app_url=${APP_URL:-}"
} > "$ROOT_DIR/deployments/latest-$NETWORK.env"

ok "Deployment record saved to deployments/latest-$NETWORK.env"

# ── helpers (defined after use to keep the top readable) ─────────────────────
_deploy_docker_compose() {
  if [[ ! -f "$ROOT_DIR/docker-compose.yml" ]]; then
    fatal "docker-compose.yml not found — create a deploy-infra-$NETWORK.sh script for your platform"
  fi

  log "Building Docker images..."
  NETWORK="$NETWORK" \
  CONTRACT_ADDRESS="$CONTRACT_ADDRESS" \
  MONGODB_URI="$MONGODB_URI" \
  JWT_SECRET="$JWT_SECRET" \
  docker compose -f "$ROOT_DIR/docker-compose.yml" build --no-cache

  log "Starting services..."
  NETWORK="$NETWORK" \
  CONTRACT_ADDRESS="$CONTRACT_ADDRESS" \
  MONGODB_URI="$MONGODB_URI" \
  JWT_SECRET="$JWT_SECRET" \
  docker compose -f "$ROOT_DIR/docker-compose.yml" up -d

  ok "Services started"
  docker compose -f "$ROOT_DIR/docker-compose.yml" ps
}

_health_check() {
  local API="${API_URL:-http://localhost:3001/api/v1}"
  local MAX=12; local WAIT=5

  log "Waiting for API health endpoint: $API/health"
  for ((i=1; i<=MAX; i++)); do
    if curl -sf "$API/health" -o /dev/null; then
      ok "API is healthy"
      return 0
    fi
    log "Attempt $i/$MAX — retrying in ${WAIT}s..."
    sleep "$WAIT"
  done

  warn "API health check did not pass within $((MAX * WAIT))s — check the logs"
}
