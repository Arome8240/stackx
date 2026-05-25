/**
 * StackX V2 Contract Deployer
 * Deploys social-platform-v2.clar to testnet or mainnet.
 *
 * Outputs:  DEPLOY_RESULT:<JSON> on stdout so deploy.sh can parse it.
 *
 * Usage:
 *   STACKS_PRIVATE_KEY=<key> DEPLOY_NETWORK=testnet npx ts-node deploy-contract.ts
 */

import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  estimateContractDeploy,
  getAddressFromPrivateKey,
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import * as fs from 'fs';
import * as path from 'path';

// ── config ────────────────────────────────────────────────────────────────────
type Network = 'testnet' | 'mainnet';

interface DeployConfig {
  network: Network;
  privateKey: string;
  contractName: string;
  contractFile: string;
  feeMultiplier: number;
}

interface DeployResult {
  txId: string;
  contractId: string;
  network: Network;
  explorerUrl: string;
  timestamp: string;
}

// ── helpers ───────────────────────────────────────────────────────────────────
const EXPLORER_BASE: Record<Network, string> = {
  testnet: 'https://explorer.hiro.so/txid',
  mainnet: 'https://explorer.hiro.so/txid',
};

const NETWORK_PARAM: Record<Network, string> = {
  testnet: '?chain=testnet',
  mainnet: '?chain=mainnet',
};

function log(msg: string)  { process.stdout.write(`[deploy] ${msg}\n`); }
function warn(msg: string) { process.stdout.write(`[warn]   ${msg}\n`); }
function fail(msg: string) { process.stderr.write(`[error]  ${msg}\n`); process.exit(1); }

// ── fee estimation ────────────────────────────────────────────────────────────
async function estimateFee(
  contractSource: string,
  config: DeployConfig,
  network: StacksTestnet | StacksMainnet,
): Promise<bigint> {
  try {
    const tx = await makeContractDeploy({
      contractName: config.contractName,
      codeBody: contractSource,
      senderKey: config.privateKey,
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      fee: 1n,
    });

    const estimates = await estimateContractDeploy(tx, network);
    const baseFee = estimates[1]?.fee ?? 10_000n;
    return BigInt(Math.ceil(Number(baseFee) * config.feeMultiplier));
  } catch {
    warn('Fee estimation failed — using conservative fallback');
    return config.network === 'mainnet' ? 50_000n : 10_000n;
  }
}

// ── confirmation polling ──────────────────────────────────────────────────────
async function waitForConfirmation(
  txId: string,
  network: StacksTestnet | StacksMainnet,
  timeoutMs = 300_000,
  intervalMs = 10_000,
): Promise<boolean> {
  const apiUrl = network.coreApiUrl;
  const deadline = Date.now() + timeoutMs;

  log(`Polling for confirmation (timeout ${timeoutMs / 1000}s)...`);
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);
      if (res.ok) {
        const tx = await res.json() as { tx_status: string };
        if (tx.tx_status === 'success') return true;
        if (tx.tx_status === 'abort_by_response' || tx.tx_status === 'abort_by_post_condition') {
          fail(`Transaction aborted: ${tx.tx_status}`);
        }
      }
    } catch {
      // network hiccup — keep polling
    }
    log(`  Not confirmed yet — waiting ${intervalMs / 1000}s...`);
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}

// ── write deployment record ───────────────────────────────────────────────────
function saveDeploymentRecord(result: DeployResult, rootDir: string): void {
  const deploymentsDir = path.join(rootDir, 'deployments');
  fs.mkdirSync(deploymentsDir, { recursive: true });

  // Append to history file
  const historyFile = path.join(deploymentsDir, 'history.jsonl');
  fs.appendFileSync(historyFile, JSON.stringify(result) + '\n');

  // Write latest for this network
  const latestFile = path.join(deploymentsDir, `latest-${result.network}.json`);
  fs.writeFileSync(latestFile, JSON.stringify(result, null, 2) + '\n');

  log(`Deployment record saved → deployments/latest-${result.network}.json`);
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const network = (process.env.DEPLOY_NETWORK ?? 'testnet') as Network;
  if (network !== 'testnet' && network !== 'mainnet') {
    fail('DEPLOY_NETWORK must be "testnet" or "mainnet"');
  }

  const privateKey = process.env.STACKS_PRIVATE_KEY;
  if (!privateKey) {
    fail('STACKS_PRIVATE_KEY environment variable is required');
  }

  // Contract file — prefer v2 if it exists
  const contractsDir = path.join(__dirname, '..', 'contracts', 'clarity');
  const contractFile =
    fs.existsSync(path.join(contractsDir, 'social-platform-v2.clar'))
      ? path.join(contractsDir, 'social-platform-v2.clar')
      : path.join(contractsDir, 'social-platform.clar');

  const contractName = contractFile.includes('v2') ? 'social-platform-v2' : 'social-platform';
  log(`Contract file: ${contractFile}`);
  log(`Contract name: ${contractName}`);

  const config: DeployConfig = {
    network,
    privateKey,
    contractName,
    contractFile,
    // mainnet: use higher multiplier (1.5×) for reliability
    feeMultiplier: network === 'mainnet' ? 1.5 : 1.2,
  };

  const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

  // Derive deployer address
  const deployerAddress = getAddressFromPrivateKey(privateKey, network === 'mainnet' ? 'p2pkh' : 'p2pkh');
  log(`Deployer address: ${deployerAddress}`);

  const contractSource = fs.readFileSync(contractFile, 'utf-8');
  log(`Contract size: ${(contractSource.length / 1024).toFixed(1)} KB`);

  // ── estimate fee ────────────────────────────────────────────────────────────
  log('Estimating deployment fee...');
  const fee = await estimateFee(contractSource, config, stacksNetwork);
  log(`Estimated fee: ${fee.toLocaleString()} microSTX (${Number(fee) / 1_000_000} STX)`);

  if (network === 'mainnet' && fee > 500_000n) {
    warn(`Fee is unusually high (${Number(fee) / 1_000_000} STX). Proceeding anyway.`);
  }

  // ── build tx ────────────────────────────────────────────────────────────────
  log('Building deploy transaction...');
  const tx = await makeContractDeploy({
    contractName: config.contractName,
    codeBody: contractSource,
    senderKey: config.privateKey,
    network: stacksNetwork,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee,
  });

  log(`Transaction serialized (${tx.serialize().byteLength} bytes)`);

  // ── broadcast ───────────────────────────────────────────────────────────────
  log('Broadcasting transaction...');
  const broadcastRes = await broadcastTransaction(tx, stacksNetwork);

  if ('error' in broadcastRes) {
    const reason = 'reason' in broadcastRes ? ` — ${broadcastRes.reason}` : '';
    fail(`Broadcast failed: ${broadcastRes.error}${reason}`);
  }

  const txId: string = broadcastRes.txid;
  const contractId = `${deployerAddress}.${config.contractName}`;

  log(`Transaction broadcast: ${txId}`);
  log(`Contract ID will be: ${contractId}`);

  // ── optional confirmation wait ──────────────────────────────────────────────
  const shouldWait = process.env.WAIT_FOR_CONFIRMATION !== 'false';
  if (shouldWait) {
    log('Waiting for on-chain confirmation...');
    const confirmed = await waitForConfirmation(txId, stacksNetwork);
    if (confirmed) {
      log('Contract confirmed on-chain!');
    } else {
      warn('Timed out waiting for confirmation — check the explorer manually');
    }
  }

  // ── build result ────────────────────────────────────────────────────────────
  const explorerUrl = `${EXPLORER_BASE[network]}/${txId}${NETWORK_PARAM[network]}`;

  const result: DeployResult = {
    txId,
    contractId,
    network,
    explorerUrl,
    timestamp: new Date().toISOString(),
  };

  saveDeploymentRecord(result, path.join(__dirname, '..'));

  // ── output for shell parser ─────────────────────────────────────────────────
  console.log('');
  console.log('──────────────────────────────────────────');
  console.log(`  Network:    ${network}`);
  console.log(`  Contract:   ${contractId}`);
  console.log(`  TX ID:      ${txId}`);
  console.log(`  Explorer:   ${explorerUrl}`);
  console.log('──────────────────────────────────────────');
  console.log(`DEPLOY_RESULT:${JSON.stringify(result)}`);
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
