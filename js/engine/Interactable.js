/**
 * Vocabulario común de verbos de interacción. Cualquier entidad
 * interactiva (objeto, puerta, luz, personaje) elige un subconjunto de
 * estos verbos en `getAvailableActions()`. Centralizarlo aquí evita
 * que cada entidad reinvente sus propias etiquetas.
 */
export const Verb = Object.freeze({
  EXAMINE: 'examine',
  TALK: 'talk',
  OPEN: 'open',
  CLOSE: 'close',
  USE: 'use',
});

export const VERB_LABELS = Object.freeze({
  [Verb.EXAMINE]: 'Examinar',
  [Verb.TALK]: 'Hablar',
  [Verb.OPEN]: 'Abrir',
  [Verb.CLOSE]: 'Cerrar',
  [Verb.USE]: 'Usar',
});

/** Convierte una lista de verbos en la forma { verb, label } que espera la UI. */
export function toActions(verbs) {
  return verbs.map((verb) => ({ verb, label: VERB_LABELS[verb] }));
}
