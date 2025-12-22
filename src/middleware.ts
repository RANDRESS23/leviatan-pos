import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { createClientForServer } from './utils/supabase/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Create a Supabase client configured to manage cookies in the middleware
  const supabase = await createClientForServer()

  // Refresh the session (this will also update the cookies if necessary)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const authRoutes = ['/sign-in'];
  // Protect specific routes (e.g., a '/dashboard' route)
  // const protectedRoutes = ['/dashboard', '/profile'];
  if (!session && !authRoutes.includes(req.nextUrl.pathname)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/sign-in';
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is on the login page but already has a session, redirect to dashboard
  if (session && authRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Return the response, which may have updated cookies
  return res;
}

export const config = {
  matcher: [
    // '/',
    // '/dashboard/:path*', // Protects /dashboard and all subpaths
    // '/profile/:path*',
    // '/login',
    // '/signup',
    // Exclude static assets, images, and internal Next.js routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

