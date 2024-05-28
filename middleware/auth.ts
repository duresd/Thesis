import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/auth';

export async  function middleware(request: NextRequest ) {
  const url = request.nextUrl.clone();
  const authToken = request.cookies.get('authToken');
  if (!authToken) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }
  const tokenData = verifyToken(`${authToken}`);
  if (!tokenData) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }
  request.headers.set('X-User-ID', tokenData.userId);
  return NextResponse.next();
}

export const config = {
  matcher: [ '/'], // protected routes
};
// export const config = {
//     matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)', // Match all routes except some specific ones
//   };
