import { randomRange } from '../utils/math.js';
import { audioManager } from '../audio/AudioManager.js';

/**
 * Director de "vida" ambiental de una escena: a intervalos aleatorios
 * hace parpadear la iluminación general (clase .is-flickering, ver
 * effects.css) y, de vez en cuando, acompaña el parpadeo con un golpe
 * lejano ('distantKnock' en el manifiesto de audio — silencioso hasta
 * que exista el archivo).
 *
 * Se activa por escena con el campo `ambientFlicker: true` de su
 * archivo de datos (ver data/scenes/floor9Data.js).
 */
export class AmbientFlicker {
  #sceneElement = null;
  #timer = null;

  start(sceneElement) {
    this.#sceneElement = sceneElement;
    this.#scheduleNext();
  }

  stop() {
    clearTimeout(this.#timer);
    this.#timer = null;
    this.#sceneElement = null;
  }

  #scheduleNext() {
    this.#timer = setTimeout(() => this.#flicker(), randomRange(7000, 19000));
  }

  #flicker() {
    if (!this.#sceneElement) return;

    const blinks = Math.random() < 0.35 ? 2 : 1;
    this.#blink(blinks);

    if (Math.random() < 0.25) audioManager.playSfx('distantKnock');
    this.#scheduleNext();
  }

  #blink(remaining) {
    if (!this.#sceneElement || remaining <= 0) return;
    this.#sceneElement.classList.add('is-flickering');
    setTimeout(() => {
      this.#sceneElement?.classList.remove('is-flickering');
      setTimeout(() => this.#blink(remaining - 1), randomRange(60, 140));
    }, randomRange(70, 150));
  }
}
