import { Entity } from './Entity.js';
import { Verb, toActions } from '../engine/Interactable.js';
import { createElement, applyShape } from '../utils/dom.js';
import { sceneManager } from '../engine/SceneManager.js';
import { dialogueManager } from '../dialogue/DialogueManager.js';
import { audioManager } from '../audio/AudioManager.js';

const DEFAULT_SHAPE = { kind: 'rect', width: 52, height: 96, color: '#4a3f33' };

/**
 * Puerta con estado abierta/cerrada. Si su configuración trae
 * `leadsTo`, abrirla también cambia de escena (por ejemplo, la puerta
 * del apartamento hacia el pasillo). Sin `leadsTo` es una puerta
 * decorativa que solo cambia de aspecto (un armario, por ejemplo).
 */
export class Door extends Entity {
  constructor(config) {
    super({ id: config.id, x: config.x, y: config.y ?? 0, config });
    this.isInteractable = true;
    this.isOpen = false;
    this.isLocked = config.isLocked ?? false;
  }

  createElement() {
    const el = createElement('div', 'entity entity--interactive entity--door');
    const shape = createElement('div', 'entity__shape');
    applyShape(shape, this.config.shape ?? DEFAULT_SHAPE);
    el.appendChild(shape);
    return el;
  }

  getAvailableActions() {
    if (this.isLocked) return toActions([Verb.EXAMINE]);
    const verbs = [this.isOpen ? Verb.CLOSE : Verb.OPEN, Verb.EXAMINE];
    return toActions(verbs);
  }

  interact(verb) {
    if (verb === Verb.OPEN) this.open();
    else if (verb === Verb.CLOSE) this.close();
    else if (verb === Verb.EXAMINE) {
      dialogueManager.showExamine(this.#examineText());
    }
  }

  open() {
    if (this.isLocked || this.isOpen) return;
    this.isOpen = true;
    this.element.classList.add('is-open');
    audioManager.playSfx('doorOpen');

    if (this.config.leadsTo) {
      sceneManager.changeScene(this.config.leadsTo, { spawnId: this.config.spawnAt });
    }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.element.classList.remove('is-open');
    audioManager.playSfx('doorClose');
  }

  #examineText() {
    if (this.isLocked) return this.config.lockedText ?? 'Está cerrada con llave.';
    return this.config.examineText ?? 'Una puerta.';
  }
}
