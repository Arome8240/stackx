'use client';

import { Connect } from '@stacks/connect-react';
import { APP_NAME, APP_ICON, userSession } from '@/lib/stacks-config';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StacksContextType {
  isAuthenticated: boolean;
  userAddress: string | null;
  isAdmin: boolean;
  connect: () => void;
  disconnect: () => void;
}

const StacksContext = createContext<StacksContextType>({
  isAuthenticated: false,
  userAddress: null,
  isAdmin: false,
  connect: () => {},
  disconnect: () => {},
});

export function StacksProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const address = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
      setUserAddress(address);
      setIsAuthenticated(true);
      
      // Check if user is admin (deployer)
      const deployerAddress = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS;
      setIsAdmin(address === deployerAddress);
    }
  }, []);

  const connect = () => {
    // Will be handled by Connect component
  };

  const disconnect = () => {
    userSession.signUserOut();
    setIsAuthenticated(false);
    setUserAddress(null);
    setIsAdmin(false);
    window.location.reload();
  };

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: APP_NAME,
          icon: APP_ICON,
        },
        onFinish: () => {
          const userData = userSession.loadUserData();
          const address = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
          setUserAddress(address);
          setIsAuthenticated(true);
          
          const deployerAddress = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS;
          setIsAdmin(address === deployerAddress);
        },
        userSession,
      }}
    >
      <StacksContext.Provider
        value={{
          isAuthenticated,
          userAddress,
          isAdmin,
          connect,
          disconnect,
        }}
      >
        {children}
      </StacksContext.Provider>
    </Connect>
  );
}

export function useStacks() {
  const context = useContext(StacksContext);
  if (!context) {
    throw new Error('useStacks must be used within StacksProvider');
  }
  return context;
}
