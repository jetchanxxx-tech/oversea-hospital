"use client";

import { useMemo, useState } from "react";
import { getPublicEnv } from "@/lib/config";
import type { LeadCreateInput } from "@/lib/types";

export default function LeadPage() {
  const { apiBaseUrl } = useMemo(() => getPublicEnv(), []);
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    const fd = new FormData(e.currentTarget);
    const payload: LeadCreateInput = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      passport: String(fd.get("passport") ?? "").trim(),
      imType: String(fd.get("imType") ?? "").trim(),
      imHandle: String(fd.get("imHandle") ?? "").trim(),
      medicalRecordNote: String(fd.get("medicalRecordNote") ?? "").trim() || undefined
    };

    try {
      const res = await fetch(new URL("/public/leads", apiBaseUrl), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }
      setStatus("ok");
      setMessage("Submitted. We will contact you soon.");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Submit failed");
    }
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0 }}>Free Medical Assessment</h1>
      <div style={{ color: "#666" }}>
        Submit your information. Passport and medical records are optional but help speed up the assessment.
      </div>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <input
          name="name"
          required
          placeholder="Full name"
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
        />
        <input
          name="passport"
          required
          placeholder="Passport number"
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <select
            name="imType"
            required
            defaultValue="WhatsApp"
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", flex: 1 }}
          >
            <option value="WhatsApp">WhatsApp</option>
            <option value="Telegram">Telegram</option>
            <option value="Messages">Messages</option>
            <option value="VK">VK</option>
          </select>
          <input
            name="imHandle"
            required
            placeholder="IM account"
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", flex: 2 }}
          />
        </div>
        <textarea
          name="medicalRecordNote"
          placeholder="Medical records note (optional)"
          rows={4}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111" }}
        >
          {status === "submitting" ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message ? (
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12, color: status === "error" ? "#b00" : "#111" }}>
          {message}
        </div>
      ) : null}
    </div>
  );
}

