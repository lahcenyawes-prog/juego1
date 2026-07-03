import { gameEvents } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { DIALOGUES } from './dialogueRegistry.js';

/**
 * Máquina de estados de una conversación: qué nodo se muestra, si hay
 * que elegir una opción y cuándo termina. No sabe nada del DOM — eso
 * es responsabilidad de DialogueBox, que escucha sus eventos.
 *
 * Formato de los árboles de diálogo (ver data/dialogues/*.js):
 *   {
 *     start: 'idNodoInicial',
 *     nodes: {
 *       idNodo: {
 *         speaker, text, portrait?,
 *         flags?: ['bandera'],        // se marcan en gameState al mostrarse
 *         next?,
 *         choices?: [{ label, next, flag? }] // flag se marca al elegirla
 *       }
 *     }
 *   }
 * Un nodo sin `next` ni `choices` termina la conversación. Las banderas
 * son el enganche entre conversaciones y el resto del juego (puzles,
 * eventos futuros): se consultan con gameState.hasFlag(id).
 */
export class DialogueManager {
  #dialogueId = null;
  #dialogue = null;
  #node = null;

  get isActive() {
    return this.#node !== null;
  }

  start(dialogueId) {
    const dialogue = DIALOGUES[dialogueId];
    if (!dialogue) {
      console.error(`[DialogueManager] Diálogo desconocido: "${dialogueId}"`);
      return;
    }

    this.#dialogueId = dialogueId;
    this.#dialogue = dialogue;
    gameEvents.emit('dialogue:started', { dialogueId });
    this.#goToNode(dialogue.start);
  }

  /** Muestra un único texto sin hablante ni elecciones (usado por "Examinar"). */
  showExamine(text) {
    this.#dialogueId = null;
    this.#dialogue = null;
    this.#node = { speaker: null, text: text ?? '', next: null };
    gameEvents.emit('dialogue:started', { dialogueId: null });
    this.#emitCurrentNode();
  }

  /** Avanza al siguiente nodo. No hace nada si el nodo actual espera una elección. */
  advance() {
    if (!this.#node || this.#node.choices) return;

    if (this.#node.next) this.#goToNode(this.#node.next);
    else this.end();
  }

  choose(index) {
    const choice = this.#node?.choices?.[index];
    if (!choice) return;

    if (choice.flag) gameState.setFlag(choice.flag);

    if (choice.next) this.#goToNode(choice.next);
    else this.end();
  }

  end() {
    const dialogueId = this.#dialogueId;
    this.#dialogueId = null;
    this.#dialogue = null;
    this.#node = null;
    gameEvents.emit('dialogue:ended', { dialogueId });
  }

  #goToNode(nodeId) {
    const node = this.#dialogue?.nodes?.[nodeId];
    if (!node) {
      this.end();
      return;
    }
    this.#node = node;
    node.flags?.forEach((flag) => gameState.setFlag(flag));
    this.#emitCurrentNode();
  }

  #emitCurrentNode() {
    gameEvents.emit('dialogue:line', {
      speaker: this.#node.speaker ?? null,
      text: this.#node.text ?? '',
      portrait: this.#node.portrait ?? null,
    });

    if (this.#node.choices) {
      gameEvents.emit('dialogue:choices', { choices: this.#node.choices });
    }
  }
}

export const dialogueManager = new DialogueManager();
