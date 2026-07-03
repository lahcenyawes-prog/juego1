import { gameEvents } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { input } from '../core/InputManager.js';

/**
 * Modo cámara de fotos. Solo la estructura por ahora: activar/desactivar
 * y "tomar una foto" quedan registrados, pero no se captura ninguna
 * imagen real todavía (no hay arte que fotografiar). Cuando llegue esa
 * mecánica, `takePhoto()` es el único método que hay que ampliar.
 */
export class PhotoMode {
  #isActive = false;

  init() {
    input.onActionPressed('togglePhotoMode', () => this.toggle());
  }

  get isActive() {
    return this.#isActive;
  }

  toggle() {
    if (this.#isActive) this.disable();
    else this.enable();
  }

  enable() {
    if (this.#isActive) return;
    this.#isActive = true;
    gameEvents.emit('photo:mode-changed', { isActive: true });
  }

  disable() {
    if (!this.#isActive) return;
    this.#isActive = false;
    gameEvents.emit('photo:mode-changed', { isActive: false });
  }

  takePhoto() {
    if (!this.#isActive) return;

    const photo = {
      id: `photo_${Date.now()}`,
      sceneId: gameState.currentSceneId,
      takenAt: new Date().toISOString(),
    };

    gameState.recordPhoto(photo);
    gameEvents.emit('photo:taken', photo);
  }
}

export const photoMode = new PhotoMode();
