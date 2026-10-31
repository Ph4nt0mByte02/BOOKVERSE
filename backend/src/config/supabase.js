import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn("Supabase no está configurado: faltan SUPABASE_URL o SUPABASE_PUBLISHABLE_KEY.");
}

function headers(accessToken) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY || "",
    Authorization: `Bearer ${accessToken || SUPABASE_PUBLISHABLE_KEY || ""}`,
    "Content-Type": "application/json"
  };
}

export function isSupabaseConfigured() {
  return process.env.NODE_ENV !== "test" && Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}

export async function supabaseRequest(resource, options = {}, accessToken) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no está configurado en el backend");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${resource}`, {
    ...options,
    headers: { ...headers(accessToken), ...(options.headers || {}) }
  });

  const body = await response.text();
  let data = null;
  try {
    data = body ? JSON.parse(body) : null;
  } catch {
    data = body;
  }

  if (!response.ok) {
    const message = data?.message || data?.hint || data?.details || "Error de Supabase";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export function isSupabaseConnected() {
  return isSupabaseConfigured();
}
