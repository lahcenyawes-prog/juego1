import { createElement } from '../utils/dom.js';
import { audioManager } from '../audio/AudioManager.js';

/**
 * Teclado numérico modal, genérico: no sabe qué puzle lo abre ni cuál
 * es el código correcto. Quien lo abre (js/puzzles/puzzleRunner.js)
 * pasa un validador; esta clase solo pinta dígitos y comunica intentos.
 *
 * open({ title, length }, onSubmit) — onSubmit recibe el código tecleado
 * y devuelve true (correcto: el teclado se cierra) o false (error: el
 * display tiembla y se limpia).
 */
class KeypadUI {
  #element = null;
  #displayEl = null;
  #titleEl = null;
  #value = '';
  #length = 4;
  #onSubmit = null;

  init(rootElement) {
    this.#element = createElement('div', 'keypad');

    const panel = createElement('div', 'keypad__panel');
    this.#titleEl = createElement('div', 'keypad__title');
    this.#displayEl = createElement('div', 'keypad__display');

    const grid = createElement('div', 'keypad__grid');
    for (const digit of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
      const button = createElement('button', 'keypad__key', { type: 'button', text: String(digit) });
      button.addEventListener('click', () => this.#pressDigit(String(digit)));
      grid.appendChild(button);
    }
    const clearButton = createElement('button', 'keypad__key keypad__key--action', { type: 'button', text: 'C' });
    clearButton.addEventListener('click', () => this.#clear());
    grid.appendChild(clearButton);

    const closeButton = createElement('button', 'keypad__close', { type: 'button', text: 'Alejarse' });
    closeButton.addEventListener('click', () => this.close());

    panel.append(this.#titleEl, this.#displayEl, grid, closeButton);
    this.#element.appendChild(panel);
    rootElement.appendChild(this.#element);
  }

  open({ title = 'Introduce el código', length = 4 } = {}, onSubmit) {
    this.#titleEl.textContent = title;
    this.#length = length;
    this.#onSubmit = onSubmit;
    this.#value = '';
    this.#renderDisplay();
    this.#element.classList.add('is-visible');
  }

  close() {
    this.#element.classList.remove('is-visible');
    this.#onSubmit = null;
  }

  #pressDigit(digit) {
    if (this.#value.length >= this.#length) return;
    audioManager.playSfx('keypadPress');
    this.#value += digit;
    this.#renderDisplay();

    if (this.#value.length === this.#length) {
      // Pequeña pausa para que se vea el último dígito antes del veredicto.
      setTimeout(() => this.#submit(), 180);
    }
  }

  #submit() {
    const accepted = this.#onSubmit?.(this.#value) ?? false;
    if (accepted) {
      this.close();
      return;
    }

    audioManager.playSfx('keypadError');
    this.#displayEl.classList.remove('is-error');
    void this.#displayEl.offsetWidth;
    this.#displayEl.classList.add('is-error');
    this.#clear();
  }

  #clear() {
    this.#value = '';
    this.#renderDisplay();
  }

  #renderDisplay() {
    const filled = this.#value.split('');
    const empty = new Array(this.#length - filled.length).fill('·');
    this.#displayEl.textContent = [...filled, ...empty].join(' ');
  }
}

export const keypadUI = new KeypadUI();
