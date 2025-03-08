// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { shouldUseDefaultPermissions } from '@/utils/permissions-config'

// Define route patterns that require specific permissions
const routePermissions: Record<string, { permission: string, strict: boolean }> = {
  '/admin/dashboard': { permission: 'dashboard', strict: false },
  '/admin/users': { permission: 'user_view', strict: true }, // Strict: everyone needs this permission
  '/admin/manageUser': { permission: 'user_view', strict: true }, // Strict: everyone needs this permission
  '/admin/analytics': { permission: 'analytics_view', strict: false },
  '/admin/settings': { permission: 'settings_view', strict: false },
  '/admin/parasole': { permission: 'parasole_view', strict: false },
  '/admin/paragon': { permission: 'paragon_group_view', strict: false },
}

// Function to check if a path matches any of the protected routes
function getRequiredPermission(path: string): { permission: string, strict: boolean } | null {
  for (const route in routePermissions) {
    if (path.startsWith(route)) {
      return routePermissions[route]
    }
  }
  return null
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Skip middleware for API routes and authentication routes
  if (path.startsWith('/api') || path.startsWith('/auth')) {
    return NextResponse.next()
  }
  
  // Get the required permission for this route
  const permissionData = getRequiredPermission(path)
  
  // If no permission is required for this route, allow access
  if (!permissionData) {
    return NextResponse.next()
  }
  
  // In development mode, bypass permission checks if configured to do so
  // But don't bypass STRICT permission checks even in development
  if (shouldUseDefaultPermissions() && !permissionData.strict) {
    console.log(`Development mode - bypassing non-strict permission check for ${permissionData.permission}`)
    return NextResponse.next()
  }

  // Check for any auth tokens or sessions
  const token = request.cookies.get('token')?.value
  const sessionToken = request.cookies.get('next-auth.session-token')?.value
  
  // For development mode, you can bypass authentication checks for non-strict permissions
  const isDev = process.env.NODE_ENV === 'development'
  
  // If no authentication and not in dev mode, redirect to login
  if (!token && !sessionToken && !isDev) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  try {
    // Prepare the headers with available auth tokens
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Cookie'] = `token=${token}`
      headers['Authorization'] = `Bearer ${token}`
    }
    
    if (sessionToken) {
      headers['Cookie'] = `${headers['Cookie'] || ''}; next-auth.session-token=${sessionToken}`
    }
    
    const permissionResponse = await fetch(`${request.nextUrl.origin}/api/role_permission`, {
      headers,
    })
    
    if (!permissionResponse.ok) {
      // If the API call fails, redirect to dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    
    const permissionData = await permissionResponse.json()
    
    // Check if the user has the required permission
    // For STRICT permissions, even Super Admin needs the explicit permission
    const hasPermission = permissionData.status === 'success' && 
                          permissionData.rolePermission && 
                          permissionData.rolePermission[permissionData.permission]
    
    // For NON-STRICT permissions, role can override
    const hasRoleOverride = !permissionData.strict && 
                           (permissionData.role === 'Super Admin' || 
                           permissionData.role === 'Admin')
    
    if (hasPermission || hasRoleOverride) {
      // User has permission, allow access
      return NextResponse.next()
    }
    
    // User doesn't have permission, redirect to dashboard
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  } catch (error) {
    console.error('Error in permission middleware:', error)
    // On error, redirect to dashboard
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }
}

// Configure the paths that this middleware should run on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}