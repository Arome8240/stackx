import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { config } from '../config';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  network: 'mainnet' | 'testnet';
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: any) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WALLET_ADDRESS_KEY = 'wallet_address';
const WALLET_SESSION_KEY = 'wallet_session';

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    network: config.stacksNetwork,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved wallet session on mount
  useEffect(() => {
    loadWalletSession();
  }, []);

  const loadWalletSession = async () => {
    try {
      const savedAddress = await SecureStore.getItemAsync(WALLET_ADDRESS_KEY);
      const savedSession = await SecureStore.getItemAsync(WALLET_SESSION_KEY);

      if (savedAddress && savedSession) {
        setState({
          address: savedAddress,
          isConnected: true,
          network: config.stacksNetwork,
        });
      }
    } catch (err) {
      console.error('Error loading wallet session:', err);
    }
  };

  const connect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement actual wallet connection
      // For now, this is a placeholder that will be replaced with:
      // 1. Deep link to Hiro/Xverse wallet
      // 2. Or custom wallet implementation

      // Placeholder implementation
      throw new Error('Wallet connection not yet implemented. Please deploy contracts first.');

      // Future implementation will look like:
      // const authRequest = generateAuthRequest();
      // const response = await openWalletForAuth(authRequest);
      // const address = extractAddress(response);
      
      // await SecureStore.setItemAsync(WALLET_ADDRESS_KEY, address);
      // await SecureStore.setItemAsync(WALLET_SESSION_KEY, JSON.stringify(response));
      
      // setState({
      //   address,
      //   isConnected: true,
      //   network: config.stacksNetwork,
      // });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await SecureStore.deleteItemAsync(WALLET_ADDRESS_KEY);
      await SecureStore.deleteItemAsync(WALLET_SESSION_KEY);

      setState({
        address: null,
        isConnected: false,
        network: config.stacksNetwork,
      });
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      throw err;
    }
  };

  const signTransaction = async (tx: any): Promise<string> => {
    if (!state.isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement transaction signing
      // This will involve:
      // 1. Prepare transaction for signing
      // 2. Open wallet via deep link
      // 3. Receive signed transaction
      // 4. Return transaction ID

      throw new Error('Transaction signing not yet implemented');

      // Future implementation:
      // const signedTx = await openWalletForSigning(tx);
      // return signedTx.txId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: WalletContextType = {
    ...state,
    connect,
    disconnect,
    signTransaction,
    isLoading,
    error,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
