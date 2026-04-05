import type { ReactNode } from "react";
import { isLang, type Lang } from "@/lib/i18n";
import { getAdminDict } from "@/lib/admin-i18n";

export default async function LangLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : "en";
  const t = getAdminDict(l);
  return (
    <>
      <header className="header">
        <div className="container">
          <nav className="nav">
            <a className="brand" href={`/${l}`}>
              <span className="brandMark" aria-hidden="true" />
              <span>{t.brand}</span>
            </a>
            <div className="navLinks" aria-label="Main navigation">
              <a href={`/${l}/hospitals`}>{t.navHospitals}</a>
              <a href={`/${l}/policies`}>{t.navPolicies}</a>
              <a href={`/${l}/admin`}>{t.navDashboard}</a>
            </div>
            <div className="navRight">
              <div className="langPills" aria-label="Language">
                <a className="pill" href="/en">
                  EN
                </a>
                <a className="pill" href="/ru">
                  RU
                </a>
                <a className="pill" href="/es">
                  ES
                </a>
                <a className="pill" href="/zh">
                  中文
                </a>
              </div>
              <a className="btn btnAccent" href={`/${l}/lead`}>
                {t.navCta}
              </a>
            </div>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footerGrid">
            <div className="grid" style={{ gap: 10 }}>
              <div style={{ fontWeight: 900 }}>{t.disclaimerTitle}</div>
              <div className="muted" style={{ maxWidth: "90ch" }}>
                {t.disclaimerBody}
              </div>
            </div>
            <div className="grid" style={{ gap: 10 }}>
              <div style={{ fontWeight: 900 }}>{t.privacyTitle}</div>
              <div className="muted">{t.privacyBody}</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

