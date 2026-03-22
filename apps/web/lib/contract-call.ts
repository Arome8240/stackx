import { openContractCall } from '@stacks/connect';
import { PostConditionMode, type ClarityValue } from '@stacks/transactions';
import { toast } from 'sonner';
import type { StacksNetwork } from '@stacks/network';

interface CallOptions {
  network: StacksNetwork;
  contractId: string;
  functionName: string;
  functionArgs: ClarityValue[];
  onSuccess?: (txId: string) => void;
  onCancel?: () => void;
}

/**
 * Wrapper around openContractCall that:
 * - Sets PostConditionMode.Allow so wallets show the fee estimate
 * - Shows sonner toasts for pending / success / error states
 * - Returns a promise that resolves when the wallet dialog closes
 */
export function contractCall({
  network,
  contractId,
  functionName,
  functionArgs,
  onSuccess,
  onCancel,
}: CallOptions): Promise<void> {
  const [contractAddress, contractName] = contractId.split('.');

  return new Promise((resolve) => {
    const toastId = toast.loading('Waiting for wallet confirmation…');

    openContractCall({
      network,
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        toast.success('Transaction submitted', {
          id: toastId,
          description: `Tx: ${data.txId.slice(0, 10)}…${data.txId.slice(-6)}`,
          action: {
            label: 'View',
            onClick: () =>
              window.open(`https://explorer.hiro.so/txid/${data.txId}?chain=mainnet`, '_blank'),
          },
        });
        onSuccess?.(data.txId);
        resolve();
      },
      onCancel: () => {
        toast.dismiss(toastId);
        onCancel?.();
        resolve();
      },
    });
  });
}
