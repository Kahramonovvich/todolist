import { NextResponse } from 'next/server'

export async function middleware(req) {
    const token = req.cookies.get('firebase_token')?.value;
    const userStatus = req.cookies.get('user_status')?.value;

    const isLoggedIn = !!token;

    const url = req.nextUrl;

    const protectedRoutes = [
        '/dashboard',
        '/inbox',
        '/settings',
        '/designs',
        '/projects',
        '/users',
        '/unverified',
        '/wait',
    ];

    const unverifiedRoutes = [
        '/dashboard',
        '/inbox',
        '/settings',
        '/designs',
        '/projects',
        '/users',
        '/unverified',
        '/'
    ];

    const isLoginedRoutes = [
        '/',
        '/wait',
    ];

    if (protectedRoutes.includes(url.pathname) && !isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.url));
    };

    if (isLoginedRoutes.includes(url.pathname) && isLoggedIn && userStatus === 'verified') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    };

    if (unverifiedRoutes.includes(url.pathname) && userStatus === 'unverified') {
        return NextResponse.redirect(new URL('/wait', req.url));
    };

    return NextResponse.next();
};

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/inbox/:path*',
        '/settings/:path*',
        '/designs/:path*',
        '/projects/:path*',
        '/users/:path*',
        '/unverified/:path*',
        '/wait/:path*',
        '/',
    ],
};