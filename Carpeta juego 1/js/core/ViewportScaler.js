/**
 * Escala #game-stage (resolución fija, ver --viewport-width/height en
 * variables.css) para que quepa entera en la ventana del navegador,
 * manteniendo la proporción. Gracias a esto todas las coordenadas de
 * datos de escena (data/scenes/*.js) se pueden escribir en píxeles de
 * diseño fijos sin preocuparse del tamaño real de pantalla.
 */
export function initViewportScaling(stageElement, width, height) {
  function resize() {
    const scale = Math.min(window.innerWidth / width, window.innerHeight / height);
    stageElement.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  window.addEventListener('resize', resize);
  resize();
}
