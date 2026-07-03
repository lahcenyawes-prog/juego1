import { createElement } from '../utils/dom.js';

// Un poco por encima de --duration-scene (1200ms en transitions.css).
const FADE_FALLBACK_MS = 1500;

/**
 * Fundido a negro de pantalla completa, usado por SceneManager entre
 * cambios de escena. Expone dos promesas (fadeOut/fadeIn) que se
 * resuelven cuando la transición CSS termina.
 *
 * Se instancia como singleton (como sceneManager) porque SceneManager
 * necesita poder importarla y usarla desde el primer cambio de escena,
 * antes de que UIManager haya terminado de montar el resto de la UI;
 * `init()` solo conecta su elemento al DOM cuando ya existe.
 */
class FadeTransition {
  #element = null;

  init(rootElement) {
    this.#element = createElement('div', 'fade-overlay');
    rootElement.appendChild(this.#element);
  }

  fadeOut() {
    return this.#transition(true);
  }

  fadeIn() {
    return this.#transition(false);
  }

  #transition(visible) {
    return new Promise((resolve) => {
      if (!this.#element) {
        resolve();
        return;
      }

      const alreadyInState = this.#element.classList.contains('is-visible') === visible;
      if (alreadyInState) {
        resolve();
        return;
      }

      let fallbackTimer = null;
      const done = () => {
        clearTimeout(fallbackTimer);
        this.#element.removeEventListener('transitionend', handleEnd);
        resolve();
      };
      const handleEnd = (event) => {
        if (event.propertyName === 'opacity') done();
      };

      // Fuerza un cálculo de estilo previo. Sin esto, en el primer
      // arranque (overlay creado y clase añadida en la misma pasada
      // síncrona, antes del primer pintado) el navegador no genera
      // transición ni transitionend, y el juego se quedaba colgado
      // en negro esperando esta promesa.
      void this.#element.offsetWidth;

      this.#element.addEventListener('transitionend', handleEnd);
      this.#element.classList.toggle('is-visible', visible);

      // Red de seguridad: si transitionend no llega (pestaña en segundo
      // plano, transición interrumpida), resolvemos igualmente.
      fallbackTimer = setTimeout(done, FADE_FALLBACK_MS);
    });
  }
}

export const fadeTransition = new FadeTransition();
