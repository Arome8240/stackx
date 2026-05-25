#!/usr/bin/env bash
# =============================================================================
# StackX Post-Deployment Health Check
# Usage:  ./scripts/health-check.sh [testnet|mainnet]
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BOLD='\033[1m'; NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $*"; }
fail() { echo -e "${RED}✗${NC} $*"; FAILURES=$((FAILURES + 1)); }
info() { echo -e "  $*"; }

NETWORK="${1:-testnet}"
FAILURES=0
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Load env
ENV_FILE="$ROOT_DIR/.env.$NETWORK"
if [[ -f "$ENV_FILE" ]]; then
  set -a; source "$ENV_FILE"; set +a
fi

API_URL="${API_URL:-http://localhost:3001/api/v1}"
APP_URL="${APP_URL:-http://localhost:3000}"
CONTRACT_ADDRESS="${CONTRACT_ADDRESS:-}"
STACKS_API="${NEXT_PUBLIC_STACKS_API_URL:-https://api.testnet.hiro.so}"

echo -e "\n${BOLD}StackX Health Check — $NETWORK${NC}\n"

# ── 1. API liveness ───────────────────────────────────────────────────────────
echo "API"
if STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "$API_URL/health" 2>/dev/null); then
  if [[ "$STATUS" == "200" ]]; then
    ok "GET $API_URL/health → $STATUS"
  else
    fail "GET $API_URL/health → $STATUS (expected 200)"
  fi
else
  fail "GET $API_URL/health → unreachable"
fi

# ── 2. API readiness (DB connection) ─────────────────────────────────────────
if READY=$(curl -sf "$API_URL/health/readiness" 2>/dev/null); then
  DB_STATUS=$(echo "$READY" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); process.stdout.write(d.data?.database ?? 'unknown')" 2>/dev/null || echo "unknown")
  if [[ "$DB_STATUS" == "connected" ]]; then
    ok "Database: $DB_STATUS"
  else
    fail "Database: $DB_STATUS (expected connected)"
  fi
else
  fail "GET $API_URL/health/readiness → unreachable"
fi

# ── 3. Web app ────────────────────────────────────────────────────────────────
echo ""
echo "Web"
if WEB_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null); then
  if [[ "$WEB_STATUS" =~ ^2 || "$WEB_STATUS" =~ ^3 ]]; then
    ok "GET $APP_URL → $WEB_STATUS"
  else
    fail "GET $APP_URL → $WEB_STATUS"
  fi
else
  fail "GET $APP_URL → unreachable"
fi

# ── 4. Smart contract on-chain ────────────────────────────────────────────────
echo ""
echo "Smart Contract"
if [[ -n "$CONTRACT_ADDRESS" ]]; then
  CONTRACT_INFO=$(curl -sf "$STACKS_API/v2/contracts/interface/$CONTRACT_ADDRESS" 2>/dev/null || echo "")
  if [[ -n "$CONTRACT_INFO" ]]; then
    FUNC_COUNT=$(echo "$CONTRACT_INFO" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); process.stdout.write(String(Object.keys(d.functions ?? {}).length))" 2>/dev/null || echo "?")
    ok "Contract deployed: $CONTRACT_ADDRESS ($FUNC_COUNT public functions)"
  else
    fail "Contract not found or unresponsive: $CONTRACT_ADDRESS"
  fi
else
  info "CONTRACT_ADDRESS not set — skipping on-chain check"
fi

# ── 5. Platform stats endpoint ────────────────────────────────────────────────
echo ""
echo "Platform Stats"
if STATS=$(curl -sf "$API_URL/analytics/platform" 2>/dev/null); then
  ok "Analytics endpoint responding"
else
  fail "GET $API_URL/analytics/platform → unreachable"
fi

# ── 6. Stacks API connectivity ────────────────────────────────────────────────
echo ""
echo "Stacks Network"
if CHAIN=$(curl -sf "$STACKS_API/v2/info" 2>/dev/null); then
  CHAIN_TIP=$(echo "$CHAIN" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); process.stdout.write(String(d.stacks_tip_height ?? '?'))" 2>/dev/null || echo "?")
  ok "Stacks API reachable ($NETWORK, tip height: $CHAIN_TIP)"
else
  fail "Stacks API unreachable: $STACKS_API"
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
if [[ $FAILURES -eq 0 ]]; then
  echo -e "${GREEN}${BOLD}All checks passed!${NC}\n"
  exit 0
else
  echo -e "${RED}${BOLD}$FAILURES check(s) failed.${NC}\n"
  exit 1
fi
