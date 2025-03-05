"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '@/providers/auth-provider';

// Define interfaces for better type safety
interface Permission {
  id: number;
  name: string;
  description?: string;
}

interface Role {
  id: string | number;
  name: string;
  role: string;
  permissions: {
    pargon: string[];
    parasole: string[];
    [key: string]: string[];
  };
}

interface PermissionContextType {
  userRole: Role | null;
  loading: boolean;
  hasPermission: (website: string, action: string) => boolean;
  refreshPermissions: () => Promise<void>;
  permissionsList: {
    [website: string]: string[];
  };
}

const PermissionContext = createContext<PermissionContextType>({
  userRole: null,
  loading: true,
  hasPermission: () => false,
  refreshPermissions: async () => {},
  permissionsList: {}
});

export function PermissionProvider({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  const { user } = useAuth(); // Get user from your existing auth provider
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionsList, setPermissionsList] = useState<{ [website: string]: string[] }>({
    pargon: [],
    parasole: []
  });

  // Function to fetch role and permissions data
  const fetchRolePermissions = async (roleId: string | number) => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      
      if (!token) {
        console.error('No authentication token found');
        setLoading(false);
        return null;
      }

      const response = await fetch(`http://localhost:7000/api/v1/role_permission/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch role permissions');
        setLoading(false);
        return null;
      }

      const data = await response.json();
      
      // Extract role data based on your API response structure
      const roleData = data.data || data.role || data;
      
      return {
        id: roleData.id || roleData._id,
        name: roleData.name || '',
        role: roleData.role || '',
        permissions: {
          pargon: Array.isArray(roleData.permissions?.pargon) ? roleData.permissions.pargon : [],
          parasole: Array.isArray(roleData.permissions?.parasole) ? roleData.permissions.parasole : [],
        },
      };
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      setLoading(false);
      return null;
    }
  };

  // Function to refresh user's role and permissions
  const refreshPermissions = async () => {
    // Get roleId from user object or token
    const roleId = user?.roleId || getUserRoleFromToken();
    
    if (!roleId) {
      console.error('No role ID available to fetch permissions');
      setLoading(false);
      return;
    }
    
    const roleData = await fetchRolePermissions(roleId);
    
    if (roleData) {
      setUserRole(roleData);
      
      // Extract all available permissions for each website
      const websites = Object.keys(roleData.permissions);
      const permissions: { [website: string]: string[] } = {};
      
      websites.forEach(website => {
        permissions[website] = roleData.permissions[website] || [];
      });
      
      setPermissionsList(permissions);
    }
    
    setLoading(false);
  };

  // Helper to extract role ID from token if available
  const getUserRoleFromToken = (): string | number | null => {
    try {
      const token = Cookies.get('token');
      if (!token) return null;
      
      // Parse JWT token
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roleId || payload.role_id || null;
    } catch (error) {
      console.error('Error parsing token for role ID:', error);
      return null;
    }
  };

  // Check if user has a specific permission
  const hasPermission = (website: string, action: string): boolean => {
    if (!userRole || !userRole.permissions) return false;
    
    // Check if website exists in permissions
    if (!userRole.permissions[website]) return false;
    
    // Check if the action is included in the website permissions
    return userRole.permissions[website].includes(action);
  };

  // Load initial permissions when user changes
  useEffect(() => {
    if (user) {
      refreshPermissions();
    } else {
      setLoading(false);
      setUserRole(null);
    }
  }, [user]);

  return (
    <PermissionContext.Provider 
      value={{ 
        userRole,
        loading,
        hasPermission,
        refreshPermissions,
        permissionsList
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export const usePermission = () => useContext(PermissionContext);