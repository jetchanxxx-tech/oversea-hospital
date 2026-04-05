import { isLang, type Lang } from "@/lib/i18n";
import { getAdminDict } from "@/lib/admin-i18n";

export default async function AdminHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : "en";
  const t = getAdminDict(l);
  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid" style={{ gap: 8 }}>
        <h1 className="h2" style={{ fontSize: 26 }}>
          {t.adminTitle}
        </h1>
        <div className="muted">{t.adminSubtitle}</div>
      </div>

      <div className="grid2">
        <a className="card" href={`/${l}/admin/leads`}>
          <div className="cardInner">
            <div style={{ fontWeight: 950 }}>{t.leadsTitle}</div>
            <div className="muted" style={{ marginTop: 8 }}>
              {t.leadsSubtitle}
            </div>
            <div style={{ marginTop: 12, fontWeight: 900, color: "var(--primary)" }}>Open →</div>
          </div>
        </a>
        <a className="card" href={`/${l}/admin/resources`}>
          <div className="cardInner">
            <div style={{ fontWeight: 950 }}>{t.resourcesTitle}</div>
            <div className="muted" style={{ marginTop: 8 }}>
              {t.resourcesSubtitle}
            </div>
            <div style={{ marginTop: 12, fontWeight: 900, color: "var(--primary)" }}>Open →</div>
          </div>
        </a>
      </div>
    </div>
  );
}

