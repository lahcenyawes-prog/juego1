import { interactionSystem } from '../engine/InteractionSystem.js';
import { createElement } from '../utils/dom.js';

/**
 * Base de cualquier cosa que exista dentro de una escena: el jugador,
 * un personaje, un objeto, una puerta, una luz. Guarda posición y
 * gestiona su propio elemento DOM; todo lo específico (aspecto,
 * verbos disponibles) vive en las subclases de js/entities.
 *
 * Nota de diseño: `config` se recibe aquí y no en la subclase, para
 * que ya esté disponible cuando se llama a `this.createElement()`
 * más abajo (las subclases lo sobrescriben y pueden necesitarlo).
 */
export class Entity {
  constructor({ id, x = 0, y = 0, config = {} }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.config = config;
    this.isInteractable = false;

    this.element = this.createElement();
    this.applyPosition();
    this.element.addEventListener('click', () => this.handleClick());

    // Lo que cuelga de la pared (y > 0) se trata visualmente como "al
    // fondo": sin sombra de contacto y algo atenuado (ver scenes.css).
    if (y > 0) this.element.classList.add('entity--elevated');

    // Etiqueta flotante opcional (zonas del apartamento, rótulos...).
    // Character pone la suya propia con el nombre; el resto usa `label`.
    if (config.label) {
      this.element.appendChild(createElement('div', 'entity-label', { text: config.label }));
    }
  }

  createElement() {
    return createElement('div', 'entity');
  }

  getElement() {
    return this.element;
  }

  setPosition(x, y = this.y) {
    this.x = x;
    this.y = y;
    this.applyPosition();
  }

  applyPosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.bottom = `${this.y}px`;
  }

  handleClick() {
    if (!this.isInteractable) return;
    interactionSystem.requestInteraction(this);
  }

  update(dt) {}

  destroy() {
    this.element?.remove();
  }
}
