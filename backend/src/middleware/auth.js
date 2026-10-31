// BOOKVERSE - Middleware de Autenticación JWT y Roles de Administrador
import dotenv from "dotenv";
import { createRemoteJWKSet, jwtVerify } from "jose";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_JWKS_URL = process.env.SUPABASE_JWKS_URL ||
  (SUPABASE_URL ? `${SUPABASE_URL}/auth/v1/.well-known/jwks.json` : null);
const jwks = SUPABASE_JWKS_URL ? createRemoteJWKSet(new URL(SUPABASE_JWKS_URL)) : null;

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || !jwks) {
    return res.status(401).json({ success: false, message: "Token de acceso requerido" });
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: SUPABASE_URL ? `${SUPABASE_URL}/auth/v1` : undefined,
      audience: "authenticated"
    }
    );
    const metadata = payload.app_metadata || {};
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.user_metadata?.name || payload.email,
      role: metadata.role || "user"
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token de Supabase inválido o expirado" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Acceso denegado: se requieren privilegios de administrador" });
  }
  next();
}
