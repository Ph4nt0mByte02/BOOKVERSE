// BOOKVERSE - Rutas de Autenticación de Administradores
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// GET /api/auth/me
router.get("/me", authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
