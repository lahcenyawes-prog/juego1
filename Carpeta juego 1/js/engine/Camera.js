import { clamp, lerp } from '../utils/math.js';

/**
 * Cámara horizontal simple: sigue a un objetivo (normalmente el
 * jugador) suavizando el movimiento y sin salirse de los límites del
 * mundo de la escena. Cada GameplayScene crea la suya propia porque
 * los límites dependen del ancho de esa escena.
 */
export class Camera {
  constructor(viewportWidth) {
    this.viewportWidth = viewportWidth;
    this.target = null;
    this.minOffset = 0;
    this.maxOffset = 0;
    this.offset = 0;
    this.followSpeed = 6;
    // La cámara adelanta ligeramente la vista hacia donde mira el
    // objetivo; el lerp de update() convierte el salto en deriva suave.
    this.lookAhead = 42;
  }

  follow(target) {
    this.target = target;
  }

  setBounds(min, max) {
    this.minOffset = min;
    this.maxOffset = Math.max(min, max);
  }

  /** Coloca la cámara sobre el objetivo sin transición, para la entrada a la escena. */
  snapToTarget() {
    if (!this.target) return;
    this.offset = this.#desiredOffset();
  }

  update(dt) {
    if (!this.target) return;
    this.offset = lerp(this.offset, this.#desiredOffset(), Math.min(this.followSpeed * dt, 1));
  }

  getOffset() {
    return this.offset;
  }

  #desiredOffset() {
    const ahead = this.target.facing === 'left' ? -this.lookAhead : this.lookAhead;
    return clamp(this.target.x + ahead - this.viewportWidth / 2, this.minOffset, this.maxOffset);
  }
}
