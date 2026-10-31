// BOOKVERSE - Punto de entrada principal y coordinación global
import { initI18n, setLanguage, getLanguage, t } from "./i18n.js";
import { setCurrency, getCurrency, formatPrice } from "./currency.js";
import { updateCartBadges, addToCart } from "./cart.js";
import { updateWishlistBadges, syncWishlistButtons, toggleFavorite, isFavorite } from "./favorites.js";
import { getAllBooks, syncCatalogWithApi } from "./data/books.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializar Internacionalización
  initI18n();

  // 2. Sincronizar contadores de estado
  updateCartBadges();
  updateWishlistBadges();
  syncWishlistButtons();

  // 3. Renderizar dinámicamente las Novedades si estamos en Home
  function renderHomeNovedades() {
    const novedadesRow = document.getElementById("home-novedades-row");
    if (!novedadesRow) return;

    const booksList = getAllBooks().slice(0, 8);
    novedadesRow.innerHTML = booksList
      .map((book) => {
        const fav = isFavorite(book.id);
        const formatLabel = (book.formats && book.formats.length > 1) ? "Físico + Digital" : ((book.formats && book.formats[0] === "ebook") ? "Digital" : "Físico");
        const formattedPrice = formatPrice(book.price);

        return `
          <article class="book-card animate-fade-in" data-book-id="${book.id}">
            <div class="book-card-cover">
              <a href="book.html?id=${book.id}" aria-label="Ver detalles de ${book.title}">
                <img src="${book.cover}" alt="Portada de ${book.title}" loading="lazy" />
              </a>
              ${book.featured ? `<span class="book-card-badge">Destacado</span>` : ""}
              <button class="book-card-fav ${fav ? "is-active" : ""}" data-wishlist-id="${book.id}" aria-label="Favoritos" aria-pressed="${fav}">
                <span class="wishlist-icon">${fav ? "♥" : "♡"}</span>
              </button>
            </div>
            <div class="book-card-body">
              <h3 class="book-card-title"><a href="book.html?id=${book.id}">${book.title}</a></h3>
              <div class="book-card-author">${book.author}</div>
              <div class="book-card-meta">
                <span class="book-card-price">${formattedPrice}</span>
                <span class="book-card-format">${formatLabel}</span>
              </div>
              <button class="book-card-btn" data-add-cart="${book.id}" data-format="${(book.formats && book.formats[0]) || 'physical'}">
                ${t("addToCart")}
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  renderHomeNovedades();
  document.addEventListener("bookverse:catalog-updated", renderHomeNovedades);
  document.addEventListener("bookverse:currency-changed", renderHomeNovedades);

  // 4. Manejar selector de idioma
  const langSelects = document.querySelectorAll(".lang-select, #lang-select, #lang-selector");
  langSelects.forEach((sel) => {
    sel.value = getLanguage();
    sel.addEventListener("change", (e) => {
      setLanguage(e.target.value);
    });
  });

  // 5. Delegación de eventos para Añadir al Carrito
  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add-cart], [data-action='add-to-cart']");
    if (addBtn) {
      e.preventDefault();
      const bookId = addBtn.dataset.addCart || addBtn.dataset.bookId;
      const format = addBtn.dataset.format || "physical";
      if (bookId) {
        addToCart(bookId, format, 1);
      }
    }

    // Delegación para Favoritos
    const wishBtn = e.target.closest("[data-wishlist-id], [data-action='toggle-wishlist']");
    if (wishBtn) {
      e.preventDefault();
      const bookId = wishBtn.dataset.wishlistId || wishBtn.dataset.bookId;
      if (bookId) {
        toggleFavorite(bookId);
      }
    }

    // Menú móvil toggle
    const menuToggle = e.target.closest("#mobile-menu-toggle, .mobile-menu-btn");
    if (menuToggle) {
      const nav = document.querySelector(".header-nav, .primary-nav");
      if (nav) {
        nav.classList.toggle("is-open");
      }
    }
  });

  // 6. Manejo global de búsqueda (redirigir al catálogo con query param)
  const searchForms = document.querySelectorAll(".search-form, #global-search-form");
  searchForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='search'], input[name='q']");
      if (input && input.value.trim()) {
        window.location.href = `catalog.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });
  });

  const searchInputs = document.querySelectorAll(".search-input, #search-input");
  searchInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        e.preventDefault();
        window.location.href = `catalog.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });
  });
});
