import { Injectable } from "@nestjs/common";
import { getPool } from "../db";
import type { City, Hospital } from "./dto";

@Injectable()
export class HospitalService {
  async list(q?: string, city?: City): Promise<Hospital[]> {
    const pool = getPool();
    const where: string[] = [];
    const params: Array<string> = [];

    if (q && q.trim()) {
      where.push("name LIKE ?");
      params.push(`%${q.trim()}%`);
    }
    if (city) {
      where.push("city = ?");
      params.push(city);
    }

    const sql =
      "SELECT id, name, city, address, summary FROM hospitals" +
      (where.length ? ` WHERE ${where.join(" AND ")}` : "") +
      " ORDER BY name ASC LIMIT 200";

    const [rows] = await pool.query(sql, params);
    return (rows as any[]).map((r) => ({
      id: String(r.id),
      name: String(r.name),
      city: r.city as City,
      address: r.address ?? null,
      summary: r.summary ?? null
    }));
  }

  async getById(id: string): Promise<Hospital | null> {
    const pool = getPool();
    const [rows] = await pool.query("SELECT id, name, city, address, summary FROM hospitals WHERE id = ? LIMIT 1", [id]);
    const r = (rows as any[])[0];
    if (!r) return null;
    return {
      id: String(r.id),
      name: String(r.name),
      city: r.city as City,
      address: r.address ?? null,
      summary: r.summary ?? null
    };
  }
}

