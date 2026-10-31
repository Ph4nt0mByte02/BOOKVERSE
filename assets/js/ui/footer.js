// Footer component initialization
export function initFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-container">
      <p>© 2026 BOOKVERSE. Todos los derechos reservados.</p>
      <nav class="footer-nav">
        <a href="#home" data-i18n="home">Inicio</a>
        <a href="#catalog" data-i18n="catalog">Catálogo</a>
        <a href="#discover" data-i18n="discover">Descubrir</a>
        <a href="#stores" data-i18n="stores">Tiendas</a>
        <a href="#help" data-i18n="help">Ayuda</a>
      </nav>
    </div>
  `;
}
