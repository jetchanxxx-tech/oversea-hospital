import { NextRequest, NextResponse } from "next/server";

const supportedLangs = ["en", "ru", "es", "zh"] as const;
type Lang = (typeof supportedLangs)[number];

function detectLang(req: NextRequest): Lang {
  const accept = req.headers.get("accept-language") ?? "";
  const lower = accept.toLowerCase();
  if (lower.includes("zh")) return "zh";
  if (lower.includes("ru")) return "ru";
  if (lower.includes("es")) return "es";
  return "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const adminMatch = pathname.match(/^\/(en|ru|es)\/admin(\/.*)?$/);
  if (adminMatch) {
    const rest = adminMatch[2] ?? "";
    return NextResponse.redirect(new URL(`/zh/admin${rest}`, req.url));
  }
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const rest = pathname.slice("/admin".length);
    return NextResponse.redirect(new URL(`/zh/admin${rest}`, req.url));
  }

  if (pathname === "/" || pathname === "") {
    const lang = detectLang(req);
    return NextResponse.redirect(new URL(`/${lang}`, req.url));
  }
  const seg = pathname.split("/").filter(Boolean)[0];
  if (!seg) return NextResponse.next();
  if (supportedLangs.includes(seg as Lang)) return NextResponse.next();
  return NextResponse.redirect(new URL(`/en${pathname}`, req.url));
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)"]
};

