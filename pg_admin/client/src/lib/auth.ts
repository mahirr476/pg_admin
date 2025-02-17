import { cookies } from 'next/headers';

export function getToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get('token')?.value || null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}