export default function PoliciesPage() {
  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid" style={{ gap: 8 }}>
        <h1 className="h2" style={{ fontSize: 26 }}>
          International Patient Policy
        </h1>
        <div className="muted">Public information for MVP. Detailed policy pages will be managed in CMS later.</div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="cardInner">
            <div style={{ fontWeight: 950 }}>Before you arrive</div>
            <ul className="muted" style={{ margin: "10px 0 0", paddingLeft: 18, lineHeight: 1.8 }}>
              <li>Prepare passport information and basic medical records (optional).</li>
              <li>We provide coordination services and information, not medical diagnosis.</li>
              <li>We may ask for imaging or lab reports to speed up specialist review.</li>
            </ul>
          </div>
        </div>
        <div className="card">
          <div className="cardInner">
            <div style={{ fontWeight: 950 }}>Privacy & consent</div>
            <ul className="muted" style={{ margin: "10px 0 0", paddingLeft: 18, lineHeight: 1.8 }}>
              <li>Passport and medical records are sensitive. Share only what is necessary.</li>
              <li>Your information is used only for assessment and coordination.</li>
              <li>You can request deletion by contacting our support.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="notice">
        If you are in urgent or life-threatening condition, please contact local emergency services immediately.
      </div>
    </div>
  );
}

