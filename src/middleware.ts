// climbup-app/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // accessToken'ı cookie'den okumaya çalış.
  // Bu cookie'nin AuthContext tarafından login/logout sırasında ayarlanıp silindiği varsayılmaktadır.
  const accessToken = request.cookies.get("accessToken")?.value;

  const homePath = "/home";
  const landingPath = "/"; // Landing page ana yolda
  const loginPath = "/login";
  const registerPath = "/register";
  const appProtectedPaths = [homePath, "/profile", "/plan", "/leaderboard"]; // Diğer korunmuş uygulama yolları buraya eklenebilir

  // 1. Kullanıcı giriş yapmışsa (accessToken var):
  if (accessToken) {
    // Eğer login veya register sayfasındaysa ve redirect parametresi varsa oraya yönlendir
    if (pathname === loginPath || pathname === registerPath) {
      const redirectTo = request.nextUrl.searchParams.get("redirect");
      if (
        redirectTo &&
        appProtectedPaths.some((path) => redirectTo.startsWith(path))
      ) {
        return NextResponse.redirect(new URL(redirectTo, request.url));
      }
      // Redirect parametresi yoksa /home'a yönlendir
      return NextResponse.redirect(new URL(homePath, request.url));
    }
    // Eğer ana landing sayfasına ("/") gitmeye çalışıyorsa, /home'a yönlendir.
    if (pathname === landingPath) {
      return NextResponse.redirect(new URL(homePath, request.url));
    }
  }
  // 2. Kullanıcı giriş yapmamışsa (accessToken yok):
  else {
    // Eğer korunmuş bir uygulama yoluna gitmeye çalışıyorsa, /login'e yönlendir ve current path'i redirect parametresi olarak ekle.
    if (appProtectedPaths.some((path) => pathname.startsWith(path))) {
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Diğer tüm durumlar için isteğe devam et (örneğin, /login, /register veya landing page "/" kendisi)
  return NextResponse.next();
}

// Middleware'in hangi yollarda çalışacağını belirtin
export const config = {
  matcher: [
    "/", // Ana sayfa (landing)
    "/home/:path*",
    "/profile/:path*",
    "/plan/:path*",
    "/leaderboard/:path*",
    "/login",
    "/register",
    // Not: API yollarını ('/api/:path*') buraya eklemeyin,
    // middleware'in API isteklerini etkilemesini istemeyiz.
  ],
};
