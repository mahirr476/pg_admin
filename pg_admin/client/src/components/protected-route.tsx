"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/providers/permission-context'
import { Shield } from 'lucide-react'

interface ProtectedRouteProps {
  requiredPermission: string
  children: React.ReactNode
  fallbackPath?: string
  allowSuperAdmin?: boolean
  allowAdmin?: boolean
}

export function ProtectedRoute({ 
  requiredPermission, 
  children, 
  fallbackPath = '/admin/dashboard',
  allowSuperAdmin = true,
  allowAdmin = true
}: ProtectedRouteProps) {
  const { hasPermission, loading, isSuperAdmin, isAdmin } = usePermissions()
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Skip the check if we're still loading permissions
    if (loading) return

    // Super admin override
    if (isSuperAdmin && allowSuperAdmin) {
      setShowContent(true)
      return
    }

    // Admin override
    if (isAdmin && allowAdmin) {
      setShowContent(true)
      return
    }

    // Check if the user has the required permission
    if (!hasPermission(requiredPermission as any)) {
      // Redirect to fallback path if permission is not granted
      router.push(fallbackPath)
    } else {
      setShowContent(true)
    }
  }, [hasPermission, loading, requiredPermission, router, fallbackPath, isSuperAdmin, isAdmin, allowSuperAdmin, allowAdmin])

  // Show loading state while checking permissions
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500">Checking permissions...</p>
      </div>
    )
  }

  // Show access denied message briefly before redirect happens
  if (!showContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <Shield className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">
          You don't have permission to access this page.
        </p>
        <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
      </div>
    )
  }

  // Only render children if the user has the required permission
  return <>{children}</>
}