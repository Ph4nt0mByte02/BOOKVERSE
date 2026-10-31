// BOOKVERSE - Rutas de Pedidos y Estadísticas
import { Router } from "express";
import { getDbPool, isDbConnected, memoryStore } from "../config/db.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/orders (Admin)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  if (isDbConnected()) {
    try {
      const pool = getDbPool();
      const dbRes = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
      return res.json({ success: true, count: dbRes.rows.length, orders: dbRes.rows });
    } catch (e) {
      console.warn("DB orders fallback:", e.message);
    }
  }
  res.json({ success: true, count: memoryStore.orders.length, orders: memoryStore.orders });
});

// POST /api/orders (Crear pedido desde Checkout)
router.post("/", async (req, res) => {
  const { customerName, customerEmail, deliveryMethod, deliveryAddress, totalCOP, items } = req.body;

  const orderNumber = `BV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const newOrder = {
    id: memoryStore.orders.length + 1,
    orderNumber,
    customerName: customerName || "Lector Anónimo",
    customerEmail: customerEmail || "cliente@ejemplo.com",
    deliveryMethod: deliveryMethod || "shipping",
    deliveryAddress: deliveryAddress || "",
    totalCOP: Number(totalCOP) || 0,
    status: "completado",
    items: items || [],
    createdAt: new Date().toISOString()
  };

  memoryStore.orders.unshift(newOrder);

  if (isDbConnected()) {
    try {
      const pool = getDbPool();
      await pool.query(
        `INSERT INTO orders (order_number, customer_name, customer_email, delivery_method, delivery_address, total_cop, status, items_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [newOrder.orderNumber, newOrder.customerName, newOrder.customerEmail, newOrder.deliveryMethod, newOrder.deliveryAddress, newOrder.totalCOP, newOrder.status, JSON.stringify(newOrder.items)]
      );
    } catch (e) {
      console.warn("DB order save fallback:", e.message);
    }
  }

  res.status(201).json({ success: true, message: "Pedido registrado exitosamente", order: newOrder });
});

// GET /api/stats (Admin Dashboard Metrics)
router.get("/dashboard", authenticateToken, requireAdmin, (req, res) => {
  const totalBooks = memoryStore.books.length;
  const totalStock = memoryStore.books.reduce((acc, b) => acc + (b.stock || 0), 0);
  const totalOrders = memoryStore.orders.length;
  const totalSalesCOP = memoryStore.orders.reduce((acc, o) => acc + (o.totalCOP || 0), 0);

  res.json({
    success: true,
    stats: {
      totalBooks,
      totalStock,
      totalOrders,
      totalSalesCOP,
      dbStatus: isDbConnected() ? "PostgreSQL Docker Activo" : "Memoria Resiliente / Conexión en Espera"
    }
  });
});

export default router;
