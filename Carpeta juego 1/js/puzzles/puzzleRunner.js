import { gameEvents } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { inventory } from '../inventory/Inventory.js';
import { dialogueManager } from '../dialogue/DialogueManager.js';
import { audioManager } from '../audio/AudioManager.js';
import { cameraFX } from '../effects/CameraFX.js';
import { keypadUI } from '../ui/KeypadUI.js';
import { ITEMS } from '../../data/items.js';

/**
 * Ejecuta puzles definidos declarativamente en los datos de escena.
 * Un objeto interactivo con un campo `puzzle` en data/scenes/*.js lo
 * lanza al usarse (ver InteractiveObject.interact). Formato:
 *
 *   puzzle: {
 *     type: 'code',            // qué runner lo resuelve (ver RUNNERS)
 *     code: '1200',            // solo para type 'code'
 *     title: 'Texto del panel',
 *     solvedFlag: 'idBandera', // se marca en gameState al resolverlo
 *     solvedText: 'Narración al resolverlo.',
 *     alreadySolvedText: 'Al volver a usarlo una vez resuelto.',
 *     rewardItemId: 'polaroid',// opcional: id de data/items.js
 *   }
 *
 * Para un tipo de puzle nuevo (relacionar fotografías, escuchar un
 * patrón...): añade su función a RUNNERS y, si necesita interfaz
 * propia, créala como componente aparte al estilo de KeypadUI.
 */
const RUNNERS = {
  code: runCodePuzzle,
};

export function runPuzzle(puzzle, entity) {
  const runner = RUNNERS[puzzle.type];
  if (!runner) {
    console.warn(`[puzzleRunner] Tipo de puzle desconocido: "${puzzle.type}"`);
    return;
  }
  runner(puzzle, entity);
}

export function isPuzzleSolved(puzzle) {
  return Boolean(puzzle.solvedFlag) && gameState.hasFlag(puzzle.solvedFlag);
}

function runCodePuzzle(puzzle, entity) {
  keypadUI.open({ title: puzzle.title, length: puzzle.code.length }, (attempt) => {
    if (attempt !== puzzle.code) {
      gameEvents.emit('puzzle:failed', { puzzle, entity, attempt });
      return false;
    }
    solvePuzzle(puzzle, entity);
    return true;
  });
}

function solvePuzzle(puzzle, entity) {
  if (puzzle.solvedFlag) gameState.setFlag(puzzle.solvedFlag);

  const rewardItem = puzzle.rewardItemId ? ITEMS[puzzle.rewardItemId] : null;
  if (rewardItem) inventory.addItem(rewardItem);

  audioManager.playSfx('unlock');
  cameraFX.shake('soft');
  entity?.getElement().classList.add('is-solved');

  if (puzzle.solvedText) dialogueManager.showExamine(puzzle.solvedText);
  gameEvents.emit('puzzle:solved', { puzzle, entity });
}
