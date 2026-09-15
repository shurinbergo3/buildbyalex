import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

// The default locale lives without a prefix. next-intl answers /ru/... with a
// 307, and Google keeps temporary redirects' sources indexed: the /ru/ copies
// were splitting impressions with the real URLs. A 308 tells it to merge them.
const DEFAULT_PREFIX = `/${routing.defaultLocale}`;

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === DEFAULT_PREFIX || pathname.startsWith(`${DEFAULT_PREFIX}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_PREFIX.length) || "/";
    return NextResponse.redirect(url, 308);
  }
  return handleI18n(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
