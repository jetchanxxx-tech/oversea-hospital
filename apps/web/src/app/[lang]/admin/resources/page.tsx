import { getPublicEnv } from "@/lib/config";
import { httpJson } from "@/lib/http";

type Resource = {
  id: number;
  type: string;
  name: string;
  city: string;
  address: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactIm: string | null;
  status: string;
  note: string | null;
};

type ResourceSearchResponse = { items: Resource[] };

export default async function AdminResourcesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const type = sp.type?.trim() ?? "";

  const { apiBaseUrl } = getPublicEnv();
  const adminKey = process.env.ADMIN_API_KEY ?? "";
  const url = new URL("/admin/resources/search", apiBaseUrl);
  if (q) url.searchParams.set("q", q);
  if (type) url.searchParams.set("type", type);
  url.searchParams.set("limit", "100");

  const data = await httpJson<ResourceSearchResponse>(url.toString(), {
    headers: { "x-admin-key": adminKey }
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Resources</h1>
      <form style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <select
          name="type"
          defaultValue={type}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
        >
          <option value="">All types</option>
          <option value="Hotel">Hotel</option>
          <option value="Restaurant">Restaurant</option>
          <option value="TransportAirport">Transport - Airport</option>
          <option value="TransportCityHospital">Transport - City ↔ Hospital</option>
          <option value="HospitalPartner">Hospital Resource</option>
        </select>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name/address/contact"
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", minWidth: 260 }}
        />
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111" }}>
          Search
        </button>
      </form>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["ID", "Type", "Name", "City", "Status", "Contact"].map((h) => (
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
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: "8px 6px" }}>{x.type}</td>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: "8px 6px" }}>{x.name}</td>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: "8px 6px" }}>{x.city}</td>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: "8px 6px" }}>{x.status}</td>
                <td style={{ borderBottom: "1px solid #f3f3f3", padding: "8px 6px", color: "#444" }}>
                  {x.contactName ? `${x.contactName} ` : ""}
                  {x.contactPhone ? `${x.contactPhone} ` : ""}
                  {x.contactIm ? `${x.contactIm}` : ""}
                </td>
              </tr>
            ))}
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "10px 6px", color: "#666" }}>
                  No resources.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

