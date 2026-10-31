// BOOKVERSE - Gestor de Libros Favoritos (Wishlist)
import { Storage } from "./storage.js";
import { showToast } from "./ui/toast.js";
import { t } from "./i18n.js";

let favorites = Storage.get("favorites", []);

export function getFavorites() {
  return favorites;
}

export function isFavorite(bookId) {
  return favorites.includes(bookId);
}

export function toggleFavorite(bookId) {
  const index = favorites.indexOf(bookId);
  let added = false;
  
  if (index > -1) {
    favorites.splice(index, 1);
    showToast(t("wishlistItemRemoved"), "info");
  } else {
    favorites.push(bookId);
    showToast(t("wishlistItemAdded"));
    added = true;
  }

  Storage.set("favorites", favorites);
  updateWishlistBadges();
  syncWishlistButtons();
  document.dispatchEvent(new CustomEvent("bookverse:favorites-updated", { detail: favorites }));
  return added;
}

export function updateWishlistBadges() {
  const count = favorites.length;
  document.querySelectorAll(".wishlist-badge, [data-wishlist-count]").forEach((badge) => {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
  });
}

export function syncWishlistButtons() {
  document.querySelectorAll("[data-wishlist-id]").forEach((btn) => {
    const id = btn.dataset.wishlistId;
    const fav = isFavorite(id);
    btn.classList.toggle("is-active", fav);
    btn.setAttribute("aria-pressed", fav ? "true" : "false");
    const icon = btn.querySelector(".wishlist-icon");
    if (icon) {
      icon.textContent = fav ? "♥" : "♡";
    }
  });
}
