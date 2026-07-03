import { createElement } from '../utils/dom.js';
import { randomRange } from '../utils/math.js';

/**
 * Motas de polvo flotando hacia arriba, en espacio de pantalla. El
 * movimiento es CSS puro (ver .dust-mote en effects.css); aquí solo se
 * generan las motas con parámetros aleatorios. Lo usan las escenas
 * jugables y el menú principal.
 *
 * No es singleton: cada escena crea el suyo y lo destruye al salir.
 */
export class DustField {
  #root = null;

  constructor(container, { count = 18 } = {}) {
    this.#root = createElement('div', 'dust-field');

    for (let i = 0; i < count; i += 1) {
      const mote = createElement('div', 'dust-mote');
      mote.style.setProperty('--mote-x', `${randomRange(0, 100).toFixed(1)}%`);
      mote.style.setProperty('--mote-size', `${randomRange(1.5, 3.5).toFixed(1)}px`);
      mote.style.setProperty('--mote-duration', `${randomRange(22, 48).toFixed(1)}s`);
      mote.style.setProperty('--mote-delay', `${randomRange(-40, 0).toFixed(1)}s`);
      mote.style.setProperty('--mote-drift', `${randomRange(-70, 70).toFixed(0)}px`);
      mote.style.setProperty('--mote-opacity', randomRange(0.08, 0.3).toFixed(2));
      this.#root.appendChild(mote);
    }

    container.appendChild(this.#root);
  }

  destroy() {
    this.#root?.remove();
    this.#root = null;
  }
}
