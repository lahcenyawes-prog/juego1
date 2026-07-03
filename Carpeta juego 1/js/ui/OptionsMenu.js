import { settings } from '../core/Settings.js';
import { createElement } from '../utils/dom.js';

/**
 * Panel modal de opciones: volumen de música/efectos y velocidad del
 * texto de diálogo. Se puede abrir desde el menú principal y, más
 * adelante, desde un futuro menú de pausa — por eso vive en js/ui y
 * no dentro de MainMenuScene.
 */
class OptionsMenu {
  #element = null;

  init(rootElement) {
    this.#element = createElement('div', 'options-menu');

    const panel = createElement('div', 'options-menu__panel');
    panel.appendChild(createElement('div', 'options-menu__title', { text: 'Opciones' }));

    panel.appendChild(
      this.#buildSlider('Música', {
        value: settings.musicVolume,
        onChange: (value) => settings.update({ musicVolume: value }),
      })
    );
    panel.appendChild(
      this.#buildSlider('Efectos', {
        value: settings.sfxVolume,
        onChange: (value) => settings.update({ sfxVolume: value }),
      })
    );
    panel.appendChild(
      this.#buildSlider('Velocidad del texto', {
        min: 0.5,
        max: 2,
        step: 0.1,
        value: settings.textSpeed,
        onChange: (value) => settings.update({ textSpeed: value }),
      })
    );

    const closeButton = createElement('button', 'options-menu__close', { text: 'Volver', type: 'button' });
    closeButton.addEventListener('click', () => this.close());
    panel.appendChild(closeButton);

    this.#element.appendChild(panel);
    rootElement.appendChild(this.#element);
  }

  open() {
    this.#element.classList.add('is-visible');
  }

  close() {
    this.#element.classList.remove('is-visible');
  }

  #buildSlider(label, { min = 0, max = 1, step = 0.05, value, onChange }) {
    const row = createElement('div', 'options-row');
    row.appendChild(createElement('span', 'options-row__label', { text: label }));

    const rangeInput = createElement('input', '', {
      type: 'range',
      min: String(min),
      max: String(max),
      step: String(step),
    });
    rangeInput.value = String(value);
    rangeInput.addEventListener('input', () => onChange(Number(rangeInput.value)));
    row.appendChild(rangeInput);

    return row;
  }
}

export const optionsMenu = new OptionsMenu();
