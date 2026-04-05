import { getPublicEnv } from "@/lib/config";
import { httpJson } from "@/lib/http";

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

export default async function AdminLeadsPage() {
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
            Leads
          </h1>
          <div className="muted">Latest 200 submissions.</div>
        </div>
        <a className="btn btnPrimary" href="./export" style={{ marginLeft: "auto" }}>
          Export CSV
        </a>
      </div>

      <div className="card tableWrap">
        <table className="table">
          <thead>
            <tr>
              {["ID", "Name", "Email", "Passport", "IM", "Created"].map((h) => (
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
                  No leads.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

