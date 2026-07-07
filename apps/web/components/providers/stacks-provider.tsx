'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCurrentUser } from '@/lib/hooks/use-auth';

interface StacksContextType {
  isAuthenticated: boolean;
  userAddress: string | null;
  isAdmin: boolean;
}

const StacksContext = createContext<StacksContextType>({
  isAuthenticated: false,
  userAddress: null,
  isAdmin: false,
});

/**
 * Identity now comes entirely from the backend JWT session — StackX holds custody of the user's
 * Stacks wallet, so there's no separate browser wallet-connect session to track anymore.
 * `isAdmin` has no real backend-side role check yet (TODO: add a role field server-side); it
 * defaults to false rather than granting access based on a client-derived value.
 */
export function StacksProvider({ children }: { children: ReactNode }) {
  const { data: user } = useCurrentUser();

  return (
    <StacksContext.Provider
      value={{
        isAuthenticated: !!user,
        userAddress: user?.stxAddress ?? null,
        isAdmin: false,
      }}
    >
      {children}
    </StacksContext.Provider>
  );
}

export function useStacks() {
  return useContext(StacksContext);
}
