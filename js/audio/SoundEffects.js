import { SFX_MANIFEST, AMBIENT_MANIFEST } from './audioManifest.js';
import { logger } from '../utils/logger.js';

/** Efectos puntuales (un disparo y se olvida) y el sonido ambiental en bucle de la escena actual. */
export class SoundEffects {
  #volume = 1;
  #ambientAudio = null;
  #ambientId = null;

  play(id) {
    const src = SFX_MANIFEST[id];
    if (!src) {
      logger.debug(`Efecto "${id}" no está en el manifiesto todavía (js/audio/audioManifest.js).`);
      return;
    }

    const audio = new Audio(src);
    audio.volume = this.#volume;
    audio.play().catch((error) => logger.warn(`No se pudo reproducir el efecto "${id}".`, error));
  }

  playAmbient(id) {
    if (this.#ambientId === id) return;

    const src = AMBIENT_MANIFEST[id];
    this.stopAmbient();
    if (!src) {
      logger.debug(`Ambiente "${id}" no está en el manifiesto todavía (js/audio/audioManifest.js).`);
      return;
    }

    this.#ambientAudio = new Audio(src);
    this.#ambientAudio.loop = true;
    this.#ambientAudio.volume = this.#volume;
    this.#ambientId = id;
    this.#ambientAudio.play().catch((error) => logger.warn(`No se pudo reproducir el ambiente "${id}".`, error));
  }

  stopAmbient() {
    this.#ambientAudio?.pause();
    this.#ambientAudio = null;
    this.#ambientId = null;
  }

  setVolume(volume) {
    this.#volume = volume;
    if (this.#ambientAudio) this.#ambientAudio.volume = volume;
  }
}
