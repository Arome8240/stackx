const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Something went wrong');
  return data as T;
}

export interface AuthResponse {
  access_token: string;
  user: { id: string; email: string; username: string };
}

export const authApi = {
  register: (body: { username: string; email: string; password: string }) =>
    request<AuthResponse>('/auth/register', body),

  login: (body: { email: string; password: string }) => request<AuthResponse>('/auth/login', body),
};
