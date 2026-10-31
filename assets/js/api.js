// Set window.BOOKVERSE_API_URL in the deployment when the API is hosted separately.
const configuredApiUrl = typeof window !== "undefined" ? window.BOOKVERSE_API_URL : "";
const API_BASE_URL = (configuredApiUrl || "").replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}
