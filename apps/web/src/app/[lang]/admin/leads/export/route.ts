import { getPublicEnv } from "@/lib/config";

export async function GET() {
  const { apiBaseUrl } = getPublicEnv();
  const adminKey = process.env.ADMIN_API_KEY ?? "";
  const url = new URL("/admin/leads/export?limit=5000", apiBaseUrl);
  const res = await fetch(url, {
    headers: { "x-admin-key": adminKey }
  });
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=leads.csv"
    }
  });
}

