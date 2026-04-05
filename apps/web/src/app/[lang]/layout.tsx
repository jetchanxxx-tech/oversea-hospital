import type { ReactNode } from "react";
import { isLang, type Lang } from "@/lib/i18n";

export default async function LangLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : "en";
  return (
    <>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href={`/${l}`}>Home</a>
          <a href={`/${l}/hospitals`}>Hospitals</a>
          <a href={`/${l}/policies`}>Policies</a>
          <a href={`/${l}/lead`}>Free Assessment</a>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <a href="/en">EN</a>
            <a href="/ru">RU</a>
            <a href="/es">ES</a>
          </div>
        </nav>
      </header>
      <main style={{ padding: 16, maxWidth: 980, margin: "0 auto" }}>{children}</main>
    </>
  );
}

