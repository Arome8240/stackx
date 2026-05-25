'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, setToken, clearToken } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';

interface LoginPayload { email: string; password: string }
interface RegisterPayload { username: string; email: string; password: string }
interface AuthUser { id: string; email: string; username: string; stxAddress?: string }
interface AuthResponse { accessToken: string; user: AuthUser }

export function useCurrentUser() {
  return useQuery<AuthUser | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        return await api.get<AuthUser>('/auth/me');
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      api.post<AuthResponse>('/auth/login', payload),
    onSuccess: ({ accessToken, user }) => {
      setToken(accessToken);
      qc.setQueryData(['auth', 'me'], user);
      toast({ type: 'success', title: 'Welcome back!', description: `@${user.username}` });
    },
    onError: (err: Error) => {
      toast({ type: 'error', title: 'Login failed', description: err.message });
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      api.post<AuthResponse>('/auth/register', payload),
    onSuccess: ({ accessToken, user }) => {
      setToken(accessToken);
      qc.setQueryData(['auth', 'me'], user);
      toast({ type: 'success', title: 'Account created!', description: `Welcome @${user.username}` });
    },
    onError: (err: Error) => {
      toast({ type: 'error', title: 'Registration failed', description: err.message });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();

  return React.useCallback(() => {
    clearToken();
    qc.clear();
    window.location.href = '/login';
  }, [qc]);
}
