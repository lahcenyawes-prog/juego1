/**
 * Bus de eventos genérico (publicar/suscribir). Es el mecanismo principal
 * para que la lógica avise a la interfaz de cambios de estado sin que
 * la lógica necesite conocer el DOM ni a sus oyentes.
 *
 * Convención del proyecto: los nombres de evento usan "dominio:accion"
 * (p. ej. "dialogue:started", "inventory:changed"). La lista completa
 * de eventos usados está documentada en PROJECT_MAP.md.
 */
export class EventBus {
  #listeners = new Map();

  on(event, handler) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set());
    }
    this.#listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  once(event, handler) {
    const unsubscribe = this.on(event, (payload) => {
      unsubscribe();
      handler(payload);
    });
    return unsubscribe;
  }

  off(event, handler) {
    this.#listeners.get(event)?.delete(handler);
  }

  emit(event, payload) {
    this.#listeners.get(event)?.forEach((handler) => handler(payload));
  }

  clear(event) {
    if (event) {
      this.#listeners.delete(event);
    } else {
      this.#listeners.clear();
    }
  }
}

/** Instancia compartida por todo el juego. */
export const gameEvents = new EventBus();
