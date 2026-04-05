import { isLang, type Lang } from "@/lib/i18n";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : "en";
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <section style={{ padding: 18, border: "1px solid #eee", borderRadius: 12 }}>
        <h1 style={{ marginTop: 0 }}>Medical Services in Guangzhou & Shenzhen</h1>
        <p style={{ marginBottom: 0 }}>
          Explore hospitals, departments and policies for international patients. Submit your information to receive a free
          medical assessment.
        </p>
        <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href={`/${l}/lead`} style={{ padding: "10px 14px", border: "1px solid #111", borderRadius: 10 }}>
            Book Free Assessment
          </a>
          <a href={`/${l}/hospitals`} style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 10 }}>
            Browse Hospitals
          </a>
        </div>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Service Scope</h2>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {[
            { title: "Oncology", desc: "CAR-T, radiotherapy, advanced treatments." },
            { title: "IVF", desc: "Fertility support and reproductive medicine." },
            { title: "Dental", desc: "Implants and high-value procedures." },
            { title: "TCM", desc: "Acupuncture and wellness programs." }
          ].map((x) => (
            <div key={x.title} style={{ padding: 14, border: "1px solid #eee", borderRadius: 12 }}>
              <div style={{ fontWeight: 600 }}>{x.title}</div>
              <div style={{ marginTop: 6, color: "#444" }}>{x.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

