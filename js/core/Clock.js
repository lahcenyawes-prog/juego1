/**
 * Envoltorio de requestAnimationFrame que calcula el delta time en
 * segundos y protege al resto del motor de saltos enormes (p. ej. si
 * la pestaña estuvo en segundo plano).
 */
export class Clock {
  #rafId = null;
  #lastTime = 0;
  #onTick = null;

  start(onTick) {
    this.#onTick = onTick;
    this.#lastTime = performance.now();
    this.#rafId = requestAnimationFrame(this.#tick);
  }

  stop() {
    if (this.#rafId !== null) cancelAnimationFrame(this.#rafId);
    this.#rafId = null;
  }

  #tick = (now) => {
    const rawDelta = (now - this.#lastTime) / 1000;
    this.#lastTime = now;
    const dt = Math.min(rawDelta, 0.1); // evita saltos tras pausas largas

    this.#onTick?.(dt);
    this.#rafId = requestAnimationFrame(this.#tick);
  };
}
