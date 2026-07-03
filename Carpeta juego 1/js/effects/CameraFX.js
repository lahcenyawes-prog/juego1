/**
 * Sacudidas y pulsos de cámara. Aplica clases de animación CSS sobre
 * #game-root (nunca sobre #game-stage: su transform inline de escalado
 * no debe pisarse con una animación).
 *
 * Uso: cameraFX.shake('soft' | 'strong'), cameraFX.zoomPulse().
 */
const SHAKE_CLASSES = { soft: 'fx-shake-soft', strong: 'fx-shake-strong' };
const ALL_FX_CLASSES = [...Object.values(SHAKE_CLASSES), 'fx-zoom-pulse'];

class CameraFX {
  #root = null;

  init(rootElement) {
    this.#root = rootElement;
  }

  shake(intensity = 'soft') {
    this.#play(SHAKE_CLASSES[intensity] ?? SHAKE_CLASSES.soft);
  }

  zoomPulse() {
    this.#play('fx-zoom-pulse');
  }

  #play(className) {
    if (!this.#root) return;
    this.#root.classList.remove(...ALL_FX_CLASSES);
    void this.#root.offsetWidth; // permite relanzar la misma animación
    this.#root.classList.add(className);
    this.#root.addEventListener(
      'animationend',
      () => this.#root.classList.remove(className),
      { once: true }
    );
  }
}

export const cameraFX = new CameraFX();
