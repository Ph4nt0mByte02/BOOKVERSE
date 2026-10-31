// BOOKVERSE - Rutas CRUD del Catálogo de Libros con Persistencia Real
import { Router } from "express";
import { getDbPool, isDbConnected, memoryStore, persistBooks } from "../config/db.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/books (Público)
router.get("/", async (req, res) => {
  const { genre, format, search } = req.query;

  if (isDbConnected()) {
    try {
      const pool = getDbPool();
      let query = "SELECT * FROM books WHERE 1=1";
      const params = [];

      if (genre && genre !== "all") {
        params.push(genre);
        query += ` AND genre = $${params.length}`;
      }

      if (search) {
        params.push(`%${search.toLowerCase()}%`);
        query += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(author) LIKE $${params.length})`;
      }

      query += " ORDER BY featured DESC, title ASC";
      const dbRes = await pool.query(query, params);
      return res.json({ success: true, count: dbRes.rows.length, books: dbRes.rows });
    } catch (e) {
      console.warn("DB query failed, fallback:", e.message);
    }
  }

  // Memory & JSON fallback
  let list = [...memoryStore.books];
  if (genre && genre !== "all") {
    list = list.filter((b) => b.genre === genre);
  }
  if (format && format !== "all") {
    list = list.filter((b) => (b.formats || []).includes(format));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((b) => (b.title && b.title.toLowerCase().includes(q)) || (b.author && b.author.toLowerCase().includes(q)));
  }

  res.json({ success: true, count: list.length, books: list });
});

// GET /api/books/:id (Público)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (isDbConnected()) {
    try {
      const pool = getDbPool();
      const dbRes = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
      if (dbRes.rows.length > 0) {
        return res.json({ success: true, book: dbRes.rows[0] });
      }
    } catch (e) {
      console.warn("DB query failed:", e.message);
    }
  }

  const book = memoryStore.books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Libro no encontrado" });
  }
  res.json({ success: true, book });
});

// POST /api/books (Admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  const { title, author, editorial, isbn, description, genre, genreLabel, priceCOP, priceUSD, stock, cover } = req.body;

  if (!title || !author || !priceCOP) {
    return res.status(400).json({ success: false, message: "Título, autor y precio son obligatorios" });
  }

  const newId = `book-${Date.now().toString().slice(-4)}`;
  const newBook = {
    id: newId,
    title,
    author,
    editorial: editorial || "BOOKVERSE Editorial",
    isbn: isbn || "978-0000000000",
    description: description || "Obra incorporada recientemente a nuestro catálogo general.",
    genre: genre || "fiction",
    genreLabel: genreLabel || "Ficción",
    formats: ["physical", "ebook"],
    price: {
      COP: Number(priceCOP),
      USD: Number(priceUSD) || Math.round((Number(priceCOP) / 4000) * 100) / 100
    },
    priceCOP: Number(priceCOP),
    priceUSD: Number(priceUSD) || Math.round((Number(priceCOP) / 4000) * 100) / 100,
    stock: Number(stock) !== undefined ? Number(stock) : 10,
    cover: cover || "assets/images/books/cien-anos-de-soledad.jpg",
    rating: 5.0,
    featured: true,
    publishedYear: 2026,
    sampleContent: `Fragmento de lectura disponible para ${title}. Esta obra explora perspectivas memorables para los lectores.`
  };

  if (isDbConnected()) {
    try {
      const pool = getDbPool();
      await pool.query(
        `INSERT INTO books (id, title, author, editorial, isbn, description, genre, genre_label, price_cop, price_usd, stock, cover, featured, published_year)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, 2026)`,
        [newId, title, author, newBook.editorial, newBook.isbn, newBook.description, newBook.genre, newBook.genreLabel, newBook.priceCOP, newBook.priceUSD, newBook.stock, newBook.cover]
      );
    } catch (e) {
      console.warn("DB insert fallback:", e.message);
    }
  }

  memoryStore.books.unshift(newBook);
  persistBooks();

  res.status(201).json({ success: true, message: "Libro creado y persistido exitosamente en el catálogo", book: newBook });
});

// PUT /api/books/:id (Admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  let book = memoryStore.books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Libro no encontrado" });
  }

  Object.assign(book, updates);
  if (updates.priceCOP !== undefined) {
    book.price = book.price || {};
    book.price.COP = Number(updates.priceCOP);
  }
  if (updates.priceUSD !== undefined) {
    book.price = book.price || {};
    book.price.USD = Number(updates.priceUSD);
  }

  if (isDbConnected()) {
    try {
      const pool = getDbPool();
      await pool.query(
        "UPDATE books SET title = COALESCE($1, title), author = COALESCE($2, author), stock = COALESCE($3, stock), price_cop = COALESCE($4, price_cop), price_usd = COALESCE($5, price_usd), description = COALESCE($6, description), genre = COALESCE($7, genre), genre_label = COALESCE($8, genre_label), cover = COALESCE($9, cover) WHERE id = $10",
        [updates.title, updates.author, updates.stock, updates.priceCOP, updates.priceUSD, updates.description, updates.genre, updates.genreLabel, updates.cover, id]
      );
    } catch (e) {
      console.warn("DB update fallback:", e.message);
    }
  }

  persistBooks();
  res.json({ success: true, message: "Libro actualizado correctamente", book });
});

// DELETE /api/books/:id (Admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const index = memoryStore.books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Libro no encontrado" });
  }

  memoryStore.books.splice(index, 1);

  if (isDbConnected()) {
    try {
      const pool = getDbPool();
      await pool.query("DELETE FROM books WHERE id = $1", [id]);
    } catch (e) {
      console.warn("DB delete fallback:", e.message);
    }
  }

  persistBooks();
  res.json({ success: true, message: "Libro eliminado del catálogo y persistido" });
});

export default router;
