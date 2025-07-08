import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ensureLocalizedPathname,
  getLocaleFromPathname,
  getPreferredLocale,
  isPathnameMissingLocale,
} from "@/lib/i18n";

function redirectWithLocale(pathname: string, request: NextRequest) {
  const { search, hash } = request.nextUrl;
  let resolvedPathname = pathname;

  // Add locale if it's missing
  if (isPathnameMissingLocale(pathname)) {
    const preferredLocale = getPreferredLocale(request);
    resolvedPathname = ensureLocalizedPathname(pathname, preferredLocale);
  }

  // Preserve search params and hash
  if (search) resolvedPathname += search;
  if (hash) resolvedPathname += hash;

  const redirectUrl = new URL(resolvedPathname, request.url).toString();
  return NextResponse.redirect(redirectUrl);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocaleFromPathname(pathname);

  // If no locale in the path, redirect to localized version
  if (!locale) {
    return redirectWithLocale(pathname, request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only apply to paths that aren’t static files or API routes
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|docs).*)",
  ],
};
