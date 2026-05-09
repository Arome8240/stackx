/**
 * Deployment script for StackX Social Platform
 */

import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import * as fs from 'fs';
import * as path from 'path';

interface DeployConfig {
  network: 'testnet' | 'mainnet';
  privateKey: string;
  contractName: string;
}

async function deployContract(config: DeployConfig) {
  console.log(`\n🚀 Deploying ${config.contractName} to ${config.network}...\n`);

  // Read contract source
  const contractPath = path.join(__dirname, 'social-platform.clar');
  const codeBody = fs.readFileSync(contractPath, 'utf-8');

  // Select network
  const network = config.network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

  // Create deploy transaction
  const txOptions = {
    contractName: config.contractName,
    codeBody,
    senderKey: config.privateKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 5000n, // 0.005 STX
  };

  try {
    const transaction = await makeContractDeploy(txOptions);
    
    console.log('📝 Transaction created');
    console.log('Transaction ID:', transaction.txid());

    // Broadcast transaction
    const broadcastResponse = await broadcastTransaction(transaction, network);
    
    if ('error' in broadcastResponse) {
      console.error('❌ Deployment failed:', broadcastResponse.error);
      if ('reason' in broadcastResponse) {
        console.error('Reason:', broadcastResponse.reason);
      }
      process.exit(1);
    }

    console.log('\n✅ Contract deployed successfully!');
    console.log('Transaction ID:', broadcastResponse.txid);
    console.log(`\n🔍 View on explorer:`);
    
    if (config.network === 'testnet') {
      console.log(`https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=testnet`);
    } else {
      console.log(`https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=mainnet`);
    }

    console.log('\n📋 Contract Details:');
    console.log(`Contract Name: ${config.contractName}`);
    console.log(`Network: ${config.network}`);
    
    return broadcastResponse;
  } catch (error) {
    console.error('❌ Error deploying contract:', error);
    process.exit(1);
  }
}

// Main deployment function
async function main() {
  const args = process.argv.slice(2);
  const network = (args[0] as 'testnet' | 'mainnet') || 'testnet';
  
  // Get private key from environment
  const privateKey = process.env.STACKS_PRIVATE_KEY;
  
  if (!privateKey) {
    console.error('❌ Error: STACKS_PRIVATE_KEY environment variable not set');
    console.log('\nUsage:');
    console.log('  STACKS_PRIVATE_KEY=your_key npm run deploy:testnet');
    console.log('  STACKS_PRIVATE_KEY=your_key npm run deploy:mainnet');
    process.exit(1);
  }

  const config: DeployConfig = {
    network,
    privateKey,
    contractName: 'social-platform',
  };

  await deployContract(config);
}

// Run deployment
if (require.main === module) {
  main().catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
}

export { deployContract };
