import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const maintenance = request.cookies.get('nusapay_maintenance')?.value;
  if (maintenance === 'on' && !request.nextUrl.pathname.startsWith('/maintenance') && !request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
