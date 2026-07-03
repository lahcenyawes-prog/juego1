/**
 * Definición de un objeto de inventario. Ver data/items.js para el
 * catálogo completo — todavía vacío en esta primera versión.
 */
export class Item {
  constructor({ id, name, description, icon = null }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
  }
}
