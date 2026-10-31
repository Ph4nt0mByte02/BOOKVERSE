// Header component initialization
export function initHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  header.innerHTML = `
    <div class="header-container">
      <a href="#home" class="logo">BOOKVERSE</a>
      <nav class="nav-main">
        <a href="#home" data-i18n="home">Inicio</a>
        <a href="#catalog" data-i18n="catalog">Catálogo</a>
        <a href="#discover" data-i18n="discover">Descubrir</a>
        <a href="#stores" data-i18n="stores">Tiendas</a>
        <a href="#favorites" data-i18n="favorites">Favoritos</a>
        <a href="#cart" data-i18n="cart">Carrito <span id="cart-count" class="badge">0</span></a>
      </nav>
      <div class="header-actions">
        <input type="text" id="search-input" placeholder="Buscar" aria-label="Buscar libros" />
        <select id="language-select" aria-label="Seleccionar idioma">
          <option value="es">ES</option>
          <option value="en">EN</option>
          <option value="hi">HI</option>
          <option value="pt">PT</option>
        </select>
      </div>
    </div>
  `;
}
