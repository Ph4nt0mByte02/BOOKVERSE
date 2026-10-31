// Override with window.BOOKVERSE_API_URL when deploying another API instance.
const configuredApiUrl = typeof window !== "undefined" ? window.BOOKVERSE_API_URL : "";
const defaultApiUrl = "https://bookverse-mauve.vercel.app";
const API_BASE_URL = (configuredApiUrl || defaultApiUrl).replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}
