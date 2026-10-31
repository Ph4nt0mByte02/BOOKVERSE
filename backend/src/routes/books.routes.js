import { Router } from "express";
import { memoryStore } from "../config/db.js";
import { isSupabaseConfigured, supabaseRequest } from "../config/supabase.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = Router();

function toBookPayload(body, id) {
  const priceCOP = Number(body.priceCOP ?? body.price?.COP ?? 0);
  const priceUSD = Number(body.priceUSD ?? body.price?.USD ?? 0);
  return {
    id,
    title: body.title,
    author: body.author,
    editorial: body.editorial || "BOOKVERSE Editorial",
    isbn: body.isbn || null,
    description: body.description || "",
    genre: body.genre || "fiction",
    genre_label: body.genreLabel || body.genre || "Ficción",
    formats: body.formats || ["physical", "ebook"],
    price_cop: priceCOP,
    price_usd: priceUSD || Math.round((priceCOP / 4000) * 100) / 100,
    stock: Number(body.stock ?? 0),
    cover: body.cover || null,
    rating: Number(body.rating ?? 0),
    reviews_count: Number(body.reviewsCount ?? 0),
    featured: Boolean(body.featured),
    published_year: Number(body.publishedYear ?? new Date().getFullYear()),
    sample_content: body.sampleContent || ""
  };
}

function filterMemoryBooks(list, { genre, format, search }) {
  return list.filter((book) => {
    const matchesGenre = !genre || genre === "all" || book.genre === genre;
    const matchesFormat = !format || format === "all" || (book.formats || []).includes(format);
    const query = search?.toLowerCase();
    const matchesSearch = !query ||
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query);
    return matchesGenre && matchesFormat && matchesSearch;
  });
}

router.get("/", async (req, res) => {
  const { genre, format, search } = req.query;

  if (isSupabaseConfigured()) {
    try {
      const filters = ["select=*", "order=featured.desc,title.asc"];
      if (genre && genre !== "all") filters.push(`genre=eq.${encodeURIComponent(genre)}`);
      if (format && format !== "all") filters.push(`formats=cs.{${encodeURIComponent(format)}}`);
      if (search) {
        const query = encodeURIComponent(`*${search}*`);
        filters.push(`or=(title.ilike.${query},author.ilike.${query})`);
      }
      const books = await supabaseRequest(`books?${filters.join("&")}`);
      return res.json({ success: true, count: books.length, books });
    } catch (error) {
      console.warn("Supabase books query failed:", error.message);
      if (error.status && error.status < 500) {
        return res.status(error.status).json({ success: false, message: error.message });
      }
    }
  }

  const books = filterMemoryBooks(memoryStore.books, { genre, format, search });
  res.json({ success: true, count: books.length, books });
});

router.get("/:id", async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const books = await supabaseRequest(`books?id=eq.${encodeURIComponent(req.params.id)}&select=*`);
      if (books.length) return res.json({ success: true, book: books[0] });
    } catch (error) {
      console.warn("Supabase book query failed:", error.message);
    }
  }

  const book = memoryStore.books.find((item) => item.id === req.params.id);
  if (!book) return res.status(404).json({ success: false, message: "Libro no encontrado" });
  res.json({ success: true, book });
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  if (!req.body.title || !req.body.author || Number(req.body.priceCOP ?? req.body.price?.COP) <= 0) {
    return res.status(400).json({ success: false, message: "Título, autor y precio son obligatorios" });
  }

  const id = req.body.id || `book-${Date.now()}`;
  const book = toBookPayload(req.body, id);

  if (isSupabaseConfigured()) {
    try {
      const [created] = await supabaseRequest("books", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(book)
      }, req.user.accessToken);
      return res.status(201).json({ success: true, message: "Libro creado en Supabase", book: created });
    } catch (error) {
      return res.status(error.status || 502).json({ success: false, message: error.message });
    }
  }

  memoryStore.books.unshift({ ...req.body, id });
  res.status(201).json({ success: true, message: "Libro creado localmente", book: memoryStore.books[0] });
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  const updates = toBookPayload(req.body, req.params.id);
  delete updates.id;

  if (isSupabaseConfigured()) {
    try {
      const [updated] = await supabaseRequest(`books?id=eq.${encodeURIComponent(req.params.id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(updates)
      }, req.user.accessToken);
      if (!updated) return res.status(404).json({ success: false, message: "Libro no encontrado" });
      return res.json({ success: true, message: "Libro actualizado en Supabase", book: updated });
    } catch (error) {
      return res.status(error.status || 502).json({ success: false, message: error.message });
    }
  }

  const book = memoryStore.books.find((item) => item.id === req.params.id);
  if (!book) return res.status(404).json({ success: false, message: "Libro no encontrado" });
  Object.assign(book, req.body);
  res.json({ success: true, message: "Libro actualizado localmente", book });
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      await supabaseRequest(`books?id=eq.${encodeURIComponent(req.params.id)}`, {
        method: "DELETE",
        headers: { Prefer: "return=minimal" }
      }, req.user.accessToken);
      return res.json({ success: true, message: "Libro eliminado de Supabase" });
    } catch (error) {
      return res.status(error.status || 502).json({ success: false, message: error.message });
    }
  }

  const index = memoryStore.books.findIndex((item) => item.id === req.params.id);
  if (index < 0) return res.status(404).json({ success: false, message: "Libro no encontrado" });
  memoryStore.books.splice(index, 1);
  res.json({ success: true, message: "Libro eliminado localmente" });
});

export default router;
