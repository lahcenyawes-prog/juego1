# /assets/objects

Iconos e ilustraciones de objetos interactivos y de inventario.

Todavía no se usa ninguno: los objetos son rectángulos de color
(`js/entities/InteractiveObject.js`) y los huecos de inventario están
vacíos (`js/inventory/InventoryUI.js`). Cuando haya arte final:

1. Coloca aquí el icono del objeto (p. ej. `water_gun.png`).
2. Para un objeto del mundo: referencia la ruta en su entrada dentro
   de `/data/scenes/*.js` (campo `shape` o uno nuevo, p. ej. `sprite`).
3. Para un objeto de inventario: añade la ruta al campo `icon` de su
   `Item` en `/data/items.js`.

Convención de nombres: `nombre_objeto.png`, en minúsculas y snake_case.
