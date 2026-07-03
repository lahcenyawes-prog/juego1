import { building } from './Building.js';
import { elevator, ElevatorState } from './Elevator.js';
import { gameState } from '../core/GameState.js';
import { gameEvents } from '../core/EventBus.js';
import { createElement, clearElement } from '../utils/dom.js';

/**
 * Panel modal de selección de planta. Las plantas bloqueadas se
 * muestran (no se ocultan) pero al pulsarlas el ascensor las rechaza:
 * es más elocuente para la atmósfera del edificio que un simple botón
 * deshabilitado. Ver Elevator.requestFloor().
 */
class ElevatorPanel {
  #root = null;
  #element = null;
  #indicatorEl = null;
  #floorsContainer = null;
  #buttonsByFloorId = new Map();

  init(rootElement) {
    this.#root = rootElement;
    this.#element = createElement('div', 'elevator-panel');

    const cabinet = createElement('div', 'elevator-panel__cabinet');
    cabinet.appendChild(createElement('div', 'elevator-panel__title', { text: 'Selecciona una planta' }));

    this.#indicatorEl = createElement('div', 'elevator-panel__indicator');
    cabinet.appendChild(this.#indicatorEl);

    this.#floorsContainer = createElement('div', 'elevator-panel__floors');
    cabinet.appendChild(this.#floorsContainer);

    const closeButton = createElement('button', 'elevator-panel__close', { text: 'Cerrar puertas' });
    closeButton.addEventListener('click', () => this.close());
    cabinet.appendChild(closeButton);

    this.#element.appendChild(cabinet);
    this.#root.appendChild(this.#element);

    gameEvents.on('elevator:floor-denied', ({ floorId }) => this.#flashDenied(floorId));

    // El viaje empieza: el panel se aparta sin tocar el estado del
    // ascensor (elevator.close() solo actúa desde OPEN, no desde MOVING).
    gameEvents.on('elevator:state-changed', ({ state }) => {
      if (state === ElevatorState.MOVING) this.#element.classList.remove('is-visible');
    });
  }

  open() {
    elevator.open();
    this.#render();
    this.#element.classList.add('is-visible');
  }

  close() {
    elevator.close();
    this.#element.classList.remove('is-visible');
  }

  #render() {
    const currentFloor = building.getFloor(gameState.currentFloorId);
    this.#indicatorEl.textContent = currentFloor ? `— Planta ${currentFloor.number} —` : '— · —';

    clearElement(this.#floorsContainer);
    this.#buttonsByFloorId.clear();

    for (const floor of building.getAllFloors()) {
      const button = createElement('button', 'elevator-floor-button', { text: String(floor.number) });
      button.classList.toggle('is-current', floor.id === gameState.currentFloorId);
      button.classList.toggle('is-locked', !floor.unlocked);
      button.addEventListener('click', () => elevator.requestFloor(floor.id));

      this.#buttonsByFloorId.set(floor.id, button);
      this.#floorsContainer.appendChild(button);
    }
  }

  #flashDenied(floorId) {
    const button = this.#buttonsByFloorId.get(floorId);
    if (!button) return;
    button.classList.remove('is-denied');
    void button.offsetWidth; // fuerza el reflow para poder repetir la animación
    button.classList.add('is-denied');
  }
}

export const elevatorPanel = new ElevatorPanel();
