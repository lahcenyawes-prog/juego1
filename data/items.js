import { Item } from '../js/inventory/Item.js';

/**
 * Catálogo de todos los objetos que pueden existir en el inventario,
 * indexados por id. Para añadir uno nuevo, copia el formato de la
 * polaroid y entrégalo desde una escena: o bien como `rewardItemId` de
 * un puzle (ver data/scenes/floor9Data.js), o bien llamando a
 * inventory.addItem(ITEMS.miObjeto) desde un onUse.
 */
export const ITEMS = {
  polaroid: new Item({
    id: 'polaroid',
    name: 'Polaroid velada',
    description:
      'Encontrada en el cuarto de contadores. Está velada casi por completo; en una esquina se distingue un pasillo idéntico al de la novena planta, con una puerta de más.',
  }),
};
