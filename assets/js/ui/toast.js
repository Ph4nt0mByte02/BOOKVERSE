// BOOKVERSE - Sistema accesible de notificaciones Toast
export function showToast(message, type = "success") {
  let container = document.getElementById("bookverse-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "bookverse-toast-container";
    container.setAttribute("role", "status");
    container.setAttribute("aria-live", "polite");
    container.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `bv-toast bv-toast--${type}`;
  toast.style.cssText = `
    pointer-events: auto;
    background: #234B3D;
    color: #F7F4EC;
    padding: 0.875rem 1.25rem;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(35, 75, 61, 0.25);
    font-family: var(--font-interface, sans-serif);
    font-size: 0.9375rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transform: translateY(20px);
    opacity: 0;
    transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease;
    border-left: 4px solid #D6AD68;
    max-width: 380px;
  `;

  const icon = type === "error" ? "⚠️" : (type === "info" ? "ℹ️" : "✓");
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });

  // Auto remove after 3.2 seconds
  setTimeout(() => {
    toast.style.transform = "translateY(10px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}
