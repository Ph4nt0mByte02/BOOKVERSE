// BOOKVERSE - Controlador de la Página del Carrito
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotals } from "../cart.js";
import { getBookById } from "../data/books.js";
import { formatPrice } from "../currency.js";
import { showToast } from "../ui/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const itemsContainer = document.getElementById("cart-items-list");
  const mainLayout = document.getElementById("cart-main-layout");
  const emptyState = document.getElementById("cart-empty-state");
  const subtotalEl = document.getElementById("cart-subtotal-val");
  const totalEl = document.getElementById("cart-total-val");
  const modalTotal = document.getElementById("modal-total-display");
  const checkoutModal = document.getElementById("checkout-modal");
  const btnOpenCheckout = document.getElementById("btn-open-checkout");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const orderSuccessCard = document.getElementById("order-success-card");

  function renderCart() {
    const cart = getCart();

    if (!cart || cart.length === 0) {
      if (mainLayout) mainLayout.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (mainLayout) mainLayout.style.display = "grid";
    if (emptyState) emptyState.style.display = "none";

    const totals = getCartTotals();
    const formattedTotal = formatPrice(totals.total);

    if (subtotalEl) subtotalEl.textContent = formattedTotal;
    if (totalEl) totalEl.textContent = formattedTotal;
    if (modalTotal) modalTotal.textContent = formattedTotal;

    if (!itemsContainer) return;

    itemsContainer.innerHTML = cart
      .map((item) => {
        const book = getBookById(item.id);
        if (!book) return "";

        const unitPriceObj = item.format === "ebook" ? { COP: Math.round(book.price.COP * 0.75), USD: Math.round(book.price.USD * 0.75 * 100) / 100 } : book.price;
        const linePriceObj = { COP: unitPriceObj.COP * item.quantity, USD: unitPriceObj.USD * item.quantity };
        const formatLabel = item.format === "ebook" ? "📱 Libro Digital (Ebook)" : "📕 Libro Físico";

        return `
          <article class="cart-item-card" data-item-id="${item.id}" data-item-format="${item.format}">
            <a href="book.html?id=${book.id}">
              <img src="${book.cover}" alt="Portada de ${book.title}" class="cart-item-img" />
            </a>
            
            <div class="cart-item-details">
              <span class="cart-item-format">${formatLabel}</span>
              <h3 class="cart-item-title"><a href="book.html?id=${book.id}">${book.title}</a></h3>
              <div style="font-size:0.875rem; color:var(--color-muted);">${book.author}</div>
              
              <div class="qty-counter">
                <button class="qty-btn" data-cart-minus="${item.id}" data-format="${item.format}">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" data-cart-plus="${item.id}" data-format="${item.format}">+</button>
              </div>
            </div>

            <div style="text-align:right; display:flex; flex-direction:column; justify-content:space-between; height:100%;">
              <div class="cart-item-price">${formatPrice(linePriceObj)}</div>
              <button class="btn btn-ghost" data-cart-remove="${item.id}" data-format="${item.format}" style="color:var(--color-danger); font-size:0.8125rem; padding:0.25rem 0.5rem; align-self:flex-end;">
                Eliminar
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // Click delegation inside items list
  if (itemsContainer) {
    itemsContainer.addEventListener("click", (e) => {
      const minusBtn = e.target.closest("[data-cart-minus]");
      if (minusBtn) {
        const id = minusBtn.dataset.cartMinus;
        const format = minusBtn.dataset.format;
        const cart = getCart();
        const item = cart.find((i) => i.id === id && i.format === format);
        if (item) updateQuantity(id, format, item.quantity - 1);
        renderCart();
        return;
      }

      const plusBtn = e.target.closest("[data-cart-plus]");
      if (plusBtn) {
        const id = plusBtn.dataset.cartPlus;
        const format = plusBtn.dataset.format;
        const cart = getCart();
        const item = cart.find((i) => i.id === id && i.format === format);
        if (item) updateQuantity(id, format, item.quantity + 1);
        renderCart();
        return;
      }

      const removeBtn = e.target.closest("[data-cart-remove]");
      if (removeBtn) {
        const id = removeBtn.dataset.cartRemove;
        const format = removeBtn.dataset.format;
        removeFromCart(id, format);
        renderCart();
        showToast("Artículo eliminado del carrito", "info");
        return;
      }
    });
  }

  // Modal Checkout handlers
  if (btnOpenCheckout && checkoutModal) {
    btnOpenCheckout.addEventListener("click", () => {
      checkoutModal.style.display = "flex";
    });
  }

  if (btnCloseModal && checkoutModal) {
    btnCloseModal.addEventListener("click", () => {
      checkoutModal.style.display = "none";
    });
  }

  window.confirmOrderSimulation = function () {
    if (checkoutModal) checkoutModal.style.display = "none";
    if (mainLayout) mainLayout.style.display = "none";

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNum = `BV-2026-${randomNum}`;
    const confirmedEl = document.getElementById("confirmed-order-number");
    if (confirmedEl) confirmedEl.textContent = orderNum;

    if (orderSuccessCard) orderSuccessCard.style.display = "block";
    clearCart();
    showToast("¡Pedido simulado con éxito!", "success");
  };

  document.addEventListener("bookverse:currency-changed", renderCart);
  document.addEventListener("bookverse:cart-updated", renderCart);

  // Initial render
  renderCart();
});
