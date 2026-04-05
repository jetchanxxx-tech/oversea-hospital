export const supportedLangs = ["en", "ru", "es", "zh"] as const;
export type Lang = (typeof supportedLangs)[number];

export function isLang(value: string): value is Lang {
  return (supportedLangs as readonly string[]).includes(value);
}

