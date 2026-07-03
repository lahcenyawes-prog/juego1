import { gameEvents } from '../core/EventBus.js';
import { CONFIG } from '../core/Config.js';
import { input } from '../core/InputManager.js';
import { distance } from '../utils/math.js';
import { dialogueManager } from '../dialogue/DialogueManager.js';

/**
 * Decide con qué entidad puede interactuar el jugador en cada momento
 * y qué verbos ofrecerle. No sabe nada de diálogos, inventario ni
 * puertas: solo pide a la entidad su lista de acciones y le delega la
 * ejecución. Así, cualquier entidad interactiva nueva funciona aquí
 * sin tocar este archivo.
 */
export class InteractionSystem {
  #scene = null;
  #focused = null;

  init() {
    input.onActionPressed('interact', () => this.#handleInteractPressed());

    // GameplayScene deja de llamar a update() mientras hay diálogo activo,
    // así que el foco anterior queda obsoleto: se limpia aquí para que,
    // al terminar el diálogo, update() lo recalcule y vuelva a emitir
    // interaction:focus-changed aunque el jugador no se haya movido.
    gameEvents.on('dialogue:started', () => this.#setFocused(null));
  }

  setScene(scene) {
    this.#setFocused(null);
    this.#scene = scene;
  }

  update(dt, player) {
    if (!this.#scene || !player) return;

    let nearest = null;
    let nearestDistance = Infinity;

    for (const entity of this.#scene.getInteractableEntities()) {
      const d = distance(player.x, entity.x);
      if (d <= CONFIG.INTERACTION_RANGE && d < nearestDistance) {
        nearest = entity;
        nearestDistance = d;
      }
    }

    if (nearest !== this.#focused) this.#setFocused(nearest);
  }

  /** Punto de entrada cuando se hace clic directamente sobre una entidad. */
  requestInteraction(entity) {
    if (entity !== this.#focused) return;
    this.#openMenuFor(entity);
  }

  /** Ejecuta un verbo concreto sobre una entidad (llamado por InteractionMenu). */
  interact(entity, verb) {
    gameEvents.emit('interaction:menu-closed');
    entity.interact(verb);
  }

  #handleInteractPressed() {
    if (dialogueManager.isActive || !this.#focused) return;
    this.#openMenuFor(this.#focused);
  }

  #openMenuFor(entity) {
    const actions = entity.getAvailableActions();
    if (actions.length === 0) return;

    if (actions.length === 1) {
      this.interact(entity, actions[0].verb);
      return;
    }

    gameEvents.emit('interaction:menu-open', { entity, actions });
  }

  #setFocused(entity) {
    this.#focused?.getElement().classList.remove('is-focused');
    this.#focused = entity ?? null;
    this.#focused?.getElement().classList.add('is-focused');
    gameEvents.emit('interaction:focus-changed', { entity: this.#focused });
  }
}

export const interactionSystem = new InteractionSystem();
