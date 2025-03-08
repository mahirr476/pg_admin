
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from "js-cookie"

// Define the permission structure based on your existing role permissions
interface RolePermission {
  id: number
  role?: string
  paragon_group_view: boolean
  paragon_group_create: boolean
  paragon_group_edit: boolean
  paragon_group_delete: boolean
  parasole_view: boolean
  parasole_create: boolean
  parasole_edit: boolean
  parasole_delete: boolean
  user_view: boolean
  user_create: boolean
  user_edit: boolean
  user_delete: boolean
  settings_view: boolean
  settings_create: boolean
  settings_edit: boolean
  dashboard: boolean
  analytics_view: boolean
}

interface PermissionContextType {
  permissions: RolePermission | null
  loading: boolean
  hasPermission: (permission: keyof RolePermission) => boolean
  refreshPermissions: () => Promise<void>
  userRole: string | null
  isAdmin: boolean
  isSuperAdmin: boolean
}

// Create the context with a default value
const PermissionContext = createContext<PermissionContextType>({
  permissions: null,
  loading: true,
  hasPermission: () => false,
  refreshPermissions: async () => {},
  userRole: null,
  isAdmin: false,
  isSuperAdmin: false
})

// Hook to use the permission context
export const usePermissions = () => useContext(PermissionContext)

interface PermissionProviderProps {
  children: ReactNode
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const [permissions, setPermissions] = useState<RolePermission | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [roleId, setRoleId] = useState<number | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      // Get token from cookies
      const token = Cookies.get("token")

      if (!token) {
        console.log("No authentication token found")
        return null
      }

      // Fetch the user data
      const userResponse = await fetch("http://localhost:7000/api/v1/user/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      if (!userResponse.ok) {
        console.warn(`Failed to fetch user data: ${userResponse.status}`)
        return null
      }
      
      const userData = await userResponse.json()
      console.log("User data fetched:", userData)
      
      // Find the current user (usually the first one or with a specific condition)
      // In a real app, you might want to fetch the current user specifically
      if (userData.status === "success" && userData.users && userData.users.length > 0) {
        // Assuming the first user is the current user (modify this logic if needed)
        const currentUser = userData.users[0]
        
        return {
          userId: currentUser.id,
          roleId: currentUser.roleId,
          roleName: currentUser.role
        }
      }
      
      return null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  // Function to fetch permissions using role ID
  const fetchRolePermissions = async (id: number) => {
    try {
      // Get token from cookies
      const token = Cookies.get("token")

      if (!token) {
        console.log("No authentication token found for permission fetch")
        return null
      }

      // Fetch permissions using the role ID
      console.log(`Fetching permissions for role ID: ${id}`)
      const permissionResponse = await fetch(`http://localhost:7000/api/v1/role_permission/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      if (!permissionResponse.ok) {
        console.warn(`Failed to fetch permissions: ${permissionResponse.status}`)
        return null
      }
      
      const permData = await permissionResponse.json()
      console.log("Permission data fetched:", permData)
      
      if (permData.status === "success" && permData.rolePermission) {
        return permData.rolePermission
      }
      
      return null
    } catch (error) {
      console.error('Error fetching role permissions:', error)
      return null
    }
  }

  // Main function to fetch permissions
  const fetchPermissions = async () => {
    try {
      setLoading(true)
      
      // Step 1: Try to fetch user data and role ID
      const userData = await fetchUserData()
      
      // Set user role if available
      if (userData && userData.roleName) {
        const roleName = userData.roleName;
        setUserRole(roleName)
        
        // Check if user is admin or super admin
        const normalizedRole = typeof roleName === 'string' 
          ? roleName.toLowerCase().trim() 
          : '';
        
        const superAdminCheck = normalizedRole === 'superadmin' || 
                               normalizedRole === 'super admin' || 
                               normalizedRole.includes('super');
                               
        const adminCheck = normalizedRole === 'admin';
        
        setIsAdmin(adminCheck)
        setIsSuperAdmin(superAdminCheck)
        
        console.log('User role set:', roleName)
        console.log('Is admin:', adminCheck)
        console.log('Is super admin:', superAdminCheck)
        
        // Set user ID if available
        if (userData.userId) {
          setUserId(userData.userId)
        }
      }
      
      let permissionData = null;
      
      // Step 2: If we have a role ID, try fetching permissions using it
      if (userData && userData.roleId) {
        setRoleId(userData.roleId)
        permissionData = await fetchRolePermissions(userData.roleId)
      } else {
        console.log("Could not determine user role ID, setting default permissions")
      }
      
      // Step 3: If we have permissions, set them
      if (permissionData) {
        setPermissions(permissionData)
        
        // If we couldn't get role name from user data, try from permissions
        if (!userRole && permissionData.role) {
          setUserRole(permissionData.role)
          
          // Check if user is admin or super admin from permission data
          const normalizedRole = typeof permissionData.role === 'string' 
            ? permissionData.role.toLowerCase().trim() 
            : '';
          
          setIsAdmin(normalizedRole === 'admin')
          setIsSuperAdmin(
            normalizedRole === 'superadmin' || 
            normalizedRole === 'super admin' || 
            normalizedRole.includes('super')
          )
        }
      } else {
        // If no permissions data, create a default object with user_view = false
        console.log("Setting default permissions with user_view = false")
        
        // Special case: if the user is Super Admin, set user_view to true by default
        const userViewDefault = isSuperAdmin;
        
        setPermissions({
          id: 0,
          role: userRole || '',
          paragon_group_view: false,
          paragon_group_create: false,
          paragon_group_edit: false,
          paragon_group_delete: false,
          parasole_view: false,
          parasole_create: false,
          parasole_edit: false,
          parasole_delete: false,
          user_view: userViewDefault, // Set to true for Super Admin
          user_create: false,
          user_edit: false,
          user_delete: false,
          settings_view: false,
          settings_create: false,
          settings_edit: false,
          dashboard: true, // Allow dashboard access
          analytics_view: false
        })
      }
    } catch (error) {
      console.error('Error in fetchPermissions:', error)
      // Set default permissions on error
      setPermissions({
        id: 0,
        role: userRole || '',
        paragon_group_view: false,
        paragon_group_create: false,
        paragon_group_edit: false,
        paragon_group_delete: false,
        parasole_view: false,
        parasole_create: false,
        parasole_edit: false,
        parasole_delete: false,
        user_view: isSuperAdmin, // Set to true for Super Admin
        user_create: false,
        user_edit: false,
        user_delete: false,
        settings_view: false,
        settings_create: false,
        settings_edit: false,
        dashboard: true, // Allow dashboard access
        analytics_view: false
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to check if user has a specific permission
  const hasPermission = (permission: keyof RolePermission): boolean => {
    // Special case for super admin role
    if (isSuperAdmin) {
      if (permission === 'user_view' || 
          permission === 'user_create' || 
          permission === 'user_edit' || 
          permission === 'user_delete') {
        console.log(`Super Admin granted ${permission} permission by default`);
        return true;
      }
    }
    
    // Check if the permission exists in the permissions object
    if (permissions && permissions[permission] === true) {
      console.log(`Permission ${permission} explicitly granted`);
      return true;
    }
    
    // If the user is Super Admin, grant access to everything
    if (isSuperAdmin) {
      console.log(`Super Admin granted ${permission} permission by role`);
      return true;
    }
    
    console.log(`Permission ${permission} denied`);
    return false;
  }

  // Function to refresh permissions
  const refreshPermissions = async () => {
    await fetchPermissions()
  }

  // Fetch permissions on component mount
  useEffect(() => {
    fetchPermissions()
  }, [])

  // Debug permissions after they're loaded
  useEffect(() => {
    if (!loading) {
      console.log('🔑 PERMISSION CONTEXT LOADED:')
      console.log('Permissions:', permissions)
      console.log('User role:', userRole)
      console.log('Role ID:', roleId)
      console.log('User ID:', userId)
      console.log('Is admin:', isAdmin)
      console.log('Is super admin:', isSuperAdmin)
      console.log('Has user_view permission:', permissions?.user_view)
      console.log('Should show user management:', isSuperAdmin || permissions?.user_view === true)
    }
  }, [loading, permissions, userRole, roleId, userId, isAdmin, isSuperAdmin])

  return (
    <PermissionContext.Provider 
      value={{ 
        permissions, 
        loading, 
        hasPermission, 
        refreshPermissions,
        userRole,
        isAdmin,
        isSuperAdmin
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}