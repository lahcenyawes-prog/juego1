const EASINGS = {
  linear: (t) => t,
  easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2),
};

/**
 * Interpola un único valor numérico entre `from` y `to` en `duration`
 * segundos. No toca el DOM directamente: el llamador decide qué hacer
 * con el valor en `onUpdate`. Gestionado por AnimationSystem.
 */
export class Tween {
  constructor({ from, to, duration, easing = 'linear', onUpdate, onComplete }) {
    this.from = from;
    this.to = to;
    this.duration = Math.max(duration, 0.001);
    this.easing = EASINGS[easing] ?? EASINGS.linear;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
    this.elapsed = 0;
    this.isFinished = false;
  }

  update(dt) {
    if (this.isFinished) return;

    this.elapsed += dt;
    const t = Math.min(this.elapsed / this.duration, 1);
    const value = this.from + (this.to - this.from) * this.easing(t);
    this.onUpdate?.(value);

    if (t >= 1) {
      this.isFinished = true;
      this.onComplete?.();
    }
  }
}
