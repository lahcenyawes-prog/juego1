import { gameEvents } from './EventBus.js';

/**
 * Estado de la partida en curso: dónde está el jugador, qué banderas
 * de historia/puzles están activas y qué fotos ha tomado.
 * No incluye inventario ni ajustes de audio: eso vive en Inventory.js
 * y Settings.js, cada uno con su propia responsabilidad. SaveManager
 * combina todo a la hora de guardar.
 */
export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.currentSceneId = null;
    this.currentFloorId = null;
    this.playerSpawnId = null;
    this.flags = {};
    this.photos = [];
  }

  setFlag(id, value = true) {
    this.flags[id] = value;
    gameEvents.emit('state:flag-changed', { id, value });
  }

  hasFlag(id) {
    return Boolean(this.flags[id]);
  }

  getFlag(id) {
    return this.flags[id];
  }

  recordPhoto(photo) {
    this.photos.push(photo);
  }

  toJSON() {
    return {
      currentSceneId: this.currentSceneId,
      currentFloorId: this.currentFloorId,
      playerSpawnId: this.playerSpawnId,
      flags: { ...this.flags },
      photos: [...this.photos],
    };
  }

  loadFromJSON(data) {
    this.currentSceneId = data.currentSceneId ?? null;
    this.currentFloorId = data.currentFloorId ?? null;
    this.playerSpawnId = data.playerSpawnId ?? null;
    this.flags = { ...(data.flags ?? {}) };
    this.photos = [...(data.photos ?? [])];
  }
}

/** Instancia única: solo existe una partida activa a la vez. */
export const gameState = new GameState();
