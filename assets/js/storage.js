// BOOKVERSE - Almacenamiento local seguro con validación y manejo de errores
const STORAGE_PREFIX = "bookverse_";
const STORAGE_VERSION = "1.0";

export const Storage = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) return defaultValue;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.__version === STORAGE_VERSION) {
        return parsed.data;
      }
      return defaultValue;
    } catch (e) {
      console.warn(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  set(key, data) {
    try {
      const payload = {
        __version: STORAGE_VERSION,
        timestamp: Date.now(),
        data
      };
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.warn(`Error writing ${key} to localStorage:`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (e) {
      console.warn(`Error removing ${key}:`, e);
    }
  }
};
