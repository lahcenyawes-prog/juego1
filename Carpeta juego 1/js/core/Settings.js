import { CONFIG } from './Config.js';
import { gameEvents } from './EventBus.js';

/**
 * Preferencias del jugador (volumen, velocidad de texto). A diferencia
 * de GameState, esto sobrevive aunque no haya partida guardada: se
 * persiste aparte y se carga una sola vez al arrancar el juego.
 */
export class Settings {
  constructor() {
    this.musicVolume = CONFIG.DEFAULT_MUSIC_VOLUME;
    this.sfxVolume = CONFIG.DEFAULT_SFX_VOLUME;
    this.textSpeed = 1; // multiplicador: 1 = normal, 2 = doble de rápido
  }

  load() {
    try {
      const raw = localStorage.getItem(CONFIG.SETTINGS_KEY);
      if (raw) {
        Object.assign(this, JSON.parse(raw));
      }
    } catch (error) {
      console.warn('[Settings] No se pudo leer la configuración guardada.', error);
    }
    this.#notify();
    return this;
  }

  save() {
    try {
      localStorage.setItem(
        CONFIG.SETTINGS_KEY,
        JSON.stringify({
          musicVolume: this.musicVolume,
          sfxVolume: this.sfxVolume,
          textSpeed: this.textSpeed,
        })
      );
    } catch (error) {
      console.warn('[Settings] No se pudo guardar la configuración.', error);
    }
  }

  update(partial) {
    Object.assign(this, partial);
    this.save();
    this.#notify();
  }

  #notify() {
    gameEvents.emit('settings:changed', {
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      textSpeed: this.textSpeed,
    });
  }
}

export const settings = new Settings();
