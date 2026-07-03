import { neighbor9A } from '../../data/dialogues/neighbor9A.js';
import { neighbor9B } from '../../data/dialogues/neighbor9B.js';
import { neighbor9C } from '../../data/dialogues/neighbor9C.js';

/**
 * Único punto de conexión entre los árboles de diálogo (data/dialogues)
 * y el motor. Para añadir una conversación nueva: crea su archivo en
 * data/dialogues/, impórtalo aquí y añade una línea al mapa. El resto
 * del juego solo la referencia por su id de texto (p. ej. 'neighbor9A').
 */
export const DIALOGUES = {
  neighbor9A,
  neighbor9B,
  neighbor9C,
};
