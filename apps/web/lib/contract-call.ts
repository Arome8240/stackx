import { openContractCall } from '@stacks/connect';
import { PostConditionMode, type ClarityValue } from '@stacks/transactions';
import { toast } from 'sonner';

type StacksNetworkName = 'mainnet' | 'testnet' | 'devnet';

interface CallOptions {
  functionArgs: ClarityValue[];
  contractId: string;
  functionName: string;
  onSuccess?: (txId: string) => void;
  onCancel?: () => void;
}

const networkName: StacksNetworkName =
  (process.env.NEXT_PUBLIC_STACKS_NETWORK as StacksNetworkName) ?? 'mainnet';

const explorerBase =
  networkName === 'mainnet' ? 'https://explorer.hiro.so/txid' : 'https://explorer.hiro.so/txid';

/**
 * Wrapper around openContractCall (stacks/connect v7).
 * - Passes network as a string — required for wallets to show fee estimates
 * - PostConditionMode.Allow lets the wallet calculate and display the fee
 * - Sonner toasts for loading → success / cancel
 */
export function contractCall({
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
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network: networkName, // string, not StacksNetwork object
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        toast.success('Transaction submitted', {
          id: toastId,
          description: `Tx: ${data.txId.slice(0, 10)}…${data.txId.slice(-6)}`,
          action: {
            label: 'View',
            onClick: () =>
              window.open(`${explorerBase}/${data.txId}?chain=${networkName}`, '_blank'),
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
