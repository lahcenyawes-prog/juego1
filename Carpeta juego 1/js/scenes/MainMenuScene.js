import { Scene } from '../engine/Scene.js';
import { sceneManager } from '../engine/SceneManager.js';
import { saveManager } from '../save/SaveManager.js';
import { gameState } from '../core/GameState.js';
import { optionsMenu } from '../ui/OptionsMenu.js';
import { audioManager } from '../audio/AudioManager.js';
import { DustField } from '../effects/DustField.js';
import { createElement } from '../utils/dom.js';

/**
 * Pantalla de título: Nueva partida / Continuar / Opciones / Salir.
 * El fondo admite una imagen en assets/ui/menu_background.png (ver
 * .main-menu en css/menu.css); mientras no exista, se ve el degradado
 * de respaldo. Niebla y polvo le dan el movimiento lento.
 */
export class MainMenuScene extends Scene {
  #dustField = null;

  constructor() {
    super('main-menu');
  }

  onEnter(context) {
    super.onEnter(context);
    this.#dustField = new DustField(this.element, { count: 26 });
    audioManager.playMusic('menuTheme');
  }

  onExit() {
    this.#dustField?.destroy();
    this.#dustField = null;
  }

  createElement() {
    const root = createElement('div', 'main-menu');

    root.appendChild(createElement('div', 'main-menu__fog main-menu__fog--far'));
    root.appendChild(createElement('div', 'main-menu__fog main-menu__fog--near'));

    const heading = createElement('div', 'main-menu__heading');
    heading.appendChild(createElement('h1', 'main-menu__title', { text: 'La Última Planta' }));
    heading.appendChild(createElement('p', 'main-menu__subtitle', { text: 'Edificio Meridiano' }));
    root.appendChild(heading);

    const options = createElement('div', 'main-menu__options');
    options.appendChild(this.#buildButton('Nueva partida', () => sceneManager.changeScene('intro')));
    options.appendChild(this.#buildContinueButton());
    options.appendChild(this.#buildButton('Opciones', () => optionsMenu.open()));
    options.appendChild(this.#buildButton('Salir', () => this.#exitGame(root)));
    root.appendChild(options);

    root.appendChild(createElement('div', 'main-menu__version', { text: 'v0.2 — construcción temprana' }));

    return root;
  }

  #buildButton(label, onClick) {
    const button = createElement('button', 'menu-button', { type: 'button', text: label });
    button.addEventListener('mouseenter', () => audioManager.playSfx('uiHover'));
    button.addEventListener('click', () => {
      audioManager.playSfx('uiSelect');
      onClick();
    });
    return button;
  }

  #buildContinueButton() {
    const button = this.#buildButton('Continuar', () => {
      if (!saveManager.load()) return;
      sceneManager.changeScene(gameState.currentSceneId ?? 'apartment');
    });
    button.disabled = !saveManager.hasSave();
    return button;
  }

  #exitGame(root) {
    window.close();
    if (root.querySelector('.main-menu__exit-message')) return;
    root.appendChild(createElement('p', 'main-menu__exit-message', { text: 'Ya puedes cerrar esta pestaña.' }));
  }
}
