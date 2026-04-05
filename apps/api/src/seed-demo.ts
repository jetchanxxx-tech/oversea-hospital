import { getPool } from "./db";

async function run() {
  const pool = getPool();
  const items = [
    {
      id: "gy3y",
      name: "The Third Affiliated Hospital of Guangzhou Medical University",
      city: "Guangzhou",
      address: "No. 63 Duobao Rd, Liwan District, Guangzhou",
      summary: "A major tertiary hospital in Guangzhou. Demo data only."
    },
    {
      id: "gztcm-1",
      name: "The First Affiliated Hospital of Guangzhou University of Chinese Medicine",
      city: "Guangzhou",
      address: "No. 16 Jichang Rd, Guangzhou",
      summary: "A leading TCM hospital in Guangzhou. Demo data only."
    },
    {
      id: "gd-mch",
      name: "Guangdong Maternity and Child Health Care Hospital",
      city: "Guangzhou",
      address: "No. 13 Guangyuan West Road, Guangzhou",
      summary: "Maternal and child health hospital. Demo data only."
    }
  ];

  for (const h of items) {
    await pool.query(
      "INSERT INTO hospitals (id, name, city, address, summary) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name), city=VALUES(city), address=VALUES(address), summary=VALUES(summary)",
      [h.id, h.name, h.city, h.address, h.summary]
    );
  }
  await pool.end();
}

run()
  .then(() => process.stdout.write("Seeded demo hospitals\n"))
  .catch((e) => {
    process.stderr.write(String(e?.stack ?? e) + "\n");
    process.exit(1);
  });

