// BOOKVERSE - Controlador de la Ficha de Producto
import { books, getBookById } from "../data/books.js";
import { formatPrice } from "../currency.js";
import { addToCart } from "../cart.js";
import { isFavorite, toggleFavorite } from "../favorites.js";
import { showToast } from "../ui/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id") || "book-001";
  const book = getBookById(bookId) || books[0];

  let selectedFormat = "physical";
  let quantity = 1;

  // Populate Elements
  document.title = `${book.title} — ${book.author} | BOOKVERSE`;
  const breadcrumb = document.getElementById("breadcrumb-title");
  if (breadcrumb) breadcrumb.textContent = book.title;

  const cover = document.getElementById("product-cover");
  if (cover) {
    cover.src = book.cover;
    cover.alt = `Portada de ${book.title}`;
  }

  const sampleBtn = document.getElementById("btn-read-sample");
  if (sampleBtn) {
    sampleBtn.href = `reader.html?id=${book.id}`;
  }

  const genre = document.getElementById("product-genre");
  if (genre) genre.textContent = book.genreLabel;

  const title = document.getElementById("product-title");
  if (title) title.textContent = book.title;

  const author = document.getElementById("product-author");
  if (author) author.textContent = book.author;

  const desc = document.getElementById("product-description");
  if (desc) desc.textContent = book.description;

  const ratingVal = document.getElementById("product-rating-val");
  if (ratingVal) ratingVal.textContent = book.rating;

  const reviewsCount = document.getElementById("product-reviews-count");
  if (reviewsCount) reviewsCount.textContent = `(${book.reviewsCount} valoraciones)`;

  // Pricing
  const physicalPrice = formatPrice(book.price);
  const ebookPriceObj = {
    COP: Math.round(book.price.COP * 0.75),
    USD: Math.round(book.price.USD * 0.75 * 100) / 100
  };
  const ebookPrice = formatPrice(ebookPriceObj);

  const pricePhysicalEl = document.getElementById("price-physical");
  if (pricePhysicalEl) pricePhysicalEl.textContent = physicalPrice;

  const priceEbookEl = document.getElementById("price-ebook");
  if (priceEbookEl) priceEbookEl.textContent = ebookPrice;

  // Stock
  const stockEl = document.getElementById("stock-status");
  if (stockEl) {
    if (book.stock > 0) {
      stockEl.textContent = `✓ En stock (${book.stock} ejemplares disponibles)`;
      stockEl.style.color = "var(--color-success)";
    } else {
      stockEl.textContent = "✗ Agotado físicamente";
      stockEl.style.color = "var(--color-danger)";
    }
  }

  // Meta Table
  const metaEditorial = document.getElementById("meta-editorial");
  if (metaEditorial) metaEditorial.textContent = book.editorial || "BOOKVERSE Ediciones";

  const metaIsbn = document.getElementById("meta-isbn");
  if (metaIsbn) metaIsbn.textContent = book.isbn || "978-0000000000";

  const metaPages = document.getElementById("meta-pages");
  if (metaPages) metaPages.textContent = `${book.pages || 320} páginas`;

  const metaYear = document.getElementById("meta-year");
  if (metaYear) metaYear.textContent = book.publishedYear;

  const metaLang = document.getElementById("meta-lang");
  if (metaLang) metaLang.textContent = book.language === "es" ? "Español" : "Inglés";

  // Format Switcher
  const optPhysical = document.getElementById("opt-format-physical");
  const optEbook = document.getElementById("opt-format-ebook");
  const qtyContainer = document.getElementById("qty-container");

  if (optPhysical && optEbook) {
    optPhysical.addEventListener("click", () => {
      selectedFormat = "physical";
      optPhysical.classList.add("is-selected");
      optEbook.classList.remove("is-selected");
      if (qtyContainer) qtyContainer.style.display = "inline-flex";
    });

    optEbook.addEventListener("click", () => {
      selectedFormat = "ebook";
      optEbook.classList.add("is-selected");
      optPhysical.classList.remove("is-selected");
      if (qtyContainer) qtyContainer.style.display = "none";
    });
  }

  // Quantity Controls
  const qtyDisplay = document.getElementById("qty-display");
  const btnMinus = document.getElementById("btn-qty-minus");
  const btnPlus = document.getElementById("btn-qty-plus");

  if (btnMinus && btnPlus && qtyDisplay) {
    btnMinus.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        qtyDisplay.textContent = quantity;
      }
    });

    btnPlus.addEventListener("click", () => {
      if (quantity < book.stock) {
        quantity++;
        qtyDisplay.textContent = quantity;
      } else {
        showToast(`Stock máximo disponible alcanzado (${book.stock})`, "error");
      }
    });
  }

  // Add to Cart
  const btnAddToCart = document.getElementById("btn-add-to-cart");
  if (btnAddToCart) {
    btnAddToCart.addEventListener("click", () => {
      const ok = addToCart(book.id, selectedFormat, selectedFormat === "physical" ? quantity : 1);
      if (ok) {
        btnAddToCart.textContent = "✓ ¡Añadido!";
        setTimeout(() => {
          btnAddToCart.textContent = "🛒 Añadir al carrito";
        }, 1500);
      }
    });
  }

  // Favorite button
  const favBtn = document.getElementById("btn-toggle-favorite");
  const favIcon = document.getElementById("fav-icon");
  if (favBtn && favIcon) {
    const updateFavIcon = () => {
      const fav = isFavorite(book.id);
      favIcon.textContent = fav ? "♥" : "♡";
      favIcon.style.color = fav ? "var(--color-terracotta)" : "inherit";
    };
    updateFavIcon();

    favBtn.addEventListener("click", () => {
      toggleFavorite(book.id);
      updateFavIcon();
    });
  }

  // Related Books
  const relatedContainer = document.getElementById("related-books-container");
  if (relatedContainer) {
    const related = books.filter((b) => b.id !== book.id && (b.genre === book.genre || b.featured)).slice(0, 4);
    relatedContainer.innerHTML = related
      .map(
        (r) => `
        <article class="book-card" style="min-width:210px; max-width:240px;">
          <div class="book-card-cover">
            <a href="book.html?id=${r.id}">
              <img src="${r.cover}" alt="Portada de ${r.title}" loading="lazy" />
            </a>
          </div>
          <div class="book-card-body">
            <h3 class="book-card-title"><a href="book.html?id=${r.id}">${r.title}</a></h3>
            <div class="book-card-author">${r.author}</div>
            <div class="book-card-meta">
              <span class="book-card-price">${formatPrice(r.price)}</span>
            </div>
          </div>
        </article>
      `
      )
      .join("");
  }
});
