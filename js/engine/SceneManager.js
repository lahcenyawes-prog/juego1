import { gameEvents } from '../core/EventBus.js';
import { logger } from '../utils/logger.js';
import { fadeTransition } from '../ui/FadeTransition.js';

/**
 * Única autoridad sobre "qué se muestra en pantalla ahora mismo".
 * El menú principal, la introducción y cada habitación son todas
 * "escenas" gestionadas de forma uniforme aquí: registrar una nueva
 * escena es una línea en js/scenes/sceneRegistry.js, nunca hay que
 * tocar este archivo para añadir contenido.
 */
export class SceneManager {
  #root = null;
  #factories = new Map();
  #current = null;
  #currentId = null;
  #isTransitioning = false;

  init(rootElement) {
    this.#root = rootElement;
  }

  /** `factory` es una función sin argumentos que devuelve una nueva instancia de Scene. */
  register(id, factory) {
    this.#factories.set(id, factory);
  }

  has(id) {
    return this.#factories.has(id);
  }

  getCurrentScene() {
    return this.#current;
  }

  getCurrentSceneId() {
    return this.#currentId;
  }

  /**
   * Convierte una coordenada X del mundo (dentro de .scene-world, que
   * se desplaza con la cámara) a una coordenada X de pantalla (para
   * capas de UI como interaction-layer o hud-layer, que no se mueven).
   * Las escenas sin cámara (menú, introducción) devuelven la misma X.
   */
  worldToScreenX(worldX) {
    const offset = this.#current?.camera?.getOffset() ?? 0;
    return worldX - offset;
  }

  async changeScene(id, context = {}) {
    const factory = this.#factories.get(id);
    if (!factory) {
      logger.error(`Escena desconocida: "${id}". ¿Está registrada en sceneRegistry.js?`);
      return;
    }
    if (this.#isTransitioning) return;
    this.#isTransitioning = true;

    // El finally garantiza que un error dentro de una escena nunca
    // deje el gestor bloqueado (isTransitioning colgado en true).
    try {
      await fadeTransition.fadeOut();

      if (this.#current) {
        this.#current.onExit();
        this.#current.element?.remove();
      }

      const nextScene = factory();
      nextScene.onEnter(context);
      this.#root.appendChild(nextScene.element);

      this.#current = nextScene;
      this.#currentId = id;
      gameEvents.emit('scene:changed', { sceneId: id });

      await fadeTransition.fadeIn();
    } catch (error) {
      logger.error(`Error al cambiar a la escena "${id}".`, error);
    } finally {
      this.#isTransitioning = false;
    }
  }

  update(dt) {
    this.#current?.update(dt);
  }
}

export const sceneManager = new SceneManager();
