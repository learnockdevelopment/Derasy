import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

import {
  ensureLocalizedPathname,
  getLocaleFromPathname,
  getPreferredLocale,
  isPathnameMissingLocale,
} from "@/lib/i18n"

function redirectWithLocale(pathname: string, request: NextRequest) {
  const { search, hash } = request.nextUrl
  let resolvedPathname = pathname

  // Add locale if it's missing
  if (isPathnameMissingLocale(pathname)) {
    const preferredLocale = getPreferredLocale(request)
    resolvedPathname = ensureLocalizedPathname(pathname, preferredLocale)
  }

  // Preserve search params and hash
  if (search) resolvedPathname += search
  if (hash) resolvedPathname += hash

  const redirectUrl = new URL(resolvedPathname, request.url).toString()
  return NextResponse.redirect(redirectUrl)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ Redirect root path `/` to `/pages/landing`
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/pages/landing", request.url))
  }

  const locale = getLocaleFromPathname(pathname)

  // Redirect if missing locale
  if (!locale) {
    return redirectWithLocale(pathname, request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply to all non-static and non-API routes
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|docs).*)",
  ],
}
