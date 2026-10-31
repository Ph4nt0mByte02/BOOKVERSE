// BOOKVERSE - Controlador de la Página de Favoritos
import { getFavorites, toggleFavorite } from "../favorites.js";
import { getBookById } from "../data/books.js";
import { formatPrice } from "../currency.js";
import { addToCart } from "../cart.js";
import { t } from "../i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("favorites-books-grid");
  const emptyState = document.getElementById("favorites-empty-state");

  function renderFavorites() {
    const favIds = getFavorites();

    if (!favIds || favIds.length === 0) {
      if (grid) grid.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (grid) grid.style.display = "grid";
    if (emptyState) emptyState.style.display = "none";

    const booksList = favIds.map((id) => getBookById(id)).filter(Boolean);

    grid.innerHTML = booksList
      .map((book) => {
        const formattedPrice = formatPrice(book.price);
        const formatLabel = book.formats.length > 1 ? "Físico + Digital" : (book.formats[0] === "ebook" ? "Digital" : "Físico");

        return `
          <article class="book-card" data-book-id="${book.id}">
            <div class="book-card-cover">
              <a href="book.html?id=${book.id}">
                <img src="${book.cover}" alt="Portada de ${book.title}" loading="lazy" />
              </a>
              <button class="book-card-fav is-active" data-remove-fav="${book.id}" aria-label="Quitar de favoritos" aria-pressed="true">
                <span class="wishlist-icon">♥</span>
              </button>
            </div>
            <div class="book-card-body">
              <h3 class="book-card-title"><a href="book.html?id=${book.id}">${book.title}</a></h3>
              <div class="book-card-author">${book.author}</div>
              <div class="book-card-meta">
                <span class="book-card-price">${formattedPrice}</span>
                <span class="book-card-format">${formatLabel}</span>
              </div>
              <button class="book-card-btn" data-add-cart="${book.id}" data-format="${book.formats[0] || 'physical'}">
                ${t("addToCart")}
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  if (grid) {
    grid.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-remove-fav]");
      if (removeBtn) {
        const id = removeBtn.dataset.removeFav;
        toggleFavorite(id);
        renderFavorites();
      }
    });
  }

  document.addEventListener("bookverse:favorites-updated", renderFavorites);
  document.addEventListener("bookverse:currency-changed", renderFavorites);

  renderFavorites();
});
