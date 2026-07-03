import { gameEvents } from '../core/EventBus.js';
import { interactionSystem } from '../engine/InteractionSystem.js';
import { createElement, clearElement } from '../utils/dom.js';
import { getEntityAnchor } from './entityAnchor.js';

/**
 * Menú contextual de verbos (Examinar / Hablar / Abrir / Cerrar / Usar)
 * que aparece flotando sobre la entidad enfocada. Se cierra solo si el
 * jugador se aleja (interaction:focus-changed) o tras ejecutar un verbo.
 */
class InteractionMenu {
  #element = null;

  init(rootElement) {
    this.#element = createElement('div', 'interaction-menu hidden');
    rootElement.appendChild(this.#element);

    gameEvents.on('interaction:menu-open', ({ entity, actions }) => this.#open(entity, actions));
    gameEvents.on('interaction:menu-closed', () => this.#close());
    gameEvents.on('interaction:focus-changed', () => this.#close());
  }

  #open(entity, actions) {
    clearElement(this.#element);

    for (const action of actions) {
      const button = createElement('button', 'interaction-menu__option', { text: action.label });
      button.addEventListener('click', () => interactionSystem.interact(entity, action.verb));
      this.#element.appendChild(button);
    }

    const anchor = getEntityAnchor(entity);
    this.#element.style.left = `${anchor.left}px`;
    this.#element.style.bottom = `${anchor.bottom}px`;
    this.#element.classList.remove('hidden');
  }

  #close() {
    this.#element.classList.add('hidden');
  }
}

export const interactionMenu = new InteractionMenu();
