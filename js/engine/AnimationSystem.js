import { Tween } from './Tween.js';

/**
 * Registro central de animaciones activas (Tweens). Cualquier sistema
 * puede pedir `animationSystem.animate(...)` para animar un valor sin
 * tener que gestionar su propio bucle de actualización.
 *
 * Todavía ningún sistema de la v1 lo necesita (los fundidos usan
 * transiciones CSS), pero está conectado al bucle principal en
 * Game.js y listo para usarse: por ejemplo, para mover un objeto en
 * un futuro puzle, o para un temblor de cámara.
 */
export class AnimationSystem {
  #tweens = new Set();

  animate(options) {
    const tween = new Tween(options);
    this.#tweens.add(tween);
    return tween;
  }

  update(dt) {
    for (const tween of this.#tweens) {
      tween.update(dt);
      if (tween.isFinished) this.#tweens.delete(tween);
    }
  }

  clear() {
    this.#tweens.clear();
  }
}

export const animationSystem = new AnimationSystem();
