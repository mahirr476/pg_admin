// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname
//   const isPublicPath = path === '/login' || path === '/register'
//   const token = request.cookies.get('token')?.value || ''

//   // Redirect to login if accessing protected route without token
//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   // Redirect to dashboard if accessing login/register with valid token
//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }
// }

// // Configure which routes to run middleware on
// export const config = {
//   matcher: [
//     '/',
//     '/dashboard',
//     '/dashboard/:path*',
//     '/login',
//     '/register',
//     // Add other protected routes here
//   ]
// }



import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public paths that don't require authentication
const publicPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check token in both cookie and authorization header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // If there's a token and trying to access login/register, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add token to request headers for API routes
  const response = NextResponse.next();
  if (token) {
    response.headers.set('Authorization', `Bearer ${token}`);
  }

  return response;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}