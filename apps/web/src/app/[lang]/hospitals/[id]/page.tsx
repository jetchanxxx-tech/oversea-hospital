import { getPublicEnv } from "@/lib/config";
import { httpJson } from "@/lib/http";
import type { Hospital } from "@/lib/types";

type HospitalDetailResponse = { item: Hospital | null };

export default async function HospitalDetailPage({
  params
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id } = await params;
  const { apiBaseUrl } = getPublicEnv();
  const url = new URL(`/public/hospitals/${encodeURIComponent(id)}`, apiBaseUrl);
  const data = await httpJson<HospitalDetailResponse>(url.toString());

  if (!data.item) {
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Hospital</h1>
        <div style={{ color: "#666" }}>Not found.</div>
      </div>
    );
  }

  const h = data.item;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0 }}>{h.name}</h1>
      <div style={{ color: "#666" }}>{h.city}</div>
      {h.address ? (
        <div style={{ padding: 14, border: "1px solid #eee", borderRadius: 12 }}>
          <div style={{ fontWeight: 600 }}>Address</div>
          <div style={{ marginTop: 6 }}>{h.address}</div>
        </div>
      ) : null}
      {h.summary ? (
        <div style={{ padding: 14, border: "1px solid #eee", borderRadius: 12 }}>
          <div style={{ fontWeight: 600 }}>Overview</div>
          <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{h.summary}</div>
        </div>
      ) : null}
      <div>
        <a href="../.." style={{ color: "#111" }}>
          Back to list
        </a>
      </div>
    </div>
  );
}

