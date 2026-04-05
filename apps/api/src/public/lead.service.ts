import { Injectable, BadRequestException } from "@nestjs/common";
import { getPool } from "../db";
import type { LeadCreateInput } from "./dto";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

@Injectable()
export class LeadService {
  async create(input: LeadCreateInput) {
    const name = String(input.name ?? "").trim();
    const email = normalizeEmail(String(input.email ?? ""));
    const passport = String(input.passport ?? "").trim();
    const imType = String(input.imType ?? "").trim();
    const imHandle = String(input.imHandle ?? "").trim();
    const medicalRecordNote = input.medicalRecordNote ? String(input.medicalRecordNote).trim() : null;

    if (!name || !email || !passport || !imType || !imHandle) {
      throw new BadRequestException("Missing required fields");
    }
    if (!email.includes("@")) {
      throw new BadRequestException("Invalid email");
    }

    const pool = getPool();
    const [result] = await pool.query(
      "INSERT INTO leads (name, email, passport, im_type, im_handle, medical_record_note) VALUES (?,?,?,?,?,?)",
      [name, email, passport, imType, imHandle, medicalRecordNote]
    );

    const insertId = (result as any).insertId;
    return { id: Number(insertId) };
  }
}

