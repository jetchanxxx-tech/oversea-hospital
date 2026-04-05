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
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Hospitals</h1>
      <form style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search hospital name"
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", minWidth: 240 }}
        />
        <select
          name="city"
          defaultValue={city}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
        >
          <option value="">All cities</option>
          <option value="Guangzhou">Guangzhou</option>
          <option value="Shenzhen">Shenzhen</option>
        </select>
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111" }}>
          Search
        </button>
      </form>

      <div style={{ display: "grid", gap: 10 }}>
        {data.items.map((h) => (
          <a
            key={h.id}
            href={`/${l}/hospitals/${encodeURIComponent(h.id)}`}
            style={{
              padding: 14,
              border: "1px solid #eee",
              borderRadius: 12,
              color: "inherit",
              textDecoration: "none"
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
              <div style={{ fontWeight: 700 }}>{h.name}</div>
              <div style={{ color: "#666" }}>{h.city}</div>
            </div>
            {h.summary ? <div style={{ marginTop: 8, color: "#444" }}>{h.summary}</div> : null}
          </a>
        ))}
        {data.items.length === 0 ? <div style={{ color: "#666" }}>No results.</div> : null}
      </div>
    </div>
  );
}

