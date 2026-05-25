/**
 * StackX V2 Contract Deployer
 * Usage:
 *   STACKS_PRIVATE_KEY=<key> DEPLOY_NETWORK=mainnet node scripts/deploy-contract.mjs
 *   STACKS_PRIVATE_KEY=<key> DEPLOY_NETWORK=testnet node scripts/deploy-contract.mjs
 *
 * Optional:
 *   CONTRACT_NAME=social-platform-v2b  — override name (needed after a failed deploy)
 */

import { makeContractDeploy, broadcastTransaction, AnchorMode, PostConditionMode, privateKeyToAddress } from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { readFileSync, existsSync, mkdirSync, appendFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR  = path.join(__dirname, '..');

const log  = (msg) => console.log(`[deploy] ${msg}`);
const fail = (msg) => { console.error(`[error]  ${msg}`); process.exit(1); };

// ── config ─────────────────────────────────────────────────────────────────────
const DEPLOY_NETWORK = (process.env.DEPLOY_NETWORK ?? 'testnet').toLowerCase();
const PRIVATE_KEY    = process.env.STACKS_PRIVATE_KEY;

if (!PRIVATE_KEY) fail('STACKS_PRIVATE_KEY is not set');
if (DEPLOY_NETWORK !== 'mainnet' && DEPLOY_NETWORK !== 'testnet')
  fail('DEPLOY_NETWORK must be "mainnet" or "testnet"');

const NETWORK = DEPLOY_NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

// ── contract file ──────────────────────────────────────────────────────────────
const contractsDir = path.join(ROOT_DIR, 'contracts', 'clarity');
const v2Path       = path.join(contractsDir, 'social-platform-v2.clar');
const v1Path       = path.join(contractsDir, 'social-platform.clar');
const contractFile = existsSync(v2Path) ? v2Path : v1Path;
const contractName = process.env.CONTRACT_NAME
  ?? (contractFile.includes('v2') ? 'social-platform-v2' : 'social-platform');

log(`Network:  ${DEPLOY_NETWORK}`);
log(`Contract: ${contractFile}`);
log(`Name:     ${contractName}`);

// ── deployer address ───────────────────────────────────────────────────────────
const deployerAddress = privateKeyToAddress(PRIVATE_KEY, DEPLOY_NETWORK);
log(`Deployer: ${deployerAddress}`);

// ── read source ────────────────────────────────────────────────────────────────
const codeBody = readFileSync(contractFile, 'utf-8');
log(`Size:     ${(codeBody.length / 1024).toFixed(1)} KB`);

// ── fee ────────────────────────────────────────────────────────────────────────
const fee = DEPLOY_NETWORK === 'mainnet' ? 100_000n : 50_000n;
log(`Fee:      ${Number(fee) / 1_000_000} STX`);

// ── build transaction ──────────────────────────────────────────────────────────
log('Building transaction...');
const tx = await makeContractDeploy({
  contractName,
  codeBody,
  senderKey:        PRIVATE_KEY,
  network:          NETWORK,
  anchorMode:       AnchorMode.Any,
  postConditionMode: PostConditionMode.Allow,
  clarityVersion:   2,
  fee,
});
log(`Serialized: ${tx.serialize().length} bytes`);

// ── broadcast ──────────────────────────────────────────────────────────────────
log('Broadcasting...');
const res = await broadcastTransaction({ transaction: tx, network: NETWORK });

if (res.error) {
  const reason = res.reason ? ` - ${res.reason}` : '';
  fail(`Broadcast rejected: ${res.error}${reason}`);
}

const txId        = res.txid;
const contractId  = `${deployerAddress}.${contractName}`;
const explorerUrl = `https://explorer.hiro.so/txid/${txId}?chain=${DEPLOY_NETWORK}`;

// ── save deployment record ─────────────────────────────────────────────────────
const record       = { txId, contractId, network: DEPLOY_NETWORK, explorerUrl, timestamp: new Date().toISOString() };
const deploymentsDir = path.join(ROOT_DIR, 'deployments');
mkdirSync(deploymentsDir, { recursive: true });
appendFileSync(path.join(deploymentsDir, 'history.jsonl'), JSON.stringify(record) + '\n');
writeFileSync(path.join(deploymentsDir, `latest-${DEPLOY_NETWORK}.json`), JSON.stringify(record, null, 2) + '\n');

// ── result ─────────────────────────────────────────────────────────────────────
console.log('');
console.log('==============================================');
console.log('  Transaction broadcast');
console.log(`  Network:   ${DEPLOY_NETWORK}`);
console.log(`  Contract:  ${contractId}`);
console.log(`  TX ID:     ${txId}`);
console.log(`  Explorer:  ${explorerUrl}`);
console.log('==============================================');
console.log('');
console.log('Next steps:');
console.log(`  1. Wait ~10 min for the transaction to confirm`);
console.log(`  2. Check: ${explorerUrl}`);
console.log(`  3. Add to .env.${DEPLOY_NETWORK}:`);
console.log(`       CONTRACT_ADDRESS=${contractId}`);
console.log(`       NEXT_PUBLIC_CONTRACT_ADDRESS=${contractId}`);
console.log('');
