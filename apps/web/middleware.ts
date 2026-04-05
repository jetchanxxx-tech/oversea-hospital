import { NextRequest, NextResponse } from "next/server";

const supportedLangs = ["en", "ru", "es"] as const;
type Lang = (typeof supportedLangs)[number];

function detectLang(req: NextRequest): Lang {
  const accept = req.headers.get("accept-language") ?? "";
  const lower = accept.toLowerCase();
  if (lower.includes("ru")) return "ru";
  if (lower.includes("es")) return "es";
  return "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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

