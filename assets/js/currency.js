// BOOKVERSE - Manejo y formateo de monedas
import { Storage } from "./storage.js";

let currentCurrency = Storage.get("currency", "COP");

export function getCurrency() {
  return currentCurrency;
}

export function setCurrency(currency) {
  if (["COP", "USD", "EUR"].includes(currency)) {
    currentCurrency = currency;
    Storage.set("currency", currency);
    document.dispatchEvent(new CustomEvent("bookverse:currency-changed", { detail: currency }));
  }
}

export function formatPrice(priceObj) {
  if (!priceObj) return "$0";
  
  if (currentCurrency === "USD") {
    const amount = priceObj.USD || (priceObj.COP ? Math.round((priceObj.COP / 4000) * 100) / 100 : 0);
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  }
  
  if (currentCurrency === "EUR") {
    const usd = priceObj.USD || (priceObj.COP ? priceObj.COP / 4000 : 0);
    const amount = Math.round(usd * 0.92 * 100) / 100;
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  }

  // Default: COP
  const amount = priceObj.COP || (priceObj.USD ? Math.round(priceObj.USD * 4000) : 0);
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(amount);
}

export function getNumericPrice(priceObj) {
  if (!priceObj) return 0;
  if (currentCurrency === "USD") return priceObj.USD || 0;
  return priceObj.COP || 0;
}
