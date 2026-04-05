"use client";

import { useMemo, useState } from "react";
import { getPublicEnv } from "@/lib/config";
import type { LeadCreateInput } from "@/lib/types";

export default function LeadPage() {
  const { apiBaseUrl } = useMemo(() => getPublicEnv(), []);
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [form, setForm] = useState<LeadCreateInput>({
    name: "",
    email: "",
    passport: "",
    imType: "WhatsApp",
    imHandle: "",
    medicalRecordNote: undefined
  });

  function set<K extends keyof LeadCreateInput>(key: K, value: LeadCreateInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(currentStep: number): string | null {
    const name = form.name.trim();
    const email = form.email.trim();
    const passport = form.passport.trim();
    const imHandle = form.imHandle.trim();

    if (currentStep === 0) {
      if (!name) return "Please enter your full name.";
      if (!email) return "Please enter your email.";
      if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    }
    if (currentStep === 1) {
      if (!passport) return "Please enter your passport number.";
      if (!form.imType) return "Please select an IM type.";
      if (!imHandle) return "Please enter your IM account.";
    }
    return null;
  }

  async function onSubmit() {
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch(new URL("/public/leads", apiBaseUrl), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          passport: form.passport.trim(),
          imHandle: form.imHandle.trim(),
          medicalRecordNote: form.medicalRecordNote?.trim() || undefined
        } satisfies LeadCreateInput)
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }
      setStatus("ok");
      setMessage("Submitted. We will contact you soon.");
      setForm({
        name: "",
        email: "",
        passport: "",
        imType: "WhatsApp",
        imHandle: "",
        medicalRecordNote: undefined
      });
      setStep(0);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Submit failed");
    }
  }

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid" style={{ gap: 8 }}>
        <h1 className="h2" style={{ fontSize: 26 }}>
          Free Medical Assessment
        </h1>
        <div className="muted">Please complete the form. We will contact you via your preferred IM.</div>
      </div>

      <div className="steps" role="list" aria-label="Steps">
        <div className={`step ${step === 0 ? "stepActive" : ""}`} role="listitem">
          1. Contact
        </div>
        <div className={`step ${step === 1 ? "stepActive" : ""}`} role="listitem">
          2. Passport & IM
        </div>
        <div className={`step ${step === 2 ? "stepActive" : ""}`} role="listitem">
          3. Medical note
        </div>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <div className="cardInner">
          {step === 0 ? (
            <div className="grid" style={{ gap: 12 }}>
              <div className="field">
                <div className="label">Full name</div>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Full name"
                  autoComplete="name"
                />
              </div>
              <div className="field">
                <div className="label">Email</div>
                <input
                  className="input"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid" style={{ gap: 12 }}>
              <div className="field">
                <div className="label">Passport number</div>
                <input
                  className="input"
                  value={form.passport}
                  onChange={(e) => set("passport", e.target.value)}
                  placeholder="Passport number"
                />
              </div>
              <div className="grid2">
                <div className="field">
                  <div className="label">IM type</div>
                  <select className="select" value={form.imType} onChange={(e) => set("imType", e.target.value)}>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Messages">Messages</option>
                    <option value="VK">VK</option>
                  </select>
                </div>
                <div className="field">
                  <div className="label">IM account</div>
                  <input
                    className="input"
                    value={form.imHandle}
                    onChange={(e) => set("imHandle", e.target.value)}
                    placeholder="WhatsApp number / Telegram username"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid" style={{ gap: 12 }}>
              <div className="field">
                <div className="label">Medical note (optional)</div>
                <textarea
                  className="textarea"
                  value={form.medicalRecordNote ?? ""}
                  onChange={(e) => set("medicalRecordNote", e.target.value || undefined)}
                  placeholder="Symptoms, diagnosis, preferred department, etc."
                  rows={5}
                />
              </div>
              <div className="notice">
                For MVP, file upload is not enabled yet. If you have imaging/lab reports, mention it in the note and we will
                request them securely.
              </div>
            </div>
          ) : null}

          <div style={{ marginTop: 14, display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn"
              disabled={status === "submitting" || step === 0}
              onClick={() => {
                setMessage("");
                setStatus("idle");
                setStep((s) => Math.max(0, s - 1));
              }}
            >
              Back
            </button>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {step < 2 ? (
                <button
                  type="button"
                  className="btn btnPrimary"
                  disabled={status === "submitting"}
                  onClick={() => {
                    const err = validate(step);
                    if (err) {
                      setStatus("error");
                      setMessage(err);
                      return;
                    }
                    setStatus("idle");
                    setMessage("");
                    setStep((s) => Math.min(2, s + 1));
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btnAccent"
                  disabled={status === "submitting"}
                  onClick={() => {
                    const err = validate(step);
                    if (err) {
                      setStatus("error");
                      setMessage(err);
                      return;
                    }
                    onSubmit();
                  }}
                >
                  {status === "submitting" ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {message ? <div className={`notice ${status === "error" ? "noticeError" : ""}`}>{message}</div> : null}
    </div>
  );
}

