import { NextResponse, type NextRequest } from 'next/server';

/**
 * Proxy de Next.js 16 para protección perimetral de rutas privadas
 * Responsabilidad: Detección rápida de cookie auth_token y redirección con preservación de ruta
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    // Preservar la ruta a la que intentaba acceder para redirección post-login
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Exportar tanto como default como nombrada para compatibilidad completa con Next.js 16
export default proxy;

export const config = {
  matcher: ['/checkout/:path*', '/orders/:path*'],
};
