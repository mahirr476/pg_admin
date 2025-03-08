// app/api/role_permission/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { shouldUseDefaultPermissions, DEV_DEFAULT_PERMISSIONS } from '@/utils/permissions-config'

export async function GET(req: NextRequest) {
  try {
    // Get the token from cookies
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    
    // Try to get the session token or any other auth method your backend might use
    const sessionToken = cookieStore.get('next-auth.session-token')?.value
    
    // Check for authorization header from client-side requests
    const authHeader = request.headers.get('authorization')
    
    // Use any available authentication method
    const authToken = token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null)

    // Check if we're in development mode and using default permissions
    if (shouldUseDefaultPermissions()) {
      console.log('Using default permissions for development mode')
      return NextResponse.json({
        status: 'success',
        message: 'Default permissions for development',
        rolePermission: DEV_DEFAULT_PERMISSIONS,
        role: 'Super Admin' // Default role for development
      })
    }
    
    // Check if we have any authentication method available
    if (!authToken && !sessionToken) {
      console.log('No authentication method found')
      
      // For development, return default permissions
      // In production, return unauthorized
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          status: 'success',
          message: 'Default permissions for development (no auth)',
          rolePermission: DEV_DEFAULT_PERMISSIONS
        })
      } else {
        return NextResponse.json(
          { status: 'error', message: 'Unauthorized - No valid authentication found' },
          { status: 401 }
        )
      }
    }
    
    // Forward the request to your backend API
    const response = await fetch('http://localhost:7000/api/v1/role_permission', {
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(sessionToken ? { Cookie: `next-auth.session-token=${sessionToken}` } : {}),
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      return NextResponse.json(
        { status: 'error', message: 'Failed to fetch permissions', error: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Return the data from your backend
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in role_permission API route:', error)
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}