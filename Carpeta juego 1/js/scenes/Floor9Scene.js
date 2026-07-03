import { GameplayScene } from '../engine/GameplayScene.js';
import { gameState } from '../core/GameState.js';
import { floor9Data } from '../../data/scenes/floor9Data.js';

/**
 * Pasillo de la Planta 9. Ejemplo de escena que añade una pequeña
 * pieza de lógica propia (marcar que ya se visitó) por encima de todo
 * lo que ya hace GameplayScene: para eso se sobrescribe onEnter,
 * llamando siempre primero a super.onEnter().
 */
export class Floor9Scene extends GameplayScene {
  constructor() {
    super('floor9', floor9Data);
  }

  onEnter(context) {
    super.onEnter(context);
    gameState.setFlag('visitedFloor9');
  }
}
