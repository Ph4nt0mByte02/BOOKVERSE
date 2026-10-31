// Simple client-side router for SPA
export function initRouter() {
  window.addEventListener("hashchange", renderRoute);
  // initial load
  renderRoute();
}

function renderRoute() {
  const route = location.hash.replace(/^#/, "") || "home";
  const appRoot = document.getElementById("app-root");
  // Placeholder: load page modules dynamically
  import(`./pages/${route}.js`).then(module => {
    if (typeof module.render === "function") {
      module.render(appRoot);
    } else {
      appRoot.innerHTML = `<h2>Página ${route} no implementada</h2>`;
    }
  }).catch(() => {
    appRoot.innerHTML = `<h2>Página ${route} no encontrada</h2>`;
  });
}
