import { gameEvents } from '../core/EventBus.js';
import { inventoryUI } from '../inventory/InventoryUI.js';
import { createElement } from '../utils/dom.js';
import { getEntityAnchor } from './entityAnchor.js';

const TOAST_DURATION_MS = 2200;

/** Interfaz permanente: aviso de "puedes interactuar aquí", botón de inventario y notificaciones cortas. */
class HUD {
  #element = null;
  #promptEl = null;
  #toastEl = null;
  #toastTimeout = null;
  #focusedEntity = null;
  #isMenuOpen = false;

  init(rootElement) {
    this.#element = createElement('div', 'hud');

    this.#promptEl = createElement('div', 'hud__prompt', { text: 'Pulsar E' });
    this.#element.appendChild(this.#promptEl);

    const inventoryButton = createElement('button', 'hud__inventory-button', { text: 'Bolsa', type: 'button' });
    inventoryButton.addEventListener('click', () => inventoryUI.toggle());
    this.#element.appendChild(inventoryButton);

    this.#toastEl = createElement('div', 'hud__toast');
    this.#element.appendChild(this.#toastEl);

    rootElement.appendChild(this.#element);

    gameEvents.on('interaction:focus-changed', ({ entity }) => {
      this.#focusedEntity = entity;
      this.#refreshPrompt();
    });
    // El menú contextual flota justo en el mismo sitio que este aviso:
    // se ocultan mutuamente para no solaparse.
    gameEvents.on('interaction:menu-open', () => {
      this.#isMenuOpen = true;
      this.#refreshPrompt();
    });
    gameEvents.on('interaction:menu-closed', () => {
      this.#isMenuOpen = false;
      this.#refreshPrompt();
    });
    gameEvents.on('game:saved', () => this.showToast('Partida guardada'));
  }

  showToast(message) {
    this.#toastEl.textContent = message;
    this.#toastEl.classList.add('is-visible');
    clearTimeout(this.#toastTimeout);
    this.#toastTimeout = setTimeout(() => this.#toastEl.classList.remove('is-visible'), TOAST_DURATION_MS);
  }

  #refreshPrompt() {
    if (!this.#focusedEntity || this.#isMenuOpen) {
      this.#promptEl.classList.remove('is-visible');
      return;
    }

    const anchor = getEntityAnchor(this.#focusedEntity);
    this.#promptEl.style.left = `${anchor.left}px`;
    this.#promptEl.style.bottom = `${anchor.bottom}px`;
    this.#promptEl.classList.add('is-visible');
  }
}

export const hud = new HUD();
