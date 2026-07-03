import { gameEvents } from '../core/EventBus.js';
import { settings } from '../core/Settings.js';
import { MusicPlayer } from './MusicPlayer.js';
import { SoundEffects } from './SoundEffects.js';

/**
 * Fachada única de audio: el resto del juego solo habla con
 * audioManager, nunca directamente con MusicPlayer/SoundEffects ni
 * con la API de Audio del navegador.
 */
export class AudioManager {
  constructor() {
    this.music = new MusicPlayer();
    this.sfx = new SoundEffects();
  }

  init() {
    this.music.setVolume(settings.musicVolume);
    this.sfx.setVolume(settings.sfxVolume);

    gameEvents.on('settings:changed', ({ musicVolume, sfxVolume }) => {
      this.music.setVolume(musicVolume);
      this.sfx.setVolume(sfxVolume);
    });
  }

  playMusic(id, options) {
    this.music.play(id, options);
  }

  stopMusic() {
    this.music.stop();
  }

  playSfx(id) {
    this.sfx.play(id);
  }

  playAmbient(id) {
    this.sfx.playAmbient(id);
  }

  stopAmbient() {
    this.sfx.stopAmbient();
  }
}

export const audioManager = new AudioManager();
