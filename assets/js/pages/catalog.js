// BOOKVERSE - Lógica Interactiva del Catálogo con Sincronización en Tiempo Real
import { getAllBooks, syncCatalogWithApi } from "../data/books.js";
import { formatPrice, getNumericPrice } from "../currency.js";
import { addToCart } from "../cart.js";
import { toggleFavorite, isFavorite } from "../favorites.js";
import { t } from "../i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("catalog-books-grid");
  const countText = document.getElementById("visible-books-count");
  const emptyState = document.getElementById("catalog-empty-state");
  const sortSelect = document.getElementById("catalog-sort-select");
  const searchInput = document.getElementById("catalog-search-input");
  const stockFilter = document.getElementById("stock-filter");
  const clearFiltersBtn = document.getElementById("clear-filters-btn");
  const resetCatalogBtn = document.getElementById("reset-catalog-btn");

  // Read URL params
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q") || "";
  const initialFormat = urlParams.get("format") || "all";
  const initialGenre = urlParams.get("genre") || "";

  if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
  }

  // Set initial format radio
  const formatRadios = document.querySelectorAll("input[name='format-filter']");
  formatRadios.forEach((radio) => {
    if (radio.value === initialFormat) radio.checked = true;
    radio.addEventListener("change", applyFilters);
  });

  // Set initial genre checkbox if specified
  if (initialGenre) {
    const genreBox = document.querySelector(`input[name='genre'][value='${initialGenre}']`);
    if (genreBox) genreBox.checked = true;
  }

  // Event Listeners
  if (sortSelect) sortSelect.addEventListener("change", applyFilters);
  if (stockFilter) stockFilter.addEventListener("change", applyFilters);
  if (searchInput) searchInput.addEventListener("input", applyFilters);

  document.querySelectorAll("input[name='genre']").forEach((cb) => {
    cb.addEventListener("change", applyFilters);
  });

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", resetFilters);
  }
  if (resetCatalogBtn) {
    resetCatalogBtn.addEventListener("click", resetFilters);
  }

  // Listen to currency change to re-render
  document.addEventListener("bookverse:currency-changed", () => {
    applyFilters();
  });

  // Escuchar actualizaciones del catálogo en tiempo real desde la consola
  document.addEventListener("bookverse:catalog-updated", () => {
    applyFilters();
  });

  function resetFilters() {
    if (searchInput) searchInput.value = "";
    if (stockFilter) stockFilter.checked = false;
    if (sortSelect) sortSelect.value = "featured";
    formatRadios.forEach((r) => (r.checked = r.value === "all"));
    document.querySelectorAll("input[name='genre']").forEach((cb) => (cb.checked = false));
    applyFilters();
  }

  function applyFilters() {
    let result = [...getAllBooks()];

    // 1. Text Search Filter
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    if (query) {
      result = result.filter(
        (b) =>
          (b.title && b.title.toLowerCase().includes(query)) ||
          (b.author && b.author.toLowerCase().includes(query)) ||
          (b.genreLabel && b.genreLabel.toLowerCase().includes(query)) ||
          (b.isbn && b.isbn.includes(query))
      );
    }

    // 2. Format Filter
    const selectedFormat = document.querySelector("input[name='format-filter']:checked")?.value || "all";
    if (selectedFormat !== "all") {
      result = result.filter((b) => (b.formats || []).includes(selectedFormat));
    }

    // 3. Genre Filter
    const selectedGenres = Array.from(document.querySelectorAll("input[name='genre']:checked")).map((cb) => cb.value);
    if (selectedGenres.length > 0) {
      result = result.filter((b) => selectedGenres.includes(b.genre));
    }

    // 4. In-Stock Filter
    if (stockFilter && stockFilter.checked) {
      result = result.filter((b) => Number(b.stock) > 0);
    }

    // 5. Sorting
    const sortVal = sortSelect ? sortSelect.value : "featured";
    if (sortVal === "price-asc") {
      result.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    } else if (sortVal === "price-desc") {
      result.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    } else if (sortVal === "title-az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortVal === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortVal === "year") {
      result.sort((a, b) => (b.publishedYear || 0) - (a.publishedYear || 0));
    } else {
      // Featured / default
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    renderGrid(result);
  }

  function renderGrid(filteredBooks) {
    if (!grid) return;

    if (countText) countText.textContent = filteredBooks.length;

    if (filteredBooks.length === 0) {
      grid.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    grid.style.display = "grid";
    if (emptyState) emptyState.style.display = "none";

    grid.innerHTML = filteredBooks
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

  // Initial render & sync
  applyFilters();
  syncCatalogWithApi().then(() => applyFilters());
});
