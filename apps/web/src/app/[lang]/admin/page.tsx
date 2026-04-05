import { isLang, type Lang } from "@/lib/i18n";

export default async function AdminHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : "en";
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Admin</h1>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>
          <a href={`/${l}/admin/leads`}>Leads</a>
        </li>
        <li>
          <a href={`/${l}/admin/resources`}>Resources</a>
        </li>
      </ul>
    </div>
  );
}

