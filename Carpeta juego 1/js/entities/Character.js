import { Entity } from './Entity.js';
import { Verb, toActions } from '../engine/Interactable.js';
import { createElement, applyShape } from '../utils/dom.js';
import { dialogueManager } from '../dialogue/DialogueManager.js';

const DEFAULT_SHAPE = { kind: 'circle', width: 40, height: 40, color: '#8a6d3b' };

/**
 * Personaje no jugable. Su conversación se define en un archivo de
 * data/dialogues/*.js y se referencia por `dialogueId` (ver
 * js/dialogue/dialogueRegistry.js). Sin retrato real todavía: el
 * círculo de color es el placeholder.
 */
export class Character extends Entity {
  constructor(config) {
    super({ id: config.id, x: config.x, y: config.y ?? 0, config });
    this.isInteractable = true;
    this.name = config.name ?? 'Desconocido';
  }

  createElement() {
    const el = createElement('div', 'entity entity--interactive entity--character');
    const shape = createElement('div', 'entity__shape');
    applyShape(shape, this.config.shape ?? DEFAULT_SHAPE);
    const label = createElement('div', 'entity-label', { text: this.config.name ?? '' });
    el.appendChild(shape);
    el.appendChild(label);
    return el;
  }

  getAvailableActions() {
    const verbs = [Verb.TALK];
    if (this.config.examineText) verbs.push(Verb.EXAMINE);
    return toActions(verbs);
  }

  interact(verb) {
    if (verb === Verb.TALK) dialogueManager.start(this.config.dialogueId);
    else if (verb === Verb.EXAMINE) dialogueManager.showExamine(this.config.examineText);
  }
}
