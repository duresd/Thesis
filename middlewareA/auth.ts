// import { NextResponse } from 'next/server';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { NextRequest } from 'next/server';
// import { verifyToken } from '@/utils/auth';
// export { default } from "next-auth/middleware"
// export async  function middleware(request: NextRequest ) {
//   const url = request.nextUrl.clone();
//   const authToken = request.cookies.get('authToken');
//   console.log("run");
//   if (!authToken) {
//     url.pathname = '/auth/login';
//     return NextResponse.redirect(url);
//   }
//   const tokenData = verifyToken(`${authToken}`);
//   if (!tokenData) {
//     url.pathname = '/auth/login';
//     return NextResponse.redirect(url);
//   }
//   request.headers.set('X-User-ID', tokenData.userId);
//   return NextResponse.next();
// }

// export const config = {
// //   matcher: [ '/'], // protected routes
//     matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)', // Match all routes except some specific ones
// };
// // export const config = {
// //   };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    console.log('asdsadsa');
    return NextResponse.redirect(new URL('/home', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/',
};
