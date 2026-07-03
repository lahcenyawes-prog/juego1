import { gameEvents } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { building } from './Building.js';
import { sceneManager } from '../engine/SceneManager.js';
import { audioManager } from '../audio/AudioManager.js';
import { cameraFX } from '../effects/CameraFX.js';

export const ElevatorState = Object.freeze({
  CLOSED: 'closed',
  OPEN: 'open',
  MOVING: 'moving',
});

// Tiempos de la coreografía de viaje. DOOR_CLOSE_MS debe dar margen a
// la transición de puertas (--duration-slow en variables.css).
const DOOR_CLOSE_MS = 950;
const TRAVEL_BASE_MS = 1100;
const TRAVEL_PER_FLOOR_MS = 320;
const DOORS_OPEN_AT_ARRIVAL_MS = 1700;

/**
 * Estado y reglas del ascensor: qué plantas se pueden pedir y la
 * secuencia completa de un viaje (cerrar puertas → marcha con duración
 * proporcional a la distancia → ding → cambio de escena → puertas
 * abiertas un instante). La interfaz (ElevatorPanel) y la entidad
 * física (ElevatorEntity) solo reaccionan a sus eventos.
 */
export class Elevator {
  constructor() {
    this.state = ElevatorState.CLOSED;
  }

  get isMoving() {
    return this.state === ElevatorState.MOVING;
  }

  open() {
    if (this.state !== ElevatorState.CLOSED) return;
    this.#setState(ElevatorState.OPEN);
    audioManager.playSfx('elevatorOpen');
  }

  close() {
    if (this.state !== ElevatorState.OPEN) return;
    this.#setState(ElevatorState.CLOSED);
    audioManager.playSfx('elevatorClose');
  }

  requestFloor(floorId) {
    if (this.isMoving) return;

    const floor = building.getFloor(floorId);
    const isCurrentFloor = floorId === gameState.currentFloorId;

    if (!floor || !floor.unlocked || !floor.sceneId || isCurrentFloor) {
      gameEvents.emit('elevator:floor-denied', { floorId });
      return;
    }

    this.#travelTo(floor);
  }

  #travelTo(floor) {
    const fromNumber = building.getFloor(gameState.currentFloorId)?.number ?? floor.number;
    const travelMs = TRAVEL_BASE_MS + Math.abs(floor.number - fromNumber) * TRAVEL_PER_FLOOR_MS;

    this.#setState(ElevatorState.MOVING);
    audioManager.playSfx('elevatorClose');

    setTimeout(() => {
      audioManager.playSfx('elevatorMove');
      gameEvents.emit('elevator:moving', { fromNumber, toNumber: floor.number });

      setTimeout(() => this.#arriveAt(floor), travelMs);
    }, DOOR_CLOSE_MS);
  }

  async #arriveAt(floor) {
    audioManager.playSfx('elevatorDing');
    cameraFX.shake('soft');

    await sceneManager.changeScene(floor.sceneId, { spawnId: 'elevator' });

    // La escena nueva ya contiene su propio ascensor: abre las puertas
    // un instante para "dejar salir" al jugador y luego las cierra.
    this.#setState(ElevatorState.OPEN);
    gameEvents.emit('elevator:arrived', { floorId: floor.id, number: floor.number });
    setTimeout(() => this.close(), DOORS_OPEN_AT_ARRIVAL_MS);
  }

  #setState(state) {
    this.state = state;
    gameEvents.emit('elevator:state-changed', { state });
  }
}

export const elevator = new Elevator();
