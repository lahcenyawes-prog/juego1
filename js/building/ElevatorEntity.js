import { Entity } from '../entities/Entity.js';
import { Verb, toActions } from '../engine/Interactable.js';
import { createElement } from '../utils/dom.js';
import { dialogueManager } from '../dialogue/DialogueManager.js';
import { gameEvents } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { building } from './Building.js';
import { elevatorPanel } from './ElevatorPanel.js';
import { elevator, ElevatorState } from './Elevator.js';

/**
 * Representación física del ascensor dentro de una escena: las puertas
 * que se deslizan y el pequeño indicador de planta sobre ellas. El
 * estado real (abierto/cerrado/en marcha) lo lleva Elevator.js; esta
 * entidad solo lo refleja.
 */
export class ElevatorEntity extends Entity {
  #unsubscribers = [];

  constructor(config) {
    super({ id: config.id, x: config.x, y: config.y ?? 0, config });
    this.isInteractable = true;

    // Se localiza tras super(): createElement se ejecuta durante la
    // construcción de la base, cuando los campos de esta clase todavía
    // no existen, así que no puede guardar referencias en ellos.
    this.displayEl = this.element.querySelector('.elevator-doors__display');

    this.#syncDoors(elevator.state);
    this.#renderFloorNumber();

    this.#unsubscribers.push(
      gameEvents.on('elevator:state-changed', ({ state }) => this.#syncDoors(state)),
      gameEvents.on('elevator:moving', ({ toNumber }) => this.#showMoving(toNumber)),
      gameEvents.on('elevator:arrived', ({ number }) => this.#showArrived(number))
    );
  }

  createElement() {
    const el = createElement('div', 'entity entity--interactive entity--door elevator-doors');

    el.appendChild(createElement('div', 'elevator-doors__display'));

    const frame = createElement('div', 'elevator-doors__frame');
    frame.appendChild(createElement('div', 'elevator-doors__panel'));
    frame.appendChild(createElement('div', 'elevator-doors__panel'));
    el.appendChild(frame);

    return el;
  }

  getAvailableActions() {
    return toActions([Verb.USE, Verb.EXAMINE]);
  }

  interact(verb) {
    if (verb === Verb.USE) {
      if (elevator.isMoving) {
        dialogueManager.showExamine('El indicador parpadea. La cabina está en otra parte.');
      } else {
        elevatorPanel.open();
      }
    } else if (verb === Verb.EXAMINE) {
      dialogueManager.showExamine(this.config.examineText ?? 'Un viejo ascensor.');
    }
  }

  destroy() {
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.#unsubscribers = [];
    super.destroy();
  }

  #syncDoors(state) {
    this.element.classList.toggle('is-open', state === ElevatorState.OPEN);
  }

  #showMoving(toNumber) {
    this.displayEl.classList.add('is-moving');
    this.displayEl.textContent = `▸ ${toNumber}`;
  }

  #showArrived(number) {
    this.displayEl.classList.remove('is-moving');
    this.displayEl.textContent = String(number);
  }

  #renderFloorNumber() {
    const floor = building.getFloor(gameState.currentFloorId);
    this.displayEl.textContent = floor ? String(floor.number) : '—';
  }
}
