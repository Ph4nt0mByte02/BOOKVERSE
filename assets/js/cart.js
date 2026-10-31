// BOOKVERSE - Gestor del Carrito de Compras
import { Storage } from "./storage.js";
import { getBookById } from "./data/books.js";
import { showToast } from "./ui/toast.js";
import { t } from "./i18n.js";

// Items structure: [{ id, format: "physical"|"ebook", quantity }]
let cart = Storage.get("cart", []);

export function getCart() {
  return cart;
}

export function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function updateCartBadges() {
  const count = getCartCount();
  document.querySelectorAll(".cart-badge, [data-cart-count]").forEach((badge) => {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
  });
}

export function addToCart(bookId, format = "physical", quantity = 1) {
  const book = getBookById(bookId);
  if (!book) return false;

  const existingIndex = cart.findIndex((item) => item.id === bookId && item.format === format);

  if (existingIndex > -1) {
    // If physical, verify against available stock
    if (format === "physical" && cart[existingIndex].quantity + quantity > book.stock) {
      showToast(`Stock máximo alcanzado (${book.stock} ejemplares)`, "error");
      return false;
    }
    cart[existingIndex].quantity += quantity;
  } else {
    if (format === "physical" && quantity > book.stock) {
      showToast(`Stock no disponible`, "error");
      return false;
    }
    cart.push({ id: bookId, format, quantity });
  }

  Storage.set("cart", cart);
  updateCartBadges();
  showToast(t("cartItemAdded"));
  document.dispatchEvent(new CustomEvent("bookverse:cart-updated", { detail: cart }));
  return true;
}

export function removeFromCart(bookId, format) {
  cart = cart.filter((item) => !(item.id === bookId && item.format === format));
  Storage.set("cart", cart);
  updateCartBadges();
  document.dispatchEvent(new CustomEvent("bookverse:cart-updated", { detail: cart }));
}

export function updateQuantity(bookId, format, newQuantity) {
  const book = getBookById(bookId);
  if (!book) return;

  const item = cart.find((i) => i.id === bookId && i.format === format);
  if (!item) return;

  if (newQuantity <= 0) {
    removeFromCart(bookId, format);
    return;
  }

  if (format === "physical" && newQuantity > book.stock) {
    showToast(`Solo quedan ${book.stock} unidades disponibles`, "error");
    return;
  }

  item.quantity = newQuantity;
  Storage.set("cart", cart);
  updateCartBadges();
  document.dispatchEvent(new CustomEvent("bookverse:cart-updated", { detail: cart }));
}

export function clearCart() {
  cart = [];
  Storage.set("cart", cart);
  updateCartBadges();
  document.dispatchEvent(new CustomEvent("bookverse:cart-updated", { detail: cart }));
}

export function getCartTotals() {
  let subtotalCOP = 0;
  let subtotalUSD = 0;

  cart.forEach((item) => {
    const book = getBookById(item.id);
    if (book && book.price) {
      const priceCOP = item.format === "ebook" ? Math.round(book.price.COP * 0.75) : book.price.COP;
      const priceUSD = item.format === "ebook" ? Math.round(book.price.USD * 0.75 * 100) / 100 : book.price.USD;
      subtotalCOP += priceCOP * item.quantity;
      subtotalUSD += priceUSD * item.quantity;
    }
  });

  return {
    subtotal: { COP: subtotalCOP, USD: subtotalUSD },
    total: { COP: subtotalCOP, USD: subtotalUSD },
    count: getCartCount()
  };
}
