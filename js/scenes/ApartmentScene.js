import { GameplayScene } from '../engine/GameplayScene.js';
import { apartmentData } from '../../data/scenes/apartmentData.js';

/**
 * El apartamento del protagonista. Toda su composición (objetos,
 * puerta, luz) vive en data/scenes/apartmentData.js — esta clase
 * existe para que la escena tenga un nombre propio en sceneRegistry.js
 * y un sitio claro donde añadir lógica exclusiva de esta habitación
 * si algún día hace falta.
 */
export class ApartmentScene extends GameplayScene {
  constructor() {
    super('apartment', apartmentData);
  }
}
