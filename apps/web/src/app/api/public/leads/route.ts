import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:3001";
  const url = new URL("/public/leads", apiBaseUrl);

  let payload: unknown = null;
  try {
    payload = await req.json();
  } catch {
    payload = null;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const text = await res.text().catch(() => "");
    return new NextResponse(text, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") ?? "text/plain; charset=utf-8" }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

