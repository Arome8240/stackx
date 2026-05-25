/**
 * StackX Contract Rollback Helper
 *
 * Clarity contracts are immutable — you cannot overwrite a deployed contract.
 * "Rolling back" means deploying the previous version under a new name and
 * updating all env files to point to it.
 *
 * Usage:
 *   STACKS_PRIVATE_KEY=<key> DEPLOY_NETWORK=testnet npx ts-node rollback-contract.ts
 *
 * The script reads deployments/history.jsonl, lists recent deployments for the
 * target network, and asks which one to treat as the new "current" version
 * (by writing its address to deployments/latest-<network>.json).
 *
 * If ROLLBACK_CONTRACT_FILE is set, it re-deploys that file under a new versioned name.
 */

import { StacksTestnet, StacksMainnet } from '@stacks/network';
import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  getAddressFromPrivateKey,
} from '@stacks/transactions';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

type Network = 'testnet' | 'mainnet';

interface DeployRecord {
  txId: string;
  contractId: string;
  network: Network;
  explorerUrl: string;
  timestamp: string;
}

const ROOT_DIR = path.join(__dirname, '..');
const DEPLOYMENTS_DIR = path.join(ROOT_DIR, 'deployments');
const HISTORY_FILE = path.join(DEPLOYMENTS_DIR, 'history.jsonl');

function log(msg: string)  { process.stdout.write(`[rollback] ${msg}\n`); }
function fail(msg: string) { process.stderr.write(`[error]    ${msg}\n`); process.exit(1); }

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function readHistory(network: Network): DeployRecord[] {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  return fs.readFileSync(HISTORY_FILE, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      try { return JSON.parse(l) as DeployRecord; } catch { return null; }
    })
    .filter((r): r is DeployRecord => r !== null && r.network === network)
    .reverse(); // newest first
}

async function promptSelection(records: DeployRecord[]): Promise<DeployRecord> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\nRecent deployments on this network:\n');
  records.slice(0, 10).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.contractId}`);
    console.log(`     deployed: ${r.timestamp}`);
    console.log(`     tx: ${r.txId}\n`);
  });

  const answer = await ask(rl, 'Enter the number to set as current (or q to quit): ');
  rl.close();

  const idx = parseInt(answer, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= records.length) fail('Invalid selection');
  return records[idx];
}

async function redeployFile(network: Network, privateKey: string): Promise<DeployRecord> {
  const contractFile = process.env.ROLLBACK_CONTRACT_FILE!;
  if (!fs.existsSync(contractFile)) fail(`File not found: ${contractFile}`);

  const ts = Date.now();
  const contractName = `social-platform-rollback-${ts}`;
  const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  const deployerAddress = getAddressFromPrivateKey(privateKey, 'p2pkh');
  const codeBody = fs.readFileSync(contractFile, 'utf-8');

  log(`Re-deploying ${contractFile} as ${contractName}...`);

  const tx = await makeContractDeploy({
    contractName,
    codeBody,
    senderKey: privateKey,
    network: stacksNetwork,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: network === 'mainnet' ? 50_000n : 15_000n,
  });

  const broadcastRes = await broadcastTransaction(tx, stacksNetwork);
  if ('error' in broadcastRes) fail(`Broadcast failed: ${broadcastRes.error}`);

  const txId = (broadcastRes as { txid: string }).txid;
  const contractId = `${deployerAddress}.${contractName}`;
  const explorerUrl = `https://explorer.hiro.so/txid/${txId}?chain=${network}`;

  return { txId, contractId, network, explorerUrl, timestamp: new Date().toISOString() };
}

async function main(): Promise<void> {
  const network = (process.env.DEPLOY_NETWORK ?? 'testnet') as Network;
  const privateKey = process.env.STACKS_PRIVATE_KEY;

  if (!privateKey) fail('STACKS_PRIVATE_KEY is required');
  if (network !== 'testnet' && network !== 'mainnet') {
    fail('DEPLOY_NETWORK must be "testnet" or "mainnet"');
  }

  if (network === 'mainnet') {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const confirm = await new Promise<string>((r) => rl.question('\n⚠  MAINNET rollback. Type "rollback mainnet" to confirm: ', r));
    rl.close();
    if (confirm !== 'rollback mainnet') fail('Aborted.');
  }

  let selected: DeployRecord;

  if (process.env.ROLLBACK_CONTRACT_FILE) {
    selected = await redeployFile(network, privateKey!);
  } else {
    const history = readHistory(network);
    if (history.length === 0) fail('No deployment history found for this network');
    selected = await promptSelection(history);
  }

  // Update latest file
  fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
  const latestFile = path.join(DEPLOYMENTS_DIR, `latest-${network}.json`);
  fs.writeFileSync(latestFile, JSON.stringify(selected, null, 2) + '\n');

  // Append to history if this is a new deployment
  if (process.env.ROLLBACK_CONTRACT_FILE) {
    fs.appendFileSync(HISTORY_FILE, JSON.stringify(selected) + '\n');
  }

  log(`\nRollback complete!`);
  log(`Active contract: ${selected.contractId}`);
  log(`Update CONTRACT_ADDRESS in your .env.${network} file:`);
  log(`  CONTRACT_ADDRESS=${selected.contractId}`);
  log(`  NEXT_PUBLIC_CONTRACT_ADDRESS=${selected.contractId}`);

  process.stdout.write(`ROLLBACK_RESULT:${JSON.stringify(selected)}\n`);
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
