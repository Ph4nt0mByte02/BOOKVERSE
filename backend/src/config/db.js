// BOOKVERSE - Configuración del Pool de PostgreSQL con Fallback y Persistencia JSON
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../data/books.json");

let pool = null;
let isConnected = false;

const initialBooks = [
  {
    id: "book-001",
    title: "Cien Años de Soledad",
    author: "Gabriel García Márquez",
    editorial: "Editorial Sudamericana",
    isbn: "978-0307474728",
    description: "La obra cumbre del realismo mágico narrando la familia Buendía en Macondo.",
    genre: "fiction",
    genreLabel: "Ficción",
    formats: ["physical", "ebook"],
    priceCOP: 65000,
    priceUSD: 16.50,
    stock: 14,
    cover: "assets/images/books/cien-anos-de-soledad.jpg",
    rating: 4.9,
    featured: true,
    publishedYear: 1967
  },
  {
    id: "book-002",
    title: "Hábitos Atómicos",
    author: "James Clear",
    editorial: "Paidós Empresa",
    isbn: "978-6077477037",
    description: "Un método comprobado para desarrollar buenos hábitos.",
    genre: "self-help",
    genreLabel: "Desarrollo Personal",
    formats: ["physical", "ebook"],
    priceCOP: 58000,
    priceUSD: 14.99,
    stock: 22,
    cover: "assets/images/books/habitos-atomicos.jpg",
    rating: 4.8,
    featured: true,
    publishedYear: 2018
  },
  {
    id: "book-003",
    title: "Clean Code",
    author: "Robert C. Martin",
    editorial: "Anaya Multimedia",
    isbn: "978-0132350884",
    description: "Manual de estilo para desarrollo ágil.",
    genre: "technology",
    genreLabel: "Tecnología",
    formats: ["physical", "ebook"],
    priceCOP: 110000,
    priceUSD: 28.00,
    stock: 7,
    cover: "assets/images/books/clean-code.jpg",
    rating: 4.7,
    featured: true,
    publishedYear: 2008
  },
  {
    id: "book-004",
    title: "La Psicología del Dinero",
    author: "Morgan Housel",
    editorial: "Deusto",
    isbn: "978-8423432721",
    description: "19 lecciones sobre la riqueza y felicidad.",
    genre: "business",
    genreLabel: "Economía y Negocios",
    formats: ["physical", "ebook"],
    priceCOP: 62000,
    priceUSD: 15.50,
    stock: 18,
    cover: "assets/images/books/la-psicologia-del-dinero.jpg",
    rating: 4.8,
    featured: true,
    publishedYear: 2020
  },
  {
    id: "book-005",
    title: "Meditaciones",
    author: "Marco Aurelio",
    editorial: "Gredos Clásicos",
    isbn: "978-8424937225",
    description: "Reflexiones estoicas sobre la serenidad mental.",
    genre: "philosophy",
    genreLabel: "Filosofía Clásica",
    formats: ["physical", "ebook"],
    priceCOP: 49000,
    priceUSD: 12.00,
    stock: 15,
    cover: "assets/images/books/meditaciones.jpg",
    rating: 4.9,
    featured: true,
    publishedYear: 180
  },
  {
    id: "book-007",
    title: "Dune",
    author: "Frank Herbert",
    editorial: "Nova",
    isbn: "978-8417347987",
    description: "La epopeya de ciencia ficción en el planeta Arrakis.",
    genre: "sci-fi",
    genreLabel: "Ciencia Ficción",
    formats: ["physical", "ebook"],
    priceCOP: 79000,
    priceUSD: 19.90,
    stock: 9,
    cover: "assets/images/books/dune.jpg",
    rating: 4.9,
    featured: true,
    publishedYear: 1965
  }
];

// Cargar datos persistidos en disco o inicializar
function loadStoredBooks() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Aviso al leer data/books.json:", err.message);
  }
  // Si no existe, guardar el inicial
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialBooks, null, 2), "utf-8");
  } catch (e) {}
  return [...initialBooks];
}

export const memoryStore = {
  books: loadStoredBooks(),
  orders: [
    {
      id: 1,
      orderNumber: "BV-2026-10024",
      customerName: "Camila Restrepo",
      customerEmail: "camila@example.com",
      totalCOP: 123000,
      status: "completado",
      createdAt: new Date().toISOString(),
      items: [{ bookId: "book-001", title: "Cien Años de Soledad", format: "physical", quantity: 1 }]
    }
  ]
};

export function persistBooks() {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore.books, null, 2), "utf-8");
  } catch (err) {
    console.warn("No se pudo persistir en data/books.json:", err.message);
  }
}

export function getDbPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || "postgres://bookverse_admin:bookverse_secret_2026@localhost:5432/bookverse_db",
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000
    });

    pool.on("error", (err) => {
      console.warn("PostgreSQL Pool background notice:", err.message);
      isConnected = false;
    });
  }
  return pool;
}

export async function testConnection() {
  try {
    const p = getDbPool();
    const res = await p.query("SELECT NOW()");
    isConnected = true;
    console.log("✓ Conectado exitosamente a PostgreSQL Docker:", res.rows[0].now);
    return true;
  } catch (err) {
    console.log("ℹ PostgreSQL en Docker no disponible en este momento. Operando en modo memoria resiliente con persistencia en disco.");
    isConnected = false;
    return false;
  }
}

export function isDbConnected() {
  return isConnected;
}
