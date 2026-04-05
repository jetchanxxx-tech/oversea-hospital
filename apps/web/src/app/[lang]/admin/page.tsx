import { isLang, type Lang } from "@/lib/i18n";

export default async function AdminHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : "en";
  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid" style={{ gap: 8 }}>
        <h1 className="h2" style={{ fontSize: 26 }}>
          Dashboard
        </h1>
        <div className="muted">Internal use only. Admin API key is required for data access.</div>
      </div>

      <div className="grid2">
        <a className="card" href={`/${l}/admin/leads`}>
          <div className="cardInner">
            <div style={{ fontWeight: 950 }}>Leads</div>
            <div className="muted" style={{ marginTop: 8 }}>
              View visitor submissions and export CSV.
            </div>
            <div style={{ marginTop: 12, fontWeight: 900, color: "var(--primary)" }}>Open →</div>
          </div>
        </a>
        <a className="card" href={`/${l}/admin/resources`}>
          <div className="cardInner">
            <div style={{ fontWeight: 950 }}>Resources</div>
            <div className="muted" style={{ marginTop: 8 }}>
              Search internal partner resources (hotel, restaurant, transport).
            </div>
            <div style={{ marginTop: 12, fontWeight: 900, color: "var(--primary)" }}>Open →</div>
          </div>
        </a>
      </div>
    </div>
  );
}

