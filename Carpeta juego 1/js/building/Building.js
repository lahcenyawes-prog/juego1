import { Floor } from './Floor.js';

/**
 * Modelo del edificio: qué plantas existen, cuáles están desbloqueadas
 * y a qué escena lleva cada una. Es una única instancia compartida
 * porque solo hay un edificio en la partida.
 */
export class Building {
  #floors = new Map();

  loadFloors(definitions) {
    this.#floors.clear();
    for (const definition of definitions) {
      this.#floors.set(definition.id, new Floor(definition));
    }
  }

  getFloor(id) {
    return this.#floors.get(id);
  }

  getAllFloors() {
    return [...this.#floors.values()].sort((a, b) => a.number - b.number);
  }

  isUnlocked(id) {
    return Boolean(this.#floors.get(id)?.unlocked);
  }

  unlockFloor(id) {
    const floor = this.#floors.get(id);
    if (floor) floor.unlocked = true;
  }
}

export const building = new Building();
