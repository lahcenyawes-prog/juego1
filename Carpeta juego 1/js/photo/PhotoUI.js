import { gameEvents } from '../core/EventBus.js';
import { photoMode } from './PhotoMode.js';
import { createElement } from '../utils/dom.js';

/** Visor de la cámara: marco, disparador y un flash al fotografiar. */
class PhotoUI {
  #element = null;
  #flashElement = null;

  init(rootElement) {
    this.#element = createElement('div', 'photo-ui');
    this.#element.appendChild(createElement('div', 'photo-ui__frame'));
    this.#element.appendChild(
      createElement('div', 'photo-ui__hint', { text: 'Modo fotografía — C para salir' })
    );

    const shutter = createElement('button', 'photo-ui__shutter', { type: 'button' });
    shutter.addEventListener('click', () => photoMode.takePhoto());
    this.#element.appendChild(shutter);

    this.#flashElement = createElement('div', 'photo-ui__flash');
    this.#element.appendChild(this.#flashElement);

    rootElement.appendChild(this.#element);

    gameEvents.on('photo:mode-changed', ({ isActive }) => {
      this.#element.classList.toggle('is-active', isActive);
    });
    gameEvents.on('photo:taken', () => this.#flash());
  }

  #flash() {
    this.#flashElement.classList.remove('is-flashing');
    void this.#flashElement.offsetWidth; // reinicia la animación CSS
    this.#flashElement.classList.add('is-flashing');
  }
}

export const photoUI = new PhotoUI();
