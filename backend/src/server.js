// BOOKVERSE - Servidor Express Principal
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import booksRoutes from "./routes/books.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import { testConnection, isDbConnected } from "./config/db.js";
import { isSupabaseConfigured } from "./config/supabase.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Middlewares
app.use(helmet({ contentSecurityPolicy: false })); // Permite cargar recursos y fuentes en modo local/desarrollo
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/orders", ordersRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "BOOKVERSE API & Admin Engine",
    timestamp: new Date().toISOString(),
    database: isSupabaseConfigured()
      ? "Supabase REST connected"
      : (isDbConnected() ? "PostgreSQL Docker Connected" : "In-Memory Resilient Store"),
    version: "1.0.0"
  });
});

// Consola de Administración (Ruta /consola)
app.use("/consola/assets", express.static(path.join(rootDir, "assets")));
app.use("/consola", express.static(path.join(__dirname, "views/consola")));
app.get("/consola", (req, res) => {
  res.sendFile(path.join(__dirname, "views/consola/index.html"));
});

// Servir frontend completo desde la raíz del proyecto
app.use(express.static(rootDir));

// Fallback para cualquier otra ruta
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "Ruta API no encontrada" });
  }
  next();
});

// Iniciar Servidor y Probar Base de Datos
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 BOOKVERSE Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📚 Tienda Principal:  http://localhost:${PORT}/index.html`);
  console.log(`🛡️ Consola Admin:     http://localhost:${PORT}/consola`);
  console.log(`🩺 Health API:        http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);

    await testConnection();
  });
}

export default app;
