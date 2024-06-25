import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, sleep, defaultSession, SessionData } from '@/utils/auth';

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    console.log(request.nextUrl.pathname);
    if (session.isLoggedIn !== true) {
        if (request.nextUrl.pathname != '/auth/login') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }
    return response;
}

export const config = {
    matcher: '/((?!api|_next/static|assets|_next/data|_next/image|favicon.ico).*)', // Match all routes except some specific ones
};
