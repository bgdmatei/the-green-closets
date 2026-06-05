import { NextRequest, NextResponse } from "next/server"

const defaultLocale = "en"
const locales = ["en"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /en/... to /...
  if (pathname.startsWith(`/${defaultLocale}`)) {
    request.nextUrl.pathname = pathname.replace(`/${defaultLocale}`, "") || "/"
    return NextResponse.redirect(request.nextUrl)
  }

  // For paths without a locale, rewrite internally to /en/...
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.rewrite(request.nextUrl)
  }
}

export const config = {
  matcher: [
    "/((?!_next|_static|favicon.ico|images|icons|.*\\..*).*)",
  ],
}