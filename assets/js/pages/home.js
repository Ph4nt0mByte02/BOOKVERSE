// BOOKVERSE - Controlador de la vista Home (SPA fallback)
import { getAllBooks } from "../data/books.js";
import { formatPrice } from "../currency.js";

export function render(container) {
  if (!container) return;
  const books = getAllBooks();
  const featured = books.filter(b => b.featured);

  container.innerHTML = `
    <section class="hero page-container">
      <div class="hero-content">
        <h1 class="hero-title">Tu próxima historia está esperando</h1>
        <p class="hero-subtitle">Descubre libros que despiertan ideas, acompañan momentos y abren nuevas perspectivas.</p>
        <div class="hero-actions">
          <a href="catalog.html" class="btn btn-primary">Explorar catálogo</a>
          <a href="catalog.html?format=ebook" class="btn btn-secondary">Descubrir e‑books</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-books">
          <img class="hero-book" src="assets/images/books/cien-anos-de-soledad.jpg" alt="Portada libro" />
          <img class="hero-book" src="assets/images/books/dune.jpg" alt="Portada libro" />
          <img class="hero-book" src="assets/images/books/habitos-atomicos.jpg" alt="Portada libro" />
        </div>
      </div>
    </section>

    <section class="books-section page-container">
      <div class="books-section-header">
        <h2>Novedades Destacadas</h2>
        <a href="catalog.html" class="btn btn-ghost">Ver todo →</a>
      </div>
      <div class="scroll-row">
        ${featured.map(b => `
          <div class="book-card" style="min-width:220px; max-width:250px;">
            <div class="book-card-cover">
              <a href="book.html?id=${b.id}"><img src="${b.cover}" alt="${b.title}" loading="lazy" /></a>
            </div>
            <div class="book-card-body">
              <h3 class="book-card-title"><a href="book.html?id=${b.id}">${b.title}</a></h3>
              <div class="book-card-author">${b.author}</div>
              <div class="book-card-meta"><span class="book-card-price">${formatPrice(b.price)}</span></div>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}
