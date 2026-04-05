import { getPublicEnv } from "@/lib/config";

export async function GET() {
  const { apiBaseUrl } = getPublicEnv();
  const adminKey = process.env.ADMIN_API_KEY ?? "";
  const url = new URL("/admin/leads?limit=5000", apiBaseUrl);

  const res = await fetch(url, { headers: { "x-admin-key": adminKey } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return new Response(body, { status: res.status });
  }
  const data = (await res.json()) as {
    items: Array<{
      id: number;
      name: string;
      email: string;
      passport: string;
      imType: string;
      imHandle: string;
      createdAt: string;
    }>;
  };

  function esc(v: unknown) {
    const s = String(v ?? "");
    if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, `""`)}"`;
    return s;
  }

  const header = ["编号", "姓名", "邮箱", "护照号", "IM类型", "IM账号", "创建时间"].join(",");
  const lines = [
    header,
    ...data.items.map((x) =>
      [x.id, x.name, x.email, x.passport, x.imType, x.imHandle, x.createdAt].map(esc).join(",")
    )
  ];

  const bom = "\ufeff";
  const body = bom + lines.join("\r\n") + "\r\n";

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=leads.csv"
    }
  });
}

