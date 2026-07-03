import { KEY_BINDINGS } from './Config.js';

/**
 * Traduce teclas físicas a acciones lógicas ("moveLeft", "interact"...).
 * El resto del juego nunca debe comparar contra un KeyboardEvent.code
 * directamente: así los controles se pueden remapear en un único sitio
 * (Config.js) sin tocar la lógica de juego.
 */
export class InputManager {
  #keysDown = new Set();
  #actionPressHandlers = new Map();
  #enabled = true;

  init() {
    window.addEventListener('keydown', this.#handleKeyDown);
    window.addEventListener('keyup', this.#handleKeyUp);
  }

  /** Desactiva la entrada de juego (útil mientras un menú tiene el foco). */
  setEnabled(enabled) {
    this.#enabled = enabled;
    if (!enabled) this.#keysDown.clear();
  }

  isActionDown(action) {
    if (!this.#enabled) return false;
    const codes = KEY_BINDINGS[action] ?? [];
    return codes.some((code) => this.#keysDown.has(code));
  }

  /** Se ejecuta una sola vez, en el instante en que se pulsa la acción. */
  onActionPressed(action, handler) {
    if (!this.#actionPressHandlers.has(action)) {
      this.#actionPressHandlers.set(action, new Set());
    }
    this.#actionPressHandlers.get(action).add(handler);
    return () => this.#actionPressHandlers.get(action)?.delete(handler);
  }

  #handleKeyDown = (event) => {
    if (this.#keysDown.has(event.code)) return; // evitar auto-repeat
    this.#keysDown.add(event.code);
    if (!this.#enabled) return;

    for (const [action, codes] of Object.entries(KEY_BINDINGS)) {
      if (codes.includes(event.code)) {
        this.#actionPressHandlers.get(action)?.forEach((handler) => handler());
      }
    }
  };

  #handleKeyUp = (event) => {
    this.#keysDown.delete(event.code);
  };
}

export const input = new InputManager();
