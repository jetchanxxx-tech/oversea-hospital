import { BadRequestException, Injectable } from "@nestjs/common";
import { getPool } from "../db";

export type ResourceType = "Hotel" | "Restaurant" | "TransportAirport" | "TransportCityHospital" | "HospitalPartner";
export type ResourceCity = "Guangzhou" | "Shenzhen";
export type ResourceStatus = "Negotiating" | "Active" | "Paused";

export type Resource = {
  id: number;
  type: ResourceType;
  name: string;
  city: ResourceCity;
  address: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactIm: string | null;
  status: ResourceStatus;
  note: string | null;
};

export type ResourceCreateInput = Omit<Resource, "id">;

@Injectable()
export class ResourceService {
  async search(type: string | undefined, q: string | undefined, limit: number) {
    const pool = getPool();
    const where: string[] = [];
    const params: any[] = [];

    if (type) {
      where.push("type = ?");
      params.push(type);
    }
    if (q && q.trim()) {
      where.push("(name LIKE ? OR address LIKE ? OR contact_name LIKE ?)");
      const v = `%${q.trim()}%`;
      params.push(v, v, v);
    }
    params.push(limit);

    const sql =
      "SELECT id, type, name, city, address, contact_name, contact_phone, contact_im, status, note FROM resources" +
      (where.length ? ` WHERE ${where.join(" AND ")}` : "") +
      " ORDER BY id DESC LIMIT ?";

    const [rows] = await pool.query(sql, params);
    return (rows as any[]).map((r) => this.mapRow(r));
  }

  async create(input: ResourceCreateInput) {
    if (!input.name.trim()) throw new BadRequestException("name required");
    const pool = getPool();
    const [result] = await pool.query(
      "INSERT INTO resources (type, name, city, address, contact_name, contact_phone, contact_im, status, note) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        input.type,
        input.name,
        input.city,
        input.address ?? null,
        input.contactName ?? null,
        input.contactPhone ?? null,
        input.contactIm ?? null,
        input.status ?? "Negotiating",
        input.note ?? null
      ]
    );
    return { id: Number((result as any).insertId) };
  }

  private mapRow(r: any): Resource {
    return {
      id: Number(r.id),
      type: r.type as ResourceType,
      name: String(r.name),
      city: r.city as ResourceCity,
      address: r.address ?? null,
      contactName: r.contact_name ?? null,
      contactPhone: r.contact_phone ?? null,
      contactIm: r.contact_im ?? null,
      status: r.status as ResourceStatus,
      note: r.note ?? null
    };
  }
}

