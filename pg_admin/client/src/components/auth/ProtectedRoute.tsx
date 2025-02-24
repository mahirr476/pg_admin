"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth(); // Add loading state if available in your auth provider

  useEffect(() => {
    // Only check redirection if not loading and not authenticated
    if (!loading && !isAuthenticated) {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.replace('/login'); // Use replace instead of push to prevent going back
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}