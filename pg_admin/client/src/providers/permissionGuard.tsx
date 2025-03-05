"use client";

import { ReactNode, useEffect } from 'react';
import { usePermission } from './permissionProvider';
import { useRouter } from 'next/navigation';

// Component to protect UI elements based on permissions
export function PermissionGate({ 
  children, 
  website, 
  action,
  fallback = null
}: { 
  children: ReactNode, 
  website: string, 
  action: string,
  fallback?: ReactNode
}) {
  const { hasPermission, loading } = usePermission();
  
  if (loading) return null;
  if (!hasPermission(website, action)) return <>{fallback}</>;
  
  return <>{children}</>;
}

// Component to protect routes based on permissions
export function PermissionGuard({ 
  children, 
  website, 
  action,
  redirectTo = '/unauthorized'
}: { 
  children: ReactNode, 
  website: string, 
  action: string,
  redirectTo?: string
}) {
  const { hasPermission, loading } = usePermission();
  const router = useRouter();
  
  useEffect(() => {
    // Wait until permission loading is complete
    if (loading) return;
    
    // Redirect if user doesn't have the required permission
    if (!hasPermission(website, action)) {
      router.push(redirectTo);
    }
  }, [loading, hasPermission, website, action, router, redirectTo]);

  // Don't render children until permission check is complete
  if (loading) return null;
  if (!hasPermission(website, action)) return null;
  
  return <>{children}</>;
}

// Higher-order component for permission-based protection
export function withPermission(
  Component: React.ComponentType<any>,
  website: string,
  action: string
) {
  return function PermissionWrappedComponent(props: any) {
    const { hasPermission, loading } = usePermission();
    
    if (loading) return null;
    if (!hasPermission(website, action)) return null;
    
    return <Component {...props} />;
  };
}

// Component to display content based on multiple permission requirements
export function PermissionSwitch({
  cases,
  fallback = null
}: {
  cases: {
    permissions: { website: string, action: string }[];
    content: ReactNode;
  }[];
  fallback?: ReactNode;
}) {
  const { hasPermission, loading } = usePermission();
  
  if (loading) return null;
  
  for (const caseItem of cases) {
    const hasAllPermissions = caseItem.permissions.every(
      permission => hasPermission(permission.website, permission.action)
    );
    
    if (hasAllPermissions) {
      return <>{caseItem.content}</>;
    }
  }
  
  return <>{fallback}</>;
}