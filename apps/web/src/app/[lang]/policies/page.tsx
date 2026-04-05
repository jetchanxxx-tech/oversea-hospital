export default function PoliciesPage() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0 }}>International Patient Policy</h1>
      <div style={{ color: "#444", lineHeight: 1.6 }}>
        <div style={{ fontWeight: 600 }}>Before you arrive</div>
        <ul>
          <li>Prepare passport information and basic medical records (optional).</li>
          <li>We provide coordination service, not medical diagnosis.</li>
        </ul>
        <div style={{ fontWeight: 600, marginTop: 10 }}>Privacy & consent</div>
        <ul>
          <li>Passport and medical records are sensitive. Please upload only when necessary.</li>
          <li>You can request deletion by contacting our support.</li>
        </ul>
      </div>
    </div>
  );
}

