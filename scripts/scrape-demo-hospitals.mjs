import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const sourcesPath = path.resolve(repoRoot, "seed", "demo-hospitals.sources.json");
const outPath = path.resolve(repoRoot, "seed", "demo-hospitals.scraped.json");

const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf-8"));

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickFirstMatch(text, patterns) {
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

async function fetchPage(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; MVP-demo-scraper/1.0)",
      accept: "text/html,application/xhtml+xml",
    },
  });
  const html = await res.text();
  return { status: res.status, finalUrl: res.url, html };
}

const results = [];

for (const item of sources) {
  const pages = [];
  for (const url of item.urls ?? []) {
    try {
      const { status, finalUrl, html } = await fetchPage(url);
      const title = pickFirstMatch(html, [/<title[^>]*>([^<]+)<\/title>/i]);
      const metaDescription = pickFirstMatch(html, [
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i,
      ]);
      const text = stripHtml(html).slice(0, 4000);
      pages.push({ url, status, finalUrl, title, metaDescription, textSample: text });
    } catch (e) {
      pages.push({ url, error: String(e?.message ?? e) });
    }
  }
  results.push({
    name: item.name,
    city: item.city,
    languageHint: item.languageHint,
    pages,
    fetchedAt: new Date().toISOString(),
  });
}

fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf-8");
process.stdout.write(`Wrote ${outPath}\n`);

