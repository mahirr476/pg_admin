// "use client"

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// import Cookies from "js-cookie"
// import { shouldUseDefaultPermissions, DEV_DEFAULT_PERMISSIONS } from '../utils/permissions-config'

// // Define the permission structure based on your existing role permissions
// interface RolePermission {
//   id: number
//   role?: string // Add role field to track user's role
//   paragon_group_view: boolean
//   paragon_group_create: boolean
//   paragon_group_edit: boolean
//   paragon_group_delete: boolean
//   parasole_view: boolean
//   parasole_create: boolean
//   parasole_edit: boolean
//   parasole_delete: boolean
//   user_view: boolean
//   user_create: boolean
//   user_edit: boolean
//   user_delete: boolean
//   settings_view: boolean
//   settings_create: boolean
//   settings_edit: boolean
//   dashboard: boolean
//   analytics_view: boolean
// }

// interface PermissionContextType {
//   permissions: RolePermission | null
//   loading: boolean
//   hasPermission: (permission: keyof RolePermission) => boolean
//   refreshPermissions: () => Promise<void>
//   userRole: string | null
//   isAdmin: boolean
//   isSuperAdmin: boolean
// }

// // Create the context with a default value
// const PermissionContext = createContext<PermissionContextType>({
//   permissions: null,
//   loading: true,
//   hasPermission: () => false,
//   refreshPermissions: async () => {},
//   userRole: null,
//   isAdmin: false,
//   isSuperAdmin: false
// })

// // Hook to use the permission context
// export const usePermissions = () => useContext(PermissionContext)

// interface PermissionProviderProps {
//   children: ReactNode
// }

// export function PermissionProvider({ children }: PermissionProviderProps) {
//   const [permissions, setPermissions] = useState<RolePermission | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [userRole, setUserRole] = useState<string | null>(null)
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false)

//   // Function to fetch permissions
//   const fetchPermissions = async () => {
//     try {
//       setLoading(true)
      
//       // If we're in development mode and permissions bypass is enabled,
//       // just use the default permissions without making an API call
//       if (shouldUseDefaultPermissions()) {
//         console.log("Using default permissions for development mode")
//         setPermissions(DEV_DEFAULT_PERMISSIONS)
//         setLoading(false)
//         return
//       }
      
//       // Get token from cookies
//       const token = Cookies.get("token")

//       if (!token) {
//         console.log("No authentication token found, attempting to fetch permissions without token")
//       }

//       // Replace with your actual API endpoint
//       const response = await fetch("/api/role_permission", {
//         headers: {
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           "Content-Type": "application/json",
//         },
//         credentials: 'include', // Include cookies in the request
//       })
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch permissions: ${response.status}`)
//       }
      
//       const data = await response.json()
      
//       if (data.status === "success" && data.rolePermission) {
//         setPermissions(data.rolePermission)
//       } else {
//         console.error('Failed to fetch permissions:', data.message || 'Unknown error')
//       }
//     } catch (error) {
//       console.error('Error fetching permissions:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Function to check if user has a specific permission
//   const hasPermission = (permission: keyof RolePermission): boolean => {
//     // Super Admin always has all permissions
//     if (isSuperAdmin) return true
    
//     // Admin has access to most things except critical permissions you want to restrict
//     if (isAdmin) {
//       // You can add specific restrictions for Admin here if needed
//       // For example, if you want to restrict some critical operations:
//       // if (permission === 'some_critical_permission') return false;
      
//       // Generally admins have access to everything
//       return true
//     }
    
//     // Regular users - check specific permissions
//     if (!permissions) return false
//     return !!permissions[permission]
//   }

//   // Function to refresh permissions
//   const refreshPermissions = async () => {
//     await fetchPermissions()
//   }

//   // Fetch permissions on component mount
//   useEffect(() => {
//     fetchPermissions()
//   }, [])

//   return (
//     <PermissionContext.Provider 
//       value={{ 
//         permissions, 
//         loading, 
//         hasPermission, 
//         refreshPermissions,
//         userRole,
//         isAdmin,
//         isSuperAdmin
//       }}
//     >
//       {children}
//     </PermissionContext.Provider>
//   )
// }




"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from "js-cookie"
import { shouldUseDefaultPermissions, DEV_DEFAULT_PERMISSIONS } from '../utils/permissions-config'

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

  // Function to fetch permissions
  const fetchPermissions = async () => {
    try {
      setLoading(true)
      
      // If we're in development mode and permissions bypass is enabled,
      // just use the default permissions without making an API call
      if (shouldUseDefaultPermissions()) {
        console.log("Using default permissions for development mode")
        setPermissions(DEV_DEFAULT_PERMISSIONS)
        setUserRole(DEV_DEFAULT_PERMISSIONS.role || 'Super Admin')
        setIsAdmin(true)
        setIsSuperAdmin(true)
        setLoading(false)
        return
      }
      
      // Get token from cookies
      const token = Cookies.get("token")

      if (!token) {
        console.log("No authentication token found, attempting to fetch permissions without token")
      }

      // Step 1: Fetch the user data to get role information
      const userResponse = await fetch("http://localhost:7000/api/v1/user/me", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        credentials: 'include',
      })
      
      if (!userResponse.ok) {
        console.warn(`Failed to fetch user data: ${userResponse.status}`)
      } else {
        // Process user data
        const userData = await userResponse.json()
        console.log("User data fetched:", userData)
        
        // Set user role based on response structure
        const roleFromUser = userData.user?.role?.role || userData.user?.role || userData.role || null
        setUserRole(roleFromUser)
        
        // Update admin flags based on role
        setIsAdmin(roleFromUser === 'Admin')
        setIsSuperAdmin(roleFromUser === 'Super Admin')
      }

      // Step 2: Fetch permissions
      const permissionResponse = await fetch("http://localhost:7000/api/v1/role_permission", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        credentials: 'include',
      })
      
      if (!permissionResponse.ok) {
        throw new Error(`Failed to fetch permissions: ${permissionResponse.status}`)
      }
      
      const permData = await permissionResponse.json()
      
      if (permData.status === "success" && permData.rolePermission) {
        setPermissions(permData.rolePermission)
        
        // Fallback: If we couldn't get the role from user data, try from permission data
        if (!userRole) {
          const roleFromPerm = permData.role || permData.rolePermission.role || null
          if (roleFromPerm) {
            setUserRole(roleFromPerm)
            setIsAdmin(roleFromPerm === 'Admin')
            setIsSuperAdmin(roleFromPerm === 'Super Admin')
          }
        }
      } else {
        console.error('Failed to fetch permissions:', permData.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to check if user has a specific permission
  const hasPermission = (permission: keyof RolePermission): boolean => {
    // Critical permissions that even Super Admins need explicit permission for
    const criticalPermissions: (keyof RolePermission)[] = [
      'user_view',
      'user_create',
      'user_edit',
      'user_delete'
    ]
    
    // Check if this is a critical permission that requires explicit granting
    if (criticalPermissions.includes(permission)) {
      // Even Super Admins and Admins need explicit permission for these
      return permissions ? !!permissions[permission] : false
    }
    
    // For non-critical permissions, Super Admins have automatic access
    if (isSuperAdmin) return true
    
    // Admins have access to most things except critical permissions
    if (isAdmin) return true
    
    // Regular users - check specific permissions
    if (!permissions) return false
    return !!permissions[permission]
  }

  // Function to refresh permissions
  const refreshPermissions = async () => {
    await fetchPermissions()
  }

  // Fetch permissions on component mount
  useEffect(() => {
    fetchPermissions()
  }, [])

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