import { Injectable } from "@nestjs/common";
import { getPool } from "../db";

export type LeadRow = {
  id: number;
  name: string;
  email: string;
  passport: string;
  imType: string;
  imHandle: string;
  createdAt: string;
};

@Injectable()
export class LeadAdminService {
  async list(limit: number) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, name, email, passport, im_type, im_handle, created_at FROM leads ORDER BY id DESC LIMIT ?",
      [limit]
    );
    return (rows as any[]).map((r) => ({
      id: Number(r.id),
      name: String(r.name),
      email: String(r.email),
      passport: String(r.passport),
      imType: String(r.im_type),
      imHandle: String(r.im_handle),
      createdAt: new Date(r.created_at).toISOString()
    })) as LeadRow[];
  }

  toCsv(items: LeadRow[]) {
    const headers = ["id", "name", "email", "passport", "imType", "imHandle", "createdAt"];
    const esc = (v: unknown) => {
      const s = String(v ?? "");
      if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const lines = [headers.join(",")].concat(items.map((x) => headers.map((h) => esc((x as any)[h])).join(",")));
    return lines.join("\n");
  }
}

