// BOOKVERSE - Controlador del Lector Digital
import { books, getBookById } from "../data/books.js";
import { Storage } from "../storage.js";
import { showToast } from "../ui/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id") || "book-001";
  const book = getBookById(bookId) || books[0];

  const readerBox = document.getElementById("reader-box");
  const readerTitle = document.getElementById("reader-title");
  const readerAuthor = document.getElementById("reader-author");
  const readerLabel = document.getElementById("reader-book-label");
  const readerContent = document.getElementById("reader-content-body");
  const buyBtn = document.getElementById("reader-buy-btn");

  // Load Book metadata
  if (readerTitle) readerTitle.textContent = book.title;
  if (readerAuthor) readerAuthor.textContent = book.author;
  if (readerLabel) readerLabel.textContent = `${book.title} (${book.author})`;
  if (buyBtn) buyBtn.href = `book.html?id=${book.id}`;

  if (readerContent && book.sampleContent) {
    const paragraphs = book.sampleContent.split(". ").filter(Boolean);
    readerContent.innerHTML = paragraphs.map((p) => `<p>${p.trim()}${p.endsWith(".") ? "" : "."}</p>`).join("");
  }

  // Theme Switches
  const savedTheme = Storage.get("reader_theme", "sepia");
  if (readerBox) readerBox.dataset.theme = savedTheme;

  const btnSepia = document.getElementById("theme-btn-sepia");
  const btnLight = document.getElementById("theme-btn-light");
  const btnDark = document.getElementById("theme-btn-dark");

  const setTheme = (theme) => {
    if (readerBox) readerBox.dataset.theme = theme;
    Storage.set("reader_theme", theme);
  };

  if (btnSepia) btnSepia.addEventListener("click", () => setTheme("sepia"));
  if (btnLight) btnLight.addEventListener("click", () => setTheme("light"));
  if (btnDark) btnDark.addEventListener("click", () => setTheme("dark"));

  // Font Size Controls
  let currentFontSize = Storage.get("reader_font_size", 1.25);
  const updateFontSize = (size) => {
    currentFontSize = Math.min(Math.max(size, 0.95), 1.8);
    if (readerBox) readerBox.style.setProperty("--reader-font-size", `${currentFontSize}rem`);
    Storage.set("reader_font_size", currentFontSize);
  };
  updateFontSize(currentFontSize);

  const btnIncrease = document.getElementById("btn-font-increase");
  const btnDecrease = document.getElementById("btn-font-decrease");

  if (btnIncrease) btnIncrease.addEventListener("click", () => updateFontSize(currentFontSize + 0.1));
  if (btnDecrease) btnDecrease.addEventListener("click", () => updateFontSize(currentFontSize - 0.1));

  // Bookmark
  const btnBookmark = document.getElementById("btn-bookmark");
  if (btnBookmark) {
    btnBookmark.addEventListener("click", () => {
      const scrollPos = window.scrollY;
      Storage.set(`reader_bookmark_${book.id}`, scrollPos);
      showToast("🔖 Posición de lectura guardada con éxito", "success");
    });

    // Restore bookmark if any
    const savedPos = Storage.get(`reader_bookmark_${book.id}`, null);
    if (savedPos !== null) {
      setTimeout(() => {
        window.scrollTo({ top: savedPos, behavior: "smooth" });
        showToast("Marcador restaurado", "info");
      }, 300);
    }
  }
});
