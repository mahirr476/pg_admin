"use client"

import { ProtectedRoute } from '@/components/protected-route'

// This is a layout for the User Management pages
export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredPermission="user_view">
      {children}
    </ProtectedRoute>
  )
}