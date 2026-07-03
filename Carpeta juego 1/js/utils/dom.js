/**
 * Helpers pequeños para crear y limpiar nodos DOM sin repetir
 * document.createElement/className en cada componente.
 */
export function createElement(tag, className, attributes = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined || value === null) continue;
    if (key === 'text') element.textContent = value;
    else element.setAttribute(key, value);
  }
  return element;
}

export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Aplica la forma placeholder (rectángulo o círculo) descrita en los
 * archivos de datos de escena a un elemento. Cuando llegue el arte
 * definitivo, esto se sustituye por asignar una imagen de fondo.
 *
 * Campos opcionales del shape:
 *   glow: '#color'  → halo de luz (para lámparas, carteles, pantallas)
 *   flicker: true   → parpadeo tipo fluorescente (clase light-flicker)
 */
export function applyShape(element, shape = {}) {
  const { kind = 'rect', width = 32, height = 32, color = '#888', glow = null, flicker = false } = shape;
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.background = color;
  element.classList.add(kind === 'circle' ? 'entity__shape--circle' : 'entity__shape--rect');

  if (glow) element.style.boxShadow = `0 0 34px 6px ${glow}`;
  if (flicker) element.classList.add('light-flicker');
}
