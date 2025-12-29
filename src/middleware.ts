import { NextResponse, type NextRequest } from 'next/server';
import { createClientForServer } from './utils/supabase/server';
import { APP_URLS } from './components/layout/data/sidebar-data';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Create a Supabase client configured to manage cookies in the middleware
  const supabase = await createClientForServer()

  // Refresh the session (this will also update the cookies if necessary)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let verifiedUser = null;
  if (session) {
    const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
    if (!error && user) {
      verifiedUser = user;
    }
  }

  const routesWithoutAuth = ['/', '/sign-in'];
  const protectedRoutesSuperAdmin = ['/companies'];
  const protectedRoutes = ['/companies', APP_URLS.USUARIOS];

  if (!verifiedUser && !routesWithoutAuth.includes(req.nextUrl.pathname)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/sign-in';
    return NextResponse.redirect(redirectUrl);
  }

  if (verifiedUser?.id === process.env.ID_SUPER_ADMIN 
    && !protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/companies', req.url));
  }

  // If the user is on the login page but already has a session, redirect to dashboard
  if (verifiedUser && verifiedUser?.id !== process.env.ID_SUPER_ADMIN && (routesWithoutAuth.includes(req.nextUrl.pathname) || protectedRoutesSuperAdmin.includes(req.nextUrl.pathname))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Return the response, which may have updated cookies
  return res;
}

export const config = {
  matcher: [
    // Exclude static assets, images, and internal Next.js routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

