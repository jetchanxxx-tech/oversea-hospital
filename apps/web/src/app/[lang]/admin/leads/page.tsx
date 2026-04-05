import { getPublicEnv } from "@/lib/config";
import { httpJson } from "@/lib/http";
import { isLang, type Lang } from "@/lib/i18n";
import { getAdminDict } from "@/lib/admin-i18n";

type LeadRow = {
  id: number;
  name: string;
  email: string;
  passport: string;
  imType: string;
  imHandle: string;
  createdAt: string;
};

type LeadListResponse = { items: LeadRow[] };

export default async function AdminLeadsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : "en";
  const t = getAdminDict(l);
  const { apiBaseUrl } = getPublicEnv();
  const adminKey = process.env.ADMIN_API_KEY ?? "";
  const url = new URL("/admin/leads?limit=200", apiBaseUrl);

  const data = await httpJson<LeadListResponse>(url.toString(), {
    headers: { "x-admin-key": adminKey }
  });

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div className="grid" style={{ gap: 4 }}>
          <h1 className="h2" style={{ fontSize: 26 }}>
            {t.leadsTitle}
          </h1>
          <div className="muted">{t.leadsSubtitle}</div>
        </div>
        <a className="btn btnPrimary" href={`/${l}/admin/leads/export`} style={{ marginLeft: "auto" }}>
          {t.leadsExport}
        </a>
      </div>

      <div className="card tableWrap">
        <table className="table">
          <thead>
            <tr>
              {[t.tableId, t.tableName, t.tableEmail, t.tablePassport, t.tableIm, t.tableCreated].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((x) => (
              <tr key={x.id}>
                <td>{x.id}</td>
                <td style={{ fontWeight: 900 }}>{x.name}</td>
                <td>{x.email}</td>
                <td>{x.passport}</td>
                <td>
                  <span className="badge">{x.imType}</span> <span>{x.imHandle}</span>
                </td>
                <td className="muted">{x.createdAt}</td>
              </tr>
            ))}
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted">
                  {l === "zh" ? "暂无留资" : "No leads."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

