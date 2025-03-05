// components/PermissionGate.tsx
'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionGateProps {
  module: string;
  action: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  action,
  fallback = null,
  children
}) => {
  const { hasPermission, loading } = useAuth();
  
  if (loading) return null;
  
  return hasPermission(module, action) ? <>{children}</> : <>{fallback}</>;
};

type Role = 'Super Admin' | 'Admin' | 'User';

interface RoleGateProps {
  allowedRoles: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles,
  fallback = null,
  children
}) => {
  const { hasRole, loading } = useAuth();
  
  if (loading) return null;
  
  const hasAllowedRole = allowedRoles.some(role => hasRole(role));
  
  return hasAllowedRole ? <>{children}</> : <>{fallback}</>;
};