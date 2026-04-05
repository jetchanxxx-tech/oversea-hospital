import { getPublicEnv } from "@/lib/config";
import { httpJson } from "@/lib/http";
import type { Hospital } from "@/lib/types";
import { isLang, type Lang } from "@/lib/i18n";

type HospitalListResponse = { items: Hospital[] };

export default async function HospitalsPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; city?: string }>;
}) {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : "en";
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const city = sp.city?.trim() ?? "";

  const { apiBaseUrl } = getPublicEnv();
  const url = new URL("/public/hospitals", apiBaseUrl);
  if (q) url.searchParams.set("q", q);
  if (city) url.searchParams.set("city", city);

  const data = await httpJson<HospitalListResponse>(url.toString());

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid" style={{ gap: 8 }}>
        <h1 className="h2" style={{ fontSize: 26 }}>
          Hospitals
        </h1>
        <div className="muted">Search hospitals in Guangzhou / Shenzhen. Demo data for MVP.</div>
      </div>

      <form className="card">
        <div className="cardInner" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "end" }}>
          <div className="field" style={{ flex: 2, minWidth: 220 }}>
            <div className="label">Keyword</div>
            <input name="q" defaultValue={q} placeholder="Search hospital name" className="input" />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 180 }}>
            <div className="label">City</div>
            <select name="city" defaultValue={city} className="select">
              <option value="">All cities</option>
              <option value="Guangzhou">Guangzhou</option>
              <option value="Shenzhen">Shenzhen</option>
            </select>
          </div>
          <button type="submit" className="btn btnPrimary" style={{ minWidth: 140 }}>
            Search
          </button>
        </div>
      </form>

      <div className="grid" style={{ gap: 12 }}>
        {data.items.map((h) => (
          <a key={h.id} href={`/${l}/hospitals/${encodeURIComponent(h.id)}`} className="card">
            <div className="cardInner">
              <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                <div style={{ fontWeight: 950 }}>{h.name}</div>
                <div className="badge">{h.city}</div>
              </div>
              {h.summary ? (
                <div className="muted" style={{ marginTop: 10 }}>
                  {h.summary}
                </div>
              ) : null}
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div className="muted" style={{ fontSize: 13 }}>
                  View details
                </div>
                <div style={{ fontWeight: 900, color: "var(--primary)" }}>Open →</div>
              </div>
            </div>
          </a>
        ))}
        {data.items.length === 0 ? <div className="notice">No results.</div> : null}
      </div>
    </div>
  );
}

