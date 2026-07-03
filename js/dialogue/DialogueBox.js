import { gameEvents } from '../core/EventBus.js';
import { input } from '../core/InputManager.js';
import { settings } from '../core/Settings.js';
import { CONFIG } from '../core/Config.js';
import { dialogueManager } from './DialogueManager.js';
import { audioManager } from '../audio/AudioManager.js';
import { createElement, clearElement } from '../utils/dom.js';

// Cada cuántas letras suena el blip de máquina de escribir.
const BLIP_EVERY_N_CHARS = 2;

/**
 * Presentación del diálogo: escribe el texto letra a letra, muestra
 * nombre/retrato y las opciones cuando las hay. Toda la lógica de qué
 * decir vive en DialogueManager; esto solo escucha sus eventos.
 */
class DialogueBox {
  #element = null;
  #speakerEl = null;
  #textEl = null;
  #portraitEl = null;
  #choicesEl = null;
  #continueEl = null;

  #typeTimer = null;
  #fullText = '';
  #isTyping = false;
  #pendingChoices = null;

  init(rootElement) {
    this.#build(rootElement);

    gameEvents.on('dialogue:line', (payload) => this.#onLine(payload));
    gameEvents.on('dialogue:choices', (payload) => this.#onChoices(payload));
    gameEvents.on('dialogue:ended', () => this.#onEnded());

    input.onActionPressed('interact', () => this.#handleAdvancePressed());
    this.#element.addEventListener('click', () => this.#handleAdvancePressed());
  }

  #build(rootElement) {
    this.#element = createElement('div', 'dialogue-box');
    this.#portraitEl = createElement('div', 'dialogue-box__portrait is-empty');

    const body = createElement('div', 'dialogue-box__body');
    this.#speakerEl = createElement('div', 'dialogue-box__speaker');
    this.#textEl = createElement('div', 'dialogue-box__text');
    this.#choicesEl = createElement('div', 'dialogue-box__choices');

    const footer = createElement('div', 'dialogue-box__footer');
    this.#continueEl = createElement('span', 'dialogue-box__continue', { text: '▼' });
    footer.appendChild(this.#continueEl);

    body.append(this.#speakerEl, this.#textEl, this.#choicesEl, footer);
    this.#element.append(this.#portraitEl, body);
    rootElement.appendChild(this.#element);
  }

  #onLine({ speaker, text, portrait }) {
    this.#element.classList.add('is-visible');
    this.#speakerEl.textContent = speaker ?? '';
    this.#portraitEl.classList.toggle('is-empty', !portrait);
    clearElement(this.#choicesEl);
    this.#pendingChoices = null;
    this.#continueEl.classList.remove('hidden');

    this.#typeText(text);
  }

  #onChoices({ choices }) {
    this.#pendingChoices = choices;
    this.#continueEl.classList.add('hidden');
    if (!this.#isTyping) this.#renderChoices(choices);
  }

  #onEnded() {
    this.#stopTyping();
    this.#element.classList.remove('is-visible');
    clearElement(this.#choicesEl);
    this.#pendingChoices = null;
  }

  #typeText(fullText) {
    this.#stopTyping();
    this.#fullText = fullText;
    this.#textEl.textContent = '';
    this.#isTyping = true;

    const interval = CONFIG.DIALOGUE_CHAR_INTERVAL / Math.max(settings.textSpeed, 0.1);
    let index = 0;

    this.#typeTimer = setInterval(() => {
      index += 1;
      this.#textEl.textContent = this.#fullText.slice(0, index);

      const letter = this.#fullText[index - 1];
      if (index % BLIP_EVERY_N_CHARS === 0 && letter && letter !== ' ') {
        audioManager.playSfx('dialogueBlip');
      }

      if (index >= this.#fullText.length) this.#finishTyping();
    }, interval);
  }

  #finishTyping() {
    this.#stopTyping();
    this.#textEl.textContent = this.#fullText;
    this.#isTyping = false;
    if (this.#pendingChoices) this.#renderChoices(this.#pendingChoices);
  }

  #stopTyping() {
    if (this.#typeTimer) clearInterval(this.#typeTimer);
    this.#typeTimer = null;
    this.#isTyping = false;
  }

  #renderChoices(choices) {
    clearElement(this.#choicesEl);
    choices.forEach((choice, index) => {
      const button = createElement('button', 'dialogue-choice', { text: choice.label });
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        dialogueManager.choose(index);
      });
      this.#choicesEl.appendChild(button);
    });
  }

  #handleAdvancePressed() {
    if (!this.#element.classList.contains('is-visible')) return;
    if (this.#isTyping) {
      this.#finishTyping();
      return;
    }
    if (this.#pendingChoices) return;
    dialogueManager.advance();
  }
}

export const dialogueBox = new DialogueBox();
