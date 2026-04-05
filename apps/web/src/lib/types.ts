export type City = "Guangzhou" | "Shenzhen";

export type Hospital = {
  id: string;
  name: string;
  city: City;
  address?: string | null;
  summary?: string | null;
};

export type LeadCreateInput = {
  name: string;
  email: string;
  passport: string;
  imType: string;
  imHandle: string;
  medicalRecordNote?: string;
};

