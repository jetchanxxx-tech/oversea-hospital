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
      <header className="header">
        <div className="container">
          <nav className="nav">
            <a className="brand" href={`/${l}`}>
              <span className="brandMark" aria-hidden="true" />
              <span>Oversea Medical</span>
            </a>
            <div className="navLinks" aria-label="Main navigation">
              <a href={`/${l}/hospitals`}>Hospitals</a>
              <a href={`/${l}/policies`}>Policies</a>
              <a href={`/${l}/admin`}>Dashboard</a>
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
              </div>
              <a className="btn btnAccent" href={`/${l}/lead`}>
                Book Free Assessment
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
              <div style={{ fontWeight: 900 }}>Disclaimer</div>
              <div className="muted" style={{ maxWidth: "90ch" }}>
                We provide medical coordination services and information for international patients. We are not a medical
                institution and do not provide medical diagnosis. Final medical decisions are made by licensed hospitals and
                doctors.
              </div>
            </div>
            <div className="grid" style={{ gap: 10 }}>
              <div style={{ fontWeight: 900 }}>Privacy</div>
              <div className="muted">
                Please share passport and medical records only when necessary. You can request data deletion by contacting our
                support.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

