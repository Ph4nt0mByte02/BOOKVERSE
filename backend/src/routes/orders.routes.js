import { Router } from "express";
import { memoryStore, isDbConnected } from "../config/db.js";
import { isSupabaseConfigured, supabaseRequest } from "../config/supabase.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const orders = await supabaseRequest("orders?select=*,order_items(*)&order=created_at.desc", {}, req.user.accessToken);
      return res.json({ success: true, count: orders.length, orders });
    } catch (error) {
      return res.status(error.status || 502).json({ success: false, message: error.message });
    }
  }
  res.json({ success: true, count: memoryStore.orders.length, orders: memoryStore.orders });
});

router.post("/", async (req, res) => {
  const { customerName, customerEmail, deliveryMethod, deliveryAddress, totalCOP, items = [] } = req.body;
  const orderNumber = `BV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  if (!customerName || !customerEmail || Number(totalCOP) < 0 || !Array.isArray(items)) {
    return res.status(400).json({ success: false, message: "Datos de pedido inválidos" });
  }

  if (isSupabaseConfigured()) {
    try {
      const [order] = await supabaseRequest("orders", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          order_number: orderNumber,
          customer_name: customerName,
          customer_email: customerEmail,
          delivery_method: deliveryMethod || "shipping",
          delivery_address: deliveryAddress || "",
          total_cop: Number(totalCOP),
          status: "pending"
        })
      });

      const orderItems = items.map((item) => ({
        order_id: order.id,
        book_id: item.bookId || null,
        title: item.title || "Libro",
        format: item.format || "physical",
        quantity: Number(item.quantity || 1),
        unit_price_cop: Number(item.unitPriceCOP || item.priceCOP || 0)
      }));

      if (orderItems.length) {
        await supabaseRequest("order_items", {
          method: "POST",
          body: JSON.stringify(orderItems)
        });
      }
      return res.status(201).json({ success: true, message: "Pedido registrado en Supabase", order });
    } catch (error) {
      return res.status(error.status || 502).json({ success: false, message: error.message });
    }
  }

  const order = {
    id: memoryStore.orders.length + 1,
    orderNumber,
    customerName,
    customerEmail,
    deliveryMethod: deliveryMethod || "shipping",
    deliveryAddress: deliveryAddress || "",
    totalCOP: Number(totalCOP),
    status: "pending",
    items,
    createdAt: new Date().toISOString()
  };
  memoryStore.orders.unshift(order);
  res.status(201).json({ success: true, message: "Pedido registrado localmente", order });
});

router.get("/dashboard", authenticateToken, requireAdmin, async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const [books, orders] = await Promise.all([
        supabaseRequest("books?select=stock"),
        supabaseRequest("orders?select=total_cop")
      ]);
      return res.json({
        success: true,
        stats: {
          totalBooks: books.length,
          totalStock: books.reduce((total, book) => total + Number(book.stock || 0), 0),
          totalOrders: orders.length,
          totalSalesCOP: orders.reduce((total, order) => total + Number(order.total_cop || 0), 0),
          dbStatus: "Supabase conectado"
        }
      });
    } catch (error) {
      return res.status(error.status || 502).json({ success: false, message: error.message });
    }
  }

  res.json({
    success: true,
    stats: {
      totalBooks: memoryStore.books.length,
      totalStock: memoryStore.books.reduce((total, book) => total + Number(book.stock || 0), 0),
      totalOrders: memoryStore.orders.length,
      totalSalesCOP: memoryStore.orders.reduce((total, order) => total + Number(order.totalCOP || 0), 0),
      dbStatus: isDbConnected() ? "PostgreSQL conectado" : "Modo local"
    }
  });
});

export default router;
