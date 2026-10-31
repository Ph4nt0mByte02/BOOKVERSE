// Global application state and simple persistence helpers
export const state = {
  language: "es",
  cart: [],
  favorites: [],
  books: [] // will be populated from data/books.js if needed
};

export function setLanguage(lang) {
  state.language = lang;
  localStorage.setItem("bookverse-language", lang);
}

/** Load persisted preferences (language, cart) from localStorage */
export function loadPreferences() {
  const savedLang = localStorage.getItem("bookverse-language");
  if (savedLang) {
    state.language = savedLang;
  }
  const savedCart = localStorage.getItem("bookverse-cart");
  if (savedCart) {
    try {
      state.cart = JSON.parse(savedCart);
    } catch (e) {
      console.warn("Failed to parse saved cart", e);
      state.cart = [];
    }
  }
}

/** Persist cart whenever it changes (simple helper) */
export function saveCart() {
  localStorage.setItem("bookverse-cart", JSON.stringify(state.cart));
}
