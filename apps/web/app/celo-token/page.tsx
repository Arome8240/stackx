'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { CELO_TOKEN_ABI, TOKEN_ADDRESS } from '@/lib/contracts/celo-token';

export default function CeloTokenPage() {
  const { address, isConnected } = useAccount();
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Read token info
  const { data: name } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: CELO_TOKEN_ABI,
    functionName: 'name',
  });

  const { data: symbol } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: CELO_TOKEN_ABI,
    functionName: 'symbol',
  });

  const { data: totalSupply } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: CELO_TOKEN_ABI,
    functionName: 'totalSupply',
  });

  const { data: maxSupply } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: CELO_TOKEN_ABI,
    functionName: 'maxSupply',
  });

  const { data: balance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: CELO_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTo || !transferAmount) return;

    writeContract({
      address: TOKEN_ADDRESS,
      abi: CELO_TOKEN_ABI,
      functionName: 'transfer',
      args: [transferTo as `0x${string}`, parseUnits(transferAmount, 18)],
    });
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintTo || !mintAmount) return;

    writeContract({
      address: TOKEN_ADDRESS,
      abi: CELO_TOKEN_ABI,
      functionName: 'mint',
      args: [mintTo as `0x${string}`, parseUnits(mintAmount, 18)],
    });
  };

  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!burnAmount) return;

    writeContract({
      address: TOKEN_ADDRESS,
      abi: CELO_TOKEN_ABI,
      functionName: 'burn',
      args: [parseUnits(burnAmount, 18)],
    });
  };

  return (
    <div className="w-full max-w-6xl space-y-8 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Celo Token Dashboard</h1>
          <p className="mt-2 text-zinc-400">Manage your ERC20 token on Celo</p>
        </div>
        <ConnectButton />
      </div>

      {!isConnected ? (
        <Card>
          <div className="py-12 text-center">
            <p className="text-zinc-400">Connect your wallet to interact with the token</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Token Info */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <h3 className="text-sm text-zinc-400">Token Name</h3>
              <p className="mt-2 text-2xl font-bold">{name || '—'}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-zinc-400">Symbol</h3>
              <p className="mt-2 text-2xl font-bold">{symbol || '—'}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-zinc-400">Total Supply</h3>
              <p className="mt-2 text-2xl font-bold">
                {totalSupply ? formatUnits(totalSupply, 18) : '—'}
              </p>
            </Card>
            <Card>
              <h3 className="text-sm text-zinc-400">Max Supply</h3>
              <p className="mt-2 text-2xl font-bold">
                {maxSupply ? formatUnits(maxSupply, 18) : '—'}
              </p>
            </Card>
          </div>

          {/* Your Balance */}
          <Card>
            <h2 className="text-xl font-semibold">Your Balance</h2>
            <p className="mt-4 text-4xl font-bold">
              {balance ? formatUnits(balance, 18) : '0'} {symbol}
            </p>
            <p className="mt-2 text-sm text-zinc-400">{address}</p>
          </Card>

          {/* Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Transfer */}
            <Card>
              <h2 className="text-xl font-semibold">Transfer Tokens</h2>
              <form onSubmit={handleTransfer} className="mt-4 space-y-4">
                <Input
                  label="Recipient Address"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="0x..."
                />
                <Input
                  label="Amount"
                  type="number"
                  step="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.0"
                />
                <Button type="submit" loading={isPending || isConfirming}>
                  Transfer
                </Button>
              </form>
            </Card>

            {/* Burn */}
            <Card>
              <h2 className="text-xl font-semibold">Burn Tokens</h2>
              <form onSubmit={handleBurn} className="mt-4 space-y-4">
                <Input
                  label="Amount to Burn"
                  type="number"
                  step="0.01"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  placeholder="0.0"
                />
                <Button type="submit" variant="outline" loading={isPending || isConfirming}>
                  Burn
                </Button>
              </form>
            </Card>
          </div>

          {/* Mint (Owner Only) */}
          <Card>
            <h2 className="text-xl font-semibold">Mint Tokens (Owner Only)</h2>
            <form onSubmit={handleMint} className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Recipient Address"
                  value={mintTo}
                  onChange={(e) => setMintTo(e.target.value)}
                  placeholder="0x..."
                />
                <Input
                  label="Amount"
                  type="number"
                  step="0.01"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <Button type="submit" loading={isPending || isConfirming}>
                Mint
              </Button>
            </form>
          </Card>

          {/* Transaction Status */}
          {hash && (
            <Card className="border-green-900 bg-green-950/20">
              <p className="text-sm text-green-400">
                Transaction submitted: {hash}
                {isConfirming && ' (Confirming...)'}
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
