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
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Leads</h1>
        <a href="./export" style={{ marginLeft: "auto" }}>
          Export CSV
        </a>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["ID", "Name", "Email", "Passport", "IM", "Created"].map((h) => (
                <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "8px 6px" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((x) => (
              <tr key={x.id}>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: "8px 6px" }}>{x.id}</td>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: "8px 6px" }}>{x.name}</td>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: "8px 6px" }}>{x.email}</td>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: "8px 6px" }}>{x.passport}</td>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: "8px 6px" }}>
                  {x.imType}: {x.imHandle}
                </td>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: "8px 6px", color: "#666" }}>{x.createdAt}</td>
              </tr>
            ))}
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "10px 6px", color: "#666" }}>
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

