import { MUSIC_MANIFEST } from './audioManifest.js';
import { logger } from '../utils/logger.js';

/** Reproduce como mucho una pista de música a la vez, en bucle. */
export class MusicPlayer {
  #audio = null;
  #volume = 1;
  #currentId = null;

  play(id, { loop = true } = {}) {
    if (this.#currentId === id) return;

    const src = MUSIC_MANIFEST[id];
    this.stop();
    if (!src) {
      logger.debug(`Música "${id}" no está en el manifiesto todavía (js/audio/audioManifest.js).`);
      return;
    }

    this.#audio = new Audio(src);
    this.#audio.loop = loop;
    this.#audio.volume = this.#volume;
    this.#currentId = id;
    this.#audio.play().catch((error) => logger.warn(`No se pudo reproducir la música "${id}".`, error));
  }

  stop() {
    this.#audio?.pause();
    this.#audio = null;
    this.#currentId = null;
  }

  setVolume(volume) {
    this.#volume = volume;
    if (this.#audio) this.#audio.volume = volume;
  }
}
