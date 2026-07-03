import { CONFIG } from './Config.js';
import { Clock } from './Clock.js';
import { initViewportScaling } from './ViewportScaler.js';
import { input } from './InputManager.js';
import { settings } from './Settings.js';
import { sceneManager } from '../engine/SceneManager.js';
import { interactionSystem } from '../engine/InteractionSystem.js';
import { animationSystem } from '../engine/AnimationSystem.js';
import { uiManager } from '../ui/UIManager.js';
import { audioManager } from '../audio/AudioManager.js';
import { photoMode } from '../photo/PhotoMode.js';
import { building } from '../building/Building.js';
import { cameraFX } from '../effects/CameraFX.js';
import { registerScenes } from '../scenes/sceneRegistry.js';
import { FLOORS } from '../../data/floors.js';

/**
 * Punto de ensamblaje del juego. No contiene lógica de juego en sí:
 * únicamente arranca los sistemas en el orden correcto y conecta cada
 * uno con su porción del DOM. Cualquier sistema nuevo (motor de
 * puzles, créditos, lo que sea) se registra aquí, una vez.
 */
export class Game {
  #clock = new Clock();

  init() {
    const stage = document.getElementById('game-stage');
    initViewportScaling(stage, CONFIG.VIEWPORT_WIDTH, CONFIG.VIEWPORT_HEIGHT);

    input.init();
    settings.load();
    audioManager.init();
    interactionSystem.init();
    photoMode.init();
    building.loadFloors(FLOORS);
    cameraFX.init(document.getElementById('game-root'));

    uiManager.init({
      hud: document.getElementById('hud-layer'),
      interaction: document.getElementById('interaction-layer'),
      dialogue: document.getElementById('dialogue-layer'),
      inventory: document.getElementById('inventory-layer'),
      elevator: document.getElementById('elevator-layer'),
      puzzle: document.getElementById('puzzle-layer'),
      photo: document.getElementById('photo-layer'),
      menu: document.getElementById('menu-layer'),
      transition: document.getElementById('transition-layer'),
    });

    sceneManager.init(document.getElementById('scene-layer'));
    registerScenes(sceneManager);

    if (CONFIG.DEBUG) {
      window.game = this;
    }
  }

  start() {
    // Atajo de desarrollo: ?scene=apartment arranca directamente en esa
    // escena, saltándose el menú. Solo para probar; no afecta al juego.
    const requestedScene = new URLSearchParams(window.location.search).get('scene');
    const startScene = requestedScene && sceneManager.has(requestedScene) ? requestedScene : 'main-menu';

    sceneManager.changeScene(startScene);
    this.#clock.start(this.#update);
  }

  #update = (dt) => {
    sceneManager.update(dt);
    animationSystem.update(dt);
  };
}
