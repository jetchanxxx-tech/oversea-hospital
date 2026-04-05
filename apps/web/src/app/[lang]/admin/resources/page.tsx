import { getPublicEnv } from "@/lib/config";
import { httpJson } from "@/lib/http";
import { isLang, type Lang } from "@/lib/i18n";
import { getAdminDict } from "@/lib/admin-i18n";

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
  params,
  searchParams
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : "en";
  const t = getAdminDict(l);
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
    <div className="grid" style={{ gap: 12 }}>
      <div className="grid" style={{ gap: 6 }}>
        <h1 className="h2" style={{ fontSize: 26 }}>
          {t.resourcesTitle}
        </h1>
        <div className="muted">{t.resourcesSubtitle}</div>
      </div>

      <form className="card">
        <div className="cardInner" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "end" }}>
          <div className="field" style={{ minWidth: 240 }}>
            <div className="label">{t.resourcesType}</div>
            <select name="type" defaultValue={type} className="select">
              <option value="">{l === "zh" ? "全部类型" : "All types"}</option>
              <option value="Hotel">Hotel</option>
              <option value="Restaurant">Restaurant</option>
              <option value="TransportAirport">Transport - Airport</option>
              <option value="TransportCityHospital">Transport - City ↔ Hospital</option>
              <option value="HospitalPartner">Hospital Resource</option>
            </select>
          </div>
          <div className="field" style={{ flex: 1, minWidth: 260 }}>
            <div className="label">{t.resourcesKeyword}</div>
            <input
              name="q"
              defaultValue={q}
              placeholder={l === "zh" ? "按名称/地址/联系人搜索" : "Search by name/address/contact"}
              className="input"
            />
          </div>
          <button type="submit" className="btn btnPrimary" style={{ minWidth: 140 }}>
            {t.search}
          </button>
        </div>
      </form>

      <div className="card tableWrap">
        <table className="table">
          <thead>
            <tr>
              {[t.tableId, t.tableType, t.tableName, t.tableCity, t.tableStatus, t.tableContact].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((x) => (
              <tr key={x.id}>
                <td>{x.id}</td>
                <td>
                  <span className="badge">{x.type}</span>
                </td>
                <td style={{ fontWeight: 900 }}>{x.name}</td>
                <td>{x.city}</td>
                <td>
                  <span className="badge">{x.status}</span>
                </td>
                <td className="muted">
                  {x.contactName ? `${x.contactName} ` : ""}
                  {x.contactPhone ? `${x.contactPhone} ` : ""}
                  {x.contactIm ? `${x.contactIm}` : ""}
                </td>
              </tr>
            ))}
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted">
                  {t.noResources}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

