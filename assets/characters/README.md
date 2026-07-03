# /assets/characters

Sprites e ilustraciones de personajes: al protagonista, los vecinos y
cualquier personaje futuro.

Todavía no se usa ninguno: los personajes son círculos de color
definidos en `js/entities/Character.js` (placeholder). Cuando haya
arte final:

1. Coloca aquí el sprite o retrato (p. ej. `neighbor_9a.png`,
   `neighbor_9a_portrait.png`).
2. Referencia la ruta desde el `config` del personaje en su archivo de
   `/data/scenes/*.js` (para el sprite en el mundo) o desde su entrada
   en `/data/dialogues/*.js` (para el retrato del diálogo, campo
   `portrait` de cada nodo).
3. `Character.createElement()` y `DialogueBox` son los sitios donde
   sustituir el color plano / círculo vacío por la imagen real.

Convención de nombres: `nombrePersonaje.png` para el sprite de cuerpo
entero, `nombrePersonaje_portrait.png` para el retrato de diálogo.
