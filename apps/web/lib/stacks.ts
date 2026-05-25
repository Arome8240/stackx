'use client';

import {
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  uintCV,
  stringAsciiCV,
  principalCV,
} from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';

const NETWORK = process.env.NEXT_PUBLIC_STACKS_NETWORK ?? 'testnet';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';
const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME ?? 'social-platform-v2';

function getContractId() {
  return `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`;
}

export async function callTipCast(
  senderAddress: string,
  castId: number,
  recipientAddress: string,
  amountMicroStx: number,
): Promise<void> {
  const postCondition = makeStandardSTXPostCondition(
    senderAddress,
    FungibleConditionCode.Equal,
    amountMicroStx,
  );

  await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'tip-cast',
    functionArgs: [uintCV(castId), principalCV(recipientAddress), uintCV(amountMicroStx)],
    postConditions: [postCondition],
    network: NETWORK as 'testnet' | 'mainnet',
    onFinish: (data) => {
      console.log('Tip transaction:', data.txId);
    },
    onCancel: () => {
      console.log('Tip cancelled');
    },
  });
}

export async function callMintNFT(
  castId: number,
  tokenUri: string,
  maxEdition: number,
): Promise<void> {
  await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'mint-cast-nft',
    functionArgs: [uintCV(castId), stringAsciiCV(tokenUri), uintCV(maxEdition)],
    postConditions: [],
    network: NETWORK as 'testnet' | 'mainnet',
    onFinish: (data) => {
      console.log('Mint transaction:', data.txId);
    },
  });
}

export async function callJoinPaidChannel(
  senderAddress: string,
  channelId: number,
  feeStx: number,
): Promise<void> {
  const amountMicroStx = feeStx * 1_000_000;
  const postCondition = makeStandardSTXPostCondition(
    senderAddress,
    FungibleConditionCode.Equal,
    amountMicroStx,
  );

  await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'join-channel',
    functionArgs: [uintCV(channelId)],
    postConditions: [postCondition],
    network: NETWORK as 'testnet' | 'mainnet',
    onFinish: (data) => {
      console.log('Join channel tx:', data.txId);
    },
  });
}

export async function callBuyNFT(
  senderAddress: string,
  nftId: number,
  priceStx: number,
): Promise<void> {
  const amountMicroStx = priceStx * 1_000_000;
  const postCondition = makeStandardSTXPostCondition(
    senderAddress,
    FungibleConditionCode.Equal,
    amountMicroStx,
  );

  await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'buy-nft',
    functionArgs: [uintCV(nftId)],
    postConditions: [postCondition],
    network: NETWORK as 'testnet' | 'mainnet',
    onFinish: (data) => {
      console.log('Buy NFT tx:', data.txId);
    },
  });
}

export function microStxToStx(microStx: number): number {
  return microStx / 1_000_000;
}

export function stxToMicroStx(stx: number): number {
  return Math.floor(stx * 1_000_000);
}

export function calculatePlatformFee(amountMicroStx: number, feeBps = 250): number {
  return Math.floor((amountMicroStx * feeBps) / 10_000);
}
