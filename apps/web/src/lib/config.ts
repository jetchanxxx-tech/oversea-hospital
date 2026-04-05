export function getPublicEnv() {
  const cmsBaseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL ?? process.env.CMS_BASE_URL ?? "http://localhost:1337";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? "http://localhost:3001";
  return { cmsBaseUrl, apiBaseUrl };
}

