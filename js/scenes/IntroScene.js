import { Scene } from '../engine/Scene.js';
import { sceneManager } from '../engine/SceneManager.js';
import { input } from '../core/InputManager.js';
import { createElement } from '../utils/dom.js';

const INTRO_LINES = [
  'Llevas tres noches sin dormir bien.',
  'El edificio Meridiano lleva más tiempo del que recuerdas siendo tu casa.',
  'Esta noche, algo en el pasillo suena distinto.',
];

/** Texto narrado de introducción. Avanza con un clic o con la tecla de interacción. */
export class IntroScene extends Scene {
  #lineIndex = -1;
  #lineEl = null;
  #unsubscribeInput = null;

  constructor() {
    super('intro');
  }

  onEnter(context) {
    super.onEnter(context);
    this.#lineIndex = -1;
    this.#unsubscribeInput = input.onActionPressed('interact', () => this.#advance());
    this.#advance();
  }

  onExit() {
    this.#unsubscribeInput?.();
    this.#unsubscribeInput = null;
  }

  createElement() {
    const root = createElement('div', 'intro-scene');
    this.#lineEl = createElement('p', 'intro-scene__line');
    root.appendChild(this.#lineEl);
    root.appendChild(createElement('div', 'intro-scene__skip', { text: 'Pulsa para continuar' }));

    root.addEventListener('click', () => this.#advance());
    return root;
  }

  #advance() {
    this.#lineIndex += 1;

    if (this.#lineIndex >= INTRO_LINES.length) {
      sceneManager.changeScene('apartment');
      return;
    }

    this.#lineEl.classList.remove('is-visible');
    this.#lineEl.textContent = INTRO_LINES[this.#lineIndex];

    // Doble rAF: garantiza que el navegador pinte el estado "invisible"
    // antes de reactivar la clase, para que la transición CSS se note.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.#lineEl.classList.add('is-visible'));
    });
  }
}
