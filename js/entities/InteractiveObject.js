import { Entity } from './Entity.js';
import { Verb, toActions } from '../engine/Interactable.js';
import { createElement, applyShape } from '../utils/dom.js';
import { dialogueManager } from '../dialogue/DialogueManager.js';
import { gameState } from '../core/GameState.js';
import { runPuzzle, isPuzzleSolved } from '../puzzles/puzzleRunner.js';

/**
 * Objeto genérico examinable: fotografías, notas, ventanas, muebles...
 * La mayoría de los objetos nuevos del juego serán esto y se definirán
 * enteramente por datos (ver data/scenes/apartmentData.js), sin
 * necesidad de escribir una clase nueva. Campos de configuración:
 *
 *   examineText  — texto al Examinar
 *   examineFlag  — bandera de gameState que se marca al examinarlo
 *   useText      — texto narrado al Usar (para interacciones sencillas)
 *   puzzle       — puzle declarativo lanzado al Usar (ver puzzleRunner.js)
 *   onUse        — función libre, escotilla de escape para casos únicos
 */
export class InteractiveObject extends Entity {
  constructor(config) {
    super({ id: config.id, x: config.x, y: config.y ?? 0, config });
    this.isInteractable = true;

    if (config.puzzle && isPuzzleSolved(config.puzzle)) {
      this.element.classList.add('is-solved');
    }
  }

  createElement() {
    const el = createElement('div', 'entity entity--interactive entity--object');
    const shape = createElement('div', 'entity__shape');
    applyShape(shape, this.config.shape);
    el.appendChild(shape);
    return el;
  }

  getAvailableActions() {
    return toActions(this.config.verbs ?? [Verb.EXAMINE]);
  }

  interact(verb) {
    if (verb === Verb.EXAMINE) {
      if (this.config.examineFlag) gameState.setFlag(this.config.examineFlag);
      dialogueManager.showExamine(this.config.examineText ?? '...');
      return;
    }

    if (verb !== Verb.USE) return;

    if (this.config.puzzle) {
      if (isPuzzleSolved(this.config.puzzle)) {
        dialogueManager.showExamine(
          this.config.puzzle.alreadySolvedText ?? this.config.puzzle.solvedText ?? '...'
        );
      } else {
        runPuzzle(this.config.puzzle, this);
      }
    } else if (this.config.useText) {
      dialogueManager.showExamine(this.config.useText);
    } else if (typeof this.config.onUse === 'function') {
      this.config.onUse(this);
    }
  }
}
