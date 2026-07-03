import { createElement } from '../utils/dom.js';

/**
 * Clase base de cualquier "pantalla" del juego (menú, introducción,
 * una habitación...). SceneManager solo conoce este contrato: no le
 * importa si por dentro hay un mundo con jugador o un simple texto.
 *
 * Para escenas jugables (con jugador, cámara y entidades), extiende
 * GameplayScene en lugar de esta clase directamente.
 */
export class Scene {
  constructor(id) {
    this.id = id;
    this.element = null;
  }

  /** Se llama justo antes de mostrarse. `context` trae datos de la transición (p. ej. spawnId). */
  onEnter(context = {}) {
    this.element = this.createElement();
  }

  /** Se llama justo antes de destruirse. Libera listeners, temporizadores, sonidos, etc. */
  onExit() {}

  /** Se llama una vez por frame mientras esta escena está activa. */
  update(dt) {}

  createElement() {
    return createElement('div', 'scene');
  }
}
