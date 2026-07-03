/**
 * Datos de una planta del edificio. No contiene lógica: es la unidad
 * que lee Building desde data/floors.js. Para añadir una planta nueva
 * al juego, se añade una entrada en ese archivo — ver PROJECT_MAP.md.
 */
export class Floor {
  constructor({ id, number, name, unlocked = false, sceneId = null }) {
    this.id = id;
    this.number = number;
    this.name = name;
    this.unlocked = unlocked;
    this.sceneId = sceneId;
  }
}
