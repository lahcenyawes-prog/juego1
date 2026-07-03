import { gameEvents } from '../core/EventBus.js';
import { CONFIG } from '../core/Config.js';

/**
 * Inventario del jugador: huecos fijos, sin apilado ni categorías por
 * ahora. Solo hay un inventario en la partida, de ahí el singleton.
 */
export class Inventory {
  constructor(size = CONFIG.INVENTORY_SIZE) {
    this.size = size;
    this.slots = new Array(size).fill(null);
  }

  addItem(item) {
    const emptyIndex = this.slots.findIndex((slot) => slot === null);
    if (emptyIndex === -1) return false;

    this.slots[emptyIndex] = item;
    this.#notify();
    return true;
  }

  removeItem(slotIndex) {
    const item = this.slots[slotIndex] ?? null;
    if (!item) return null;

    this.slots[slotIndex] = null;
    this.#notify();
    return item;
  }

  hasItem(itemId) {
    return this.slots.some((slot) => slot?.id === itemId);
  }

  getSlots() {
    return [...this.slots];
  }

  reset() {
    this.slots = new Array(this.size).fill(null);
    this.#notify();
  }

  /** Sustituye el contenido entero, hueco a hueco (usado por SaveManager al cargar). */
  loadSlots(items) {
    this.slots = new Array(this.size).fill(null).map((_, index) => items[index] ?? null);
    this.#notify();
  }

  #notify() {
    gameEvents.emit('inventory:changed', { slots: this.getSlots() });
  }
}

export const inventory = new Inventory();
