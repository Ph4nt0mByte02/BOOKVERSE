// BOOKVERSE - Catálogo central de libros con Sincronización API & LocalStorage
import { Storage } from "../storage.js";

const DEFAULT_BOOKS = [
  {
    id: "book-001",
    title: "Cien Años de Soledad",
    author: "Gabriel García Márquez",
    editorial: "Editorial Sudamericana",
    isbn: "978-0307474728",
    description: "La obra cumbre del realismo mágico narra la historia de siete generaciones de la familia Buendía en el mítico pueblo de Macondo.",
    descriptionEn: "The masterpiece of magical realism following the seven generations of the Buendía family in the mythical town of Macondo.",
    genre: "fiction",
    genreLabel: "Ficción",
    formats: ["physical", "ebook"],
    price: { COP: 65000, USD: 16.50 },
    availability: { physical: true, ebook: true },
    stock: 14,
    cover: "assets/images/books/cien-anos-de-soledad.jpg",
    language: "es",
    pages: 471,
    rating: 4.9,
    reviewsCount: 328,
    featured: true,
    publishedYear: 1967,
    sampleContent: "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo."
  },
  {
    id: "book-002",
    title: "Hábitos Atómicos",
    author: "James Clear",
    editorial: "Paidós Empresa",
    isbn: "978-6077477037",
    description: "Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos mediante pequeños cambios diarios.",
    descriptionEn: "An easy and proven way to build good habits and break bad ones through tiny daily changes.",
    genre: "self-help",
    genreLabel: "Desarrollo Personal",
    formats: ["physical", "ebook"],
    price: { COP: 58000, USD: 14.99 },
    availability: { physical: true, ebook: true },
    stock: 22,
    cover: "assets/images/books/habitos-atomicos.jpg",
    language: "es",
    pages: 320,
    rating: 4.8,
    reviewsCount: 412,
    featured: true,
    publishedYear: 2018,
    sampleContent: "El destino de tu vida depende de la calidad de tus hábitos. Con los mismos hábitos, siempre obtendrás los mismos resultados."
  },
  {
    id: "book-003",
    title: "Clean Code: Manual de desarrollo ágil",
    author: "Robert C. Martin",
    editorial: "Anaya Multimedia",
    isbn: "978-0132350884",
    description: "Incluso el código incorrecto puede funcionar, pero si no es limpio puede arruinar un proyecto. Aprende patrones y buenas prácticas.",
    descriptionEn: "Even bad code can function, but messy code ruins development projects.",
    genre: "technology",
    genreLabel: "Tecnología",
    formats: ["physical", "ebook"],
    price: { COP: 110000, USD: 28.00 },
    availability: { physical: true, ebook: true },
    stock: 7,
    cover: "assets/images/books/clean-code.jpg",
    language: "es",
    pages: 464,
    rating: 4.7,
    reviewsCount: 195,
    featured: true,
    publishedYear: 2008,
    sampleContent: "La única métrica válida para evaluar la calidad del código es la cantidad de '¿Qué demonios?' por minuto durante una revisión."
  },
  {
    id: "book-004",
    title: "La Psicología del Dinero",
    author: "Morgan Housel",
    editorial: "Deusto",
    isbn: "978-8423432721",
    description: "19 lecciones atemporales sobre la riqueza, la codicia y la felicidad, explorando cómo nuestras emociones moldean nuestras decisiones financieras.",
    descriptionEn: "19 timeless lessons on wealth, greed, and happiness.",
    genre: "business",
    genreLabel: "Economía y Negocios",
    formats: ["physical", "ebook"],
    price: { COP: 62000, USD: 15.50 },
    availability: { physical: true, ebook: true },
    stock: 18,
    cover: "assets/images/books/la-psicologia-del-dinero.jpg",
    language: "es",
    pages: 312,
    rating: 4.8,
    reviewsCount: 260,
    featured: true,
    publishedYear: 2020,
    sampleContent: "Tener éxito con el dinero tiene poco que ver con lo inteligente que seas y mucho con cómo te comportas."
  },
  {
    id: "book-005",
    title: "Meditaciones",
    author: "Marco Aurelio",
    editorial: "Gredos Clásicos",
    isbn: "978-8424937225",
    description: "Las reflexiones íntimas del emperador filósofo romano sobre la serenidad mental, la disciplina estoica y el deber ante la adversidad.",
    descriptionEn: "The intimate reflections of the Roman emperor-philosopher on serenity and stoic virtue.",
    genre: "philosophy",
    genreLabel: "Filosofía",
    formats: ["physical", "ebook"],
    price: { COP: 49000, USD: 12.00 },
    availability: { physical: true, ebook: true },
    stock: 15,
    cover: "assets/images/books/meditaciones.jpg",
    language: "es",
    pages: 288,
    rating: 4.9,
    reviewsCount: 380,
    featured: true,
    publishedYear: 180,
    sampleContent: "Al despuntar el alba, hazte esta reflexión: hoy tropezaré con un indiscreto, un ingrato, un soberbio, un impostor, un envidioso."
  },
  {
    id: "book-006",
    title: "El Poder del Ahora",
    author: "Eckhart Tolle",
    editorial: "Grijalbo",
    isbn: "978-8425337222",
    description: "Una guía esencial para la iluminación espiritual que enseña a liberarse de la tiranía de la mente y vivir plenamente el momento presente.",
    descriptionEn: "A guide to spiritual enlightenment in the present moment.",
    genre: "self-help",
    genreLabel: "Desarrollo Personal",
    formats: ["physical", "ebook"],
    price: { COP: 54000, USD: 13.80 },
    availability: { physical: true, ebook: true },
    stock: 12,
    cover: "assets/images/books/el-poder-del-ahora.jpg",
    language: "es",
    pages: 256,
    rating: 4.7,
    reviewsCount: 310,
    featured: false,
    publishedYear: 1997,
    sampleContent: "El pasado no tiene poder sobre el momento presente. Tu vida es ahora."
  },
  {
    id: "book-007",
    title: "Dune",
    author: "Frank Herbert",
    editorial: "Nova",
    isbn: "978-8417347987",
    description: "En el desértico planeta Arrakis, el joven Paul Atreides asume un destino cósmico entre intrigas políticas, ecología y misticismo.",
    descriptionEn: "Set on the desert planet Arrakis, Paul Atreides navigates prophecy.",
    genre: "sci-fi",
    genreLabel: "Ciencia Ficción",
    formats: ["physical", "ebook"],
    price: { COP: 79000, USD: 19.90 },
    availability: { physical: true, ebook: true },
    stock: 9,
    cover: "assets/images/books/dune.jpg",
    language: "es",
    pages: 704,
    rating: 4.9,
    reviewsCount: 440,
    featured: true,
    publishedYear: 1965,
    sampleContent: "Un comienzo es el momento más delicado. En el año 10.191, el universo conocido está gobernado por el Emperador Padishah Shaddam IV."
  },
  {
    id: "book-008",
    title: "Sapiens: De animales a dioses",
    author: "Yuval Noah Harari",
    editorial: "Debate",
    isbn: "978-8499926223",
    description: "Una breve historia de la humanidad que explora cómo una especie insignificante de simios logró dominar el planeta Tierra.",
    descriptionEn: "A brief history of humankind.",
    genre: "history",
    genreLabel: "Historia",
    formats: ["physical", "ebook"],
    price: { COP: 72000, USD: 18.00 },
    availability: { physical: true, ebook: true },
    stock: 16,
    cover: "https://images.unsplash.com/photo-5447162786-22c1d01fe4e4?w=500&h=750&fit=crop",
    language: "es",
    pages: 496,
    rating: 4.8,
    reviewsCount: 512,
    featured: true,
    publishedYear: 2014,
    sampleContent: "Hace 100.000 años, al menos seis especies humanas habitaban la Tierra. Hoy solo queda una: la nuestra."
  },
  {
    id: "book-009",
    title: "Orgullo y Prejuicio",
    author: "Jane Austen",
    editorial: "Austral Clásicos",
    isbn: "978-8467040401",
    description: "La historia clásica de Elizabeth Bennet y el señor Darcy, explorando las costumbres, el matrimonio y el orgullo en la Inglaterra decimonónica.",
    descriptionEn: "The story of Elizabeth Bennet and Mr. Darcy.",
    genre: "romance",
    genreLabel: "Romance y Clásicos",
    formats: ["physical", "ebook"],
    price: { COP: 42000, USD: 10.50 },
    availability: { physical: true, ebook: true },
    stock: 11,
    cover: "https://images.unsplash.com/photo-544947950-fa07a98d237f?w=500&h=750&fit=crop",
    language: "es",
    pages: 448,
    rating: 4.8,
    reviewsCount: 290,
    featured: false,
    publishedYear: 1813,
    sampleContent: "Es una verdad mundialmente reconocida que un hombre soltero, poseedor de una gran fortuna, necesita una esposa."
  },
  {
    id: "book-010",
    title: "1984",
    author: "George Orwell",
    editorial: "Debolsillo",
    isbn: "978-8499890944",
    description: "La inquietante distopía donde el Gran Hermano vigila cada pensamiento y la neolengua reescribe la verdad y la memoria colectiva.",
    descriptionEn: "The haunting dystopia where Big Brother watches every thought.",
    genre: "fiction",
    genreLabel: "Ficción",
    formats: ["physical", "ebook"],
    price: { COP: 45000, USD: 11.20 },
    availability: { physical: true, ebook: true },
    stock: 20,
    cover: "https://images.unsplash.com/photo-535392432937-a27c36ec07b5?w=500&h=750&fit=crop",
    language: "es",
    pages: 352,
    rating: 4.9,
    reviewsCount: 620,
    featured: true,
    publishedYear: 1949,
    sampleContent: "Era un día frío y luminoso de abril, y los relojes daban las trece."
  },
  {
    id: "book-011",
    title: "El Principito",
    author: "Antoine de Saint-Exupéry",
    editorial: "Salamandra",
    isbn: "978-8498381498",
    description: "Una fábula poética sobre el amor, la amistad y el verdadero sentido de la existencia contada a través de un pequeño príncipe viajero.",
    descriptionEn: "A poetic fable on love and friendship.",
    genre: "children",
    genreLabel: "Infantil y Juvenil",
    formats: ["physical", "ebook"],
    price: { COP: 38000, USD: 9.50 },
    availability: { physical: true, ebook: true },
    stock: 25,
    cover: "https://images.unsplash.com/photo-512820790803-83ca734da794?w=500&h=750&fit=crop",
    language: "es",
    pages: 120,
    rating: 4.9,
    reviewsCount: 710,
    featured: false,
    publishedYear: 1943,
    sampleContent: "He aquí mi secreto, que no puede ser más simple: solo con el corazón se puede ver bien; lo esencial es invisible para los ojos."
  },
  {
    id: "book-012",
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    editorial: "Addison-Wesley",
    isbn: "978-0135957059",
    description: "Your journey to mastery: from code craftsmanship to architectural thinking and continuous personal improvement.",
    descriptionEn: "Your journey to software craftsmanship.",
    genre: "technology",
    genreLabel: "Tecnología",
    formats: ["ebook", "physical"],
    price: { COP: 125000, USD: 32.00 },
    availability: { physical: true, ebook: true },
    stock: 5,
    cover: "https://images.unsplash.com/photo-526374965328-7f61d4dc18c5?w=500&h=750&fit=crop",
    language: "en",
    pages: 352,
    rating: 4.9,
    reviewsCount: 220,
    featured: false,
    publishedYear: 2019,
    sampleContent: "Care about your craft. Why spend your life developing software unless you care about doing it well?"
  }
];

// Helper to load current local cache
function loadLocalCatalog() {
  const custom = Storage.get("catalog", null);
  if (Array.isArray(custom) && custom.length > 0) {
    return custom;
  }
  return [...DEFAULT_BOOKS];
}

export let books = loadLocalCatalog();

export function getAllBooks() {
  return books;
}

export function getBookById(id) {
  return books.find((b) => b.id === id) || DEFAULT_BOOKS.find((b) => b.id === id);
}

export function getFeaturedBooks() {
  return books.filter((b) => b.featured);
}

export function getBooksByGenre(genre) {
  if (!genre || genre === "all") return books;
  return books.filter((b) => b.genre === genre);
}

// Sincronización con Backend Express
export async function syncCatalogWithApi() {
  try {
    const res = await fetch("/api/books");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.books) && data.books.length > 0) {
        // Normalizar estructura si viene de PostgreSQL o memoria
        const remoteBooks = data.books.map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          editorial: b.editorial || "BOOKVERSE Editorial",
          isbn: b.isbn || "978-0000000000",
          description: b.description || "",
          genre: b.genre || "fiction",
          genreLabel: b.genre_label || b.genreLabel || "Ficción",
          formats: b.formats || ["physical", "ebook"],
          price: b.price || {
            COP: Number(b.price_cop || b.priceCOP || 50000),
            USD: Number(b.price_usd || b.priceUSD || 12.50)
          },
          stock: Number(b.stock !== undefined ? b.stock : 10),
          cover: b.cover || "assets/images/books/cien-anos-de-soledad.jpg",
          rating: Number(b.rating || 4.8),
          reviewsCount: Number(b.reviews_count || b.reviewsCount || 100),
          featured: Boolean(b.featured),
          publishedYear: Number(b.published_year || b.publishedYear || 2026),
          sampleContent: b.sample_content || b.sampleContent || "Fragmento de lectura disponible."
        }));

        books = remoteBooks;
        Storage.set("catalog", books);
        document.dispatchEvent(new CustomEvent("bookverse:catalog-updated", { detail: books }));
        return books;
      }
    }
  } catch (err) {
    // Si corre estático, usar local
  }
  return books;
}

// Guardar libro (usado por Consola y Catálogo)
export async function saveBookToCatalog(bookData) {
  const existingIdx = books.findIndex((b) => b.id === bookData.id);
  if (existingIdx > -1) {
    books[existingIdx] = { ...books[existingIdx], ...bookData };
  } else {
    books.unshift(bookData);
  }

  Storage.set("catalog", books);
  document.dispatchEvent(new CustomEvent("bookverse:catalog-updated", { detail: books }));

  // Enviar a la API del backend
  try {
    await fetch("/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": "bookverse-admin-2026"
      },
      body: JSON.stringify(bookData)
    });
  } catch (e) {}

  return books;
}

// Eliminar libro
export async function removeBookFromCatalog(id) {
  books = books.filter((b) => b.id !== id);
  Storage.set("catalog", books);
  document.dispatchEvent(new CustomEvent("bookverse:catalog-updated", { detail: books }));

  try {
    await fetch(`/api/books/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-key": "bookverse-admin-2026"
      }
    });
  } catch (e) {}

  return books;
}

// Iniciar sincronización en segundo plano al cargar
syncCatalogWithApi();
