/**
 * Registro de plantas del edificio Meridiano. `unlocked: false` es lo
 * que hace que el ascensor muestre una planta como bloqueada (ver
 * js/building/Elevator.js). Para desbloquear una planta nueva:
 *
 *   1. Crea su escena en js/scenes/ y su archivo en data/scenes/.
 *   2. Regístrala en js/scenes/sceneRegistry.js.
 *   3. Aquí, pon `unlocked: true` y `sceneId: 'idDeLaEscena'`.
 *
 * Ver PROJECT_MAP.md → "Añadir una planta nueva" para el detalle completo.
 */
export const FLOORS = [
  { id: 'floor1', number: 1, name: 'Planta 1', unlocked: false, sceneId: null },
  { id: 'floor2', number: 2, name: 'Planta 2', unlocked: false, sceneId: null },
  { id: 'floor3', number: 3, name: 'Planta 3', unlocked: false, sceneId: null },
  { id: 'floor4', number: 4, name: 'Planta 4', unlocked: false, sceneId: null },
  { id: 'floor5', number: 5, name: 'Planta 5', unlocked: false, sceneId: null },
  { id: 'floor6', number: 6, name: 'Planta 6', unlocked: false, sceneId: null },
  { id: 'floor7', number: 7, name: 'Planta 7', unlocked: false, sceneId: null },
  { id: 'floor8', number: 8, name: 'Planta 8', unlocked: false, sceneId: null },
  { id: 'floor9', number: 9, name: 'Planta 9', unlocked: true, sceneId: 'floor9' },
];
