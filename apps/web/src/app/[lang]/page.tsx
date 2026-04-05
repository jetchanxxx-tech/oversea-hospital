import { isLang, type Lang } from "@/lib/i18n";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : "en";
  return (
    <div className="grid" style={{ gap: 18 }}>
      <section className="hero">
        <div className="badge">Guangzhou • Shenzhen • International Patients</div>
        <h1 className="h1" style={{ marginTop: 12 }}>
          Medical Services in Guangzhou & Shenzhen
        </h1>
        <p className="lead">
          Explore hospitals and public information. Submit your details to receive a free medical assessment and a treatment
          coordination plan.
        </p>
        <div className="actions">
          <a className="btn btnAccent" href={`/${l}/lead`}>
            Book Free Assessment
          </a>
          <a className="btn" href={`/${l}/hospitals`}>
            Browse Hospitals
          </a>
          <a className="btn" href={`/${l}/policies`}>
            International Patient Policy
          </a>
        </div>
      </section>

      <section className="grid">
        <h2 className="h2">Service Scope</h2>
        <div className="grid3">
          {[
            { title: "Oncology", desc: "CAR-T, radiotherapy, advanced treatments." },
            { title: "IVF", desc: "Fertility support and reproductive medicine." },
            { title: "Dental", desc: "Implants and high-value procedures." }
          ].map((x) => (
            <div key={x.title} className="card">
              <div className="cardInner">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 12,
                      background: "linear-gradient(140deg, rgba(22,119,255,0.18), rgba(17,163,127,0.12))",
                      border: "1px solid rgba(15,23,42,0.10)"
                    }}
                  />
                  <div style={{ fontWeight: 900 }}>{x.title}</div>
                </div>
                <div className="muted" style={{ marginTop: 10 }}>
                  {x.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid">
        <h2 className="h2">Why choose us</h2>
        <div className="grid2">
          {[
            {
              title: "End-to-end coordination",
              desc: "From online pre-assessment to appointment booking, translation, accommodation and transport."
            },
            {
              title: "Privacy-first",
              desc: "You control what you share. Passport and medical records are optional and protected."
            },
            {
              title: "Transparent process",
              desc: "Clear steps: assessment → expert review → plan & quote → deposit → visa invitation."
            },
            {
              title: "Local resources",
              desc: "Partner network in Guangzhou/Shenzhen to support international patient needs."
            }
          ].map((x) => (
            <div key={x.title} className="card">
              <div className="cardInner">
                <div style={{ fontWeight: 900 }}>{x.title}</div>
                <div className="muted" style={{ marginTop: 8 }}>
                  {x.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="cardInner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div className="grid" style={{ gap: 6 }}>
            <div style={{ fontWeight: 950, fontSize: 18 }}>Get a free medical assessment</div>
            <div className="muted">Share basic details and preferred IM contact. We will follow up within 24–48 hours.</div>
          </div>
          <a className="btn btnPrimary" href={`/${l}/lead`}>
            Start now
          </a>
        </div>
      </section>
    </div>
  );
}

