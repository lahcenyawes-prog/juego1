import { gameEvents } from '../core/EventBus.js';
import { input } from '../core/InputManager.js';
import { inventory } from './Inventory.js';
import { dialogueManager } from '../dialogue/DialogueManager.js';
import { createElement } from '../utils/dom.js';

/**
 * Representación visual de los 6 huecos. Se abre/cierra con la tecla
 * de inventario (ver Config.KEY_BINDINGS.toggleInventory). Sin
 * objetos que mostrar todavía, pero completamente funcional.
 */
class InventoryUI {
  #element = null;
  #slotElements = [];
  #isOpen = false;

  init(rootElement) {
    this.#element = createElement('div', 'inventory-panel');

    inventory.getSlots().forEach((_, index) => {
      const slot = createElement('button', 'inventory-slot', { type: 'button' });
      slot.addEventListener('click', () => this.#handleSlotClick(index));
      this.#slotElements.push(slot);
      this.#element.appendChild(slot);
    });

    rootElement.appendChild(this.#element);

    gameEvents.on('inventory:changed', ({ slots }) => this.#render(slots));
    input.onActionPressed('toggleInventory', () => this.toggle());

    this.#render(inventory.getSlots());
  }

  toggle() {
    this.#isOpen = !this.#isOpen;
    this.#element.classList.toggle('is-visible', this.#isOpen);
  }

  #render(slots) {
    slots.forEach((item, index) => {
      const slotEl = this.#slotElements[index];
      slotEl.classList.toggle('is-filled', Boolean(item));
      slotEl.textContent = item ? item.name.charAt(0).toUpperCase() : '';
      slotEl.title = item ? item.name : `Hueco ${index + 1} (vacío)`;
    });
  }

  #handleSlotClick(index) {
    const item = inventory.getSlots()[index];
    if (!item) return;

    gameEvents.emit('inventory:slot-clicked', { item, index });

    // Examinar el objeto: cierra el panel para que se lea el texto.
    this.#isOpen = false;
    this.#element.classList.remove('is-visible');
    dialogueManager.showExamine(`${item.name} — ${item.description}`);
  }
}

export const inventoryUI = new InventoryUI();
