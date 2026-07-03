import { Entity } from './Entity.js';
import { Verb, toActions } from '../engine/Interactable.js';
import { createElement, applyShape } from '../utils/dom.js';
import { dialogueManager } from '../dialogue/DialogueManager.js';
import { gameEvents } from '../core/EventBus.js';
import { audioManager } from '../audio/AudioManager.js';

const DEFAULT_SHAPE = { kind: 'rect', width: 14, height: 22, color: '#d8c98a' };

/**
 * Interruptor de luz. Alterna su propio aspecto y emite un evento para
 * que la escena ajuste la iluminación ambiental general (ver
 * `scene:light-toggled` en GameplayScene / ApartmentScene).
 */
export class Light extends Entity {
  constructor(config) {
    super({ id: config.id, x: config.x, y: config.y ?? 0, config });
    this.isInteractable = true;
    this.isOn = config.startsOn ?? true;
    this.#applyState();
  }

  createElement() {
    const el = createElement('div', 'entity entity--interactive entity--light');
    const shape = createElement('div', 'entity__shape');
    applyShape(shape, this.config.shape ?? DEFAULT_SHAPE);
    if (this.config.flicker) shape.classList.add('light-flicker');
    el.appendChild(shape);
    return el;
  }

  getAvailableActions() {
    return toActions([Verb.USE, Verb.EXAMINE]);
  }

  interact(verb) {
    if (verb === Verb.USE) this.toggle();
    else if (verb === Verb.EXAMINE) {
      dialogueManager.showExamine(this.config.examineText ?? 'Un interruptor de la luz.');
    }
  }

  toggle() {
    this.isOn = !this.isOn;
    this.#applyState();
    audioManager.playSfx('switchClick');
    gameEvents.emit('light:toggled', { id: this.id, isOn: this.isOn, roomId: this.config.roomId });
  }

  #applyState() {
    this.element.classList.toggle('is-off', !this.isOn);
  }
}
