"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { usePermission } from './permissionProvider';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: {
    website: string;
    action: string;
  };
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredPermission,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { hasPermission, loading: permissionLoading } = usePermission();
  
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;
    
    // Redirect unauthenticated users to login
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }
    
    // If permission check is required and permissions are loaded
    if (requiredPermission && !permissionLoading) {
      // Redirect if user doesn't have the required permission
      if (!hasPermission(requiredPermission.website, requiredPermission.action)) {
        router.push('/unauthorized');
      }
    }
  }, [
    isAuthenticated, 
    authLoading, 
    permissionLoading, 
    requiredPermission, 
    hasPermission, 
    router, 
    redirectTo
  ]);

  // Show nothing while loading or if not authenticated
  if (authLoading || !isAuthenticated) {
    return null;
  }
  
  // If permission check is required, show nothing while loading permissions
  if (requiredPermission && permissionLoading) {
    return null;
  }
  
  // If permission check is required, only render if user has permission
  if (requiredPermission && !hasPermission(requiredPermission.website, requiredPermission.action)) {
    return null;
  }

  // Everything is good, render the children
  return <>{children}</>;
}