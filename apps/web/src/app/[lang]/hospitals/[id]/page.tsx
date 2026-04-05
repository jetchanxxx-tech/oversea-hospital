import { getPublicEnv } from "@/lib/config";
import { httpJson } from "@/lib/http";
import type { Hospital } from "@/lib/types";

type HospitalDetailResponse = { item: Hospital | null };

export default async function HospitalDetailPage({
  params
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;
  const { apiBaseUrl } = getPublicEnv();
  const url = new URL(`/public/hospitals/${encodeURIComponent(id)}`, apiBaseUrl);
  const data = await httpJson<HospitalDetailResponse>(url.toString());

  if (!data.item) {
    return (
      <div className="grid" style={{ gap: 12 }}>
        <h1 className="h2" style={{ fontSize: 26 }}>
          Hospital
        </h1>
        <div className="notice">Not found.</div>
        <div>
          <a className="btn" href={`/${encodeURIComponent(lang)}/hospitals`}>
            Back to list
          </a>
        </div>
      </div>
    );
  }

  const h = data.item;
  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid" style={{ gap: 10 }}>
        <div className="badge">{h.city}</div>
        <h1 className="h1" style={{ fontSize: 32 }}>
          {h.name}
        </h1>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="cardInner">
            <div style={{ fontWeight: 950 }}>Overview</div>
            <div className="muted" style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>
              {h.summary || "Demo data only. Detailed introduction will be provided by CMS later."}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="cardInner">
            <div style={{ fontWeight: 950 }}>Address</div>
            <div className="muted" style={{ marginTop: 10 }}>
              {h.address || "To be updated"}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btnAccent" href={`/${encodeURIComponent(lang)}/lead`}>
                Book Free Assessment
              </a>
              <a className="btn" href={`/${encodeURIComponent(lang)}/hospitals`}>
                Back to list
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

