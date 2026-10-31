// BOOKVERSE - Controlador de la vista Descubrir
import { getAllBooks } from "../data/books.js";
import { formatPrice } from "../currency.js";

export function render(container) {
  if (!container) return;
  const books = getAllBooks();
  const fictionBooks = books.filter(b => b.genre === "fiction" || b.featured);
  const selfHelp = books.filter(b => b.genre === "self-help" || b.genre === "philosophy");

  container.innerHTML = `
    <section class="discover-container" style="padding:2rem 0;">
      <div style="background:linear-gradient(135deg, var(--color-forest), #18382D); color:#F7F4EC; padding:3rem 2rem; border-radius:12px; margin-bottom:3rem;">
        <h1 style="font-family:var(--font-editorial); font-size:2.5rem; margin-bottom:1rem;">Historias que Dejan Huella</h1>
        <p style="font-size:1.125rem; max-width:650px; opacity:0.9;">Curaduría literaria independiente seleccionada con devoción por nuestros libreros.</p>
      </div>

      <h2 style="font-family:var(--font-editorial); font-size:1.875rem; margin-bottom:1.5rem;">Recomendados de Nuestros Libreros</h2>
      <div class="scroll-row" style="display:flex; gap:1.5rem; overflow-x:auto; padding-bottom:1rem;">
        ${fictionBooks.map(b => `
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
