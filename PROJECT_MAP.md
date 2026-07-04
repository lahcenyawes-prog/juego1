# PROJECT_MAP — La Última Planta

Índice completo del proyecto. Si vuelves dentro de unos meses y no
recuerdas dónde vive algo, empieza aquí antes de leer código.

- [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
- [Filosofía de la arquitectura](#filosofía-de-la-arquitectura)
- [Mapa de carpetas](#mapa-de-carpetas)
- [Índice de archivos por sistema](#índice-de-archivos-por-sistema)
- [Guías: cómo añadir cosas](#guías-cómo-añadir-cosas)
- [Catálogo de eventos (gameEvents)](#catálogo-de-eventos-gameevents)
- [Convenciones de código](#convenciones-de-código)
- [Qué falta / próximos pasos](#qué-falta--próximos-pasos)

---

## Cómo ejecutar el proyecto

No hay build ni dependencias. Abre la carpeta en VS Code, instala la
extensión **Live Server** si no la tienes, clic derecho en
`index.html` → "Open with Live Server".

El juego usa módulos ES nativos (`import`/`export`), así que **tiene
que servirse por HTTP** (lo que hace Live Server); abrir `index.html`
con doble clic desde el explorador de archivos no funcionará porque
los navegadores bloquean `import` sobre `file://`.

No hace falta `npm install`, no hay `package.json`: es HTML + CSS +
JavaScript puro.

**Truco de desarrollo:** añade `?scene=apartment` (o `intro`,
`floor9`...) a la URL para arrancar directamente en esa escena sin
pasar por el menú. Ver `Game.start()`.

---

## Filosofía de la arquitectura

Cinco decisiones de diseño explican casi todo el código. Vale la pena
entenderlas antes de tocar nada:

1. **Todo es una escena.** El menú principal, la introducción y cada
   habitación son instancias de `Scene` gestionadas por un único
   `SceneManager` (`js/engine/SceneManager.js`). No hay un sistema
   aparte para "pantallas de menú" — así, cambiar del menú a la
   introducción usa exactamente el mismo mecanismo de fundido que
   entrar en el ascensor.

2. **Las habitaciones se construyen desde datos, no desde código.**
   `GameplayScene` (`js/engine/GameplayScene.js`) lee un array
   `objects` de un archivo en `data/scenes/` y crea automáticamente la
   entidad correspondiente según su campo `type`
   (`object`/`door`/`light`/`character`/`elevator`). Añadir un objeto
   a una habitación casi nunca requiere escribir JavaScript nuevo.

3. **Servicios con estado son singletons de módulo.** `gameState`,
   `inventory`, `dialogueManager`, `audioManager`, `sceneManager`,
   `building`, `elevator`, etc. se exportan ya instanciados desde su
   propio archivo (`export const x = new X()`). Solo hay una partida
   en curso, así que no hace falta inyectar dependencias por todas
   partes: cualquier archivo que necesite el inventario simplemente
   hace `import { inventory } from '.../Inventory.js'`.

4. **Lógica y presentación están separadas, por sistema.** Cada
   sistema con interfaz tiene una clase de **lógica** (sin tocar el
   DOM: `DialogueManager`, `Inventory`, `Elevator`) y una clase de
   **presentación** (`DialogueBox`, `InventoryUI`, `ElevatorPanel`)
   que escucha los eventos de la primera. La lógica nunca importa su
   propia UI.

5. **Eventos para "algo cambió", llamadas directas para "haz esto".**
   `js/core/EventBus.js` (instancia compartida `gameEvents`) se usa
   cuando varias partes desconectadas del juego pueden reaccionar a lo
   mismo (p. ej. `inventory:changed` → repinta `InventoryUI`). Cuando
   un módulo necesita que otro haga algo en concreto (p. ej. una
   puerta pide un cambio de escena), se llama directamente al método
   del singleton correspondiente. Ver [Catálogo de
   eventos](#catálogo-de-eventos-gameevents).

---

## Mapa de carpetas

| Carpeta | Propósito |
|---|---|
| `/assets/backgrounds` | Fondos de escenas (todavía sin usar; placeholders en CSS) |
| `/assets/characters` | Retratos de personajes para el diálogo |
| `/assets/objects` | Sprites de objetos e iconos de inventario |
| `/assets/sounds` | Efectos puntuales y sonidos ambientales |
| `/assets/music` | Música de fondo |
| `/assets/fonts` | Tipografías propias |
| `/assets/ui` | Iconos y texturas de interfaz |
| `/css` | Todo el estilo visual, en un archivo por sistema |
| `/data` | Contenido del juego: diálogos, objetos, plantas, escenas — texto y números, cero lógica |
| `/js/core` | Arranque del juego, configuración, estado global, entrada, guardado de ajustes |
| `/js/engine` | El "motor" genérico: escenas, cámara, animaciones, sistema de interacción |
| `/js/entities` | Clases de cosas que existen en una escena (jugador, objetos, puertas, luces, personajes) |
| `/js/building` | El edificio como sistema propio: plantas y ascensor |
| `/js/scenes` | Las escenas concretas del juego (menú, intro, apartamento, planta 9) |
| `/js/dialogue` | Motor de conversaciones (lógica + caja de diálogo) |
| `/js/inventory` | Los 6 huecos de inventario (lógica + panel) |
| `/js/audio` | Música, efectos y ambiente |
| `/js/save` | Persistencia de partida en `localStorage` |
| `/js/photo` | Modo cámara de fotos (estructura) |
| `/js/puzzles` | Ejecución de puzles declarativos (definidos en los datos de escena) |
| `/js/effects` | Atmósfera y "vida": polvo, parpadeo ambiental, sacudidas de cámara |
| `/js/ui` | Componentes de interfaz genéricos, no atados a un sistema concreto |
| `/js/utils` | Funciones auxiliares sin estado (DOM, matemáticas, log) |
| `js/main.js` | Punto de entrada: crea y arranca `Game` |

Cada carpeta de `/js` tiene una responsabilidad; si un archivo nuevo
no encaja claramente en ninguna, probablemente merece su propia
carpeta (así se añadieron `building`, `inventory` y `photo`, que no
estaban en la lista original de ejemplo).

---

## Índice de archivos por sistema

### `js/core` — arranque y estado global

| Archivo | Qué hace |
|---|---|
| `Game.js` | Ensambla todo: inicializa cada sistema en orden y arranca el bucle principal. **Aquí se registra cualquier sistema nuevo.** |
| `Config.js` | Constantes globales (velocidad del jugador, rango de interacción, teclas...). Ningún número mágico debería vivir fuera de aquí. |
| `EventBus.js` | Bus de eventos genérico. Exporta la instancia compartida `gameEvents`. |
| `GameState.js` | Estado de la partida: escena/planta actual, banderas de historia, fotos tomadas. Exporta `gameState`. |
| `Settings.js` | Preferencias del jugador (volumen, velocidad de texto), persisten aparte de la partida. Exporta `settings`. |
| `InputManager.js` | Traduce teclas físicas a acciones lógicas según `Config.KEY_BINDINGS`. Exporta `input`. |
| `AssetLoader.js` | Precarga de imágenes/audio para cuando haya arte real que precargar. |
| `Clock.js` | Envoltorio de `requestAnimationFrame` con delta time protegido. |
| `ViewportScaler.js` | Escala `#game-stage` (resolución fija 1280×720) para llenar la ventana manteniendo proporción. |

### `js/engine` — el motor

| Archivo | Qué hace |
|---|---|
| `Scene.js` | Clase base de cualquier pantalla (`onEnter`, `onExit`, `update`, `createElement`). |
| `GameplayScene.js` | Clase base de las habitaciones: jugador, cámara, población de entidades desde datos, movimiento, iluminación ambiental. **La mayoría de los cambios de "cómo se comporta una habitación" van aquí.** |
| `SceneManager.js` | Autoridad única sobre qué escena está activa; gestiona el fundido entre escenas. Exporta `sceneManager`. |
| `Camera.js` | Cámara horizontal que sigue al jugador dentro de los límites de la escena. |
| `Interactable.js` | Vocabulario de verbos (`Verb`, `VERB_LABELS`) y el helper `toActions()`. |
| `InteractionSystem.js` | Decide con qué entidad puede interactuar el jugador y qué verbos ofrecer. Exporta `interactionSystem`. |
| `AnimationSystem.js` | Registro de animaciones activas (Tweens). Conectado al bucle principal, listo para usarse. Exporta `animationSystem`. |
| `Tween.js` | Interpola un valor numérico en el tiempo con easing. |

### `js/entities` — qué puede existir en una escena

| Archivo | Qué hace |
|---|---|
| `Entity.js` | Base de todo: posición, elemento DOM, clic → interacción. |
| `Player.js` | El protagonista: movimiento horizontal con límites. |
| `InteractiveObject.js` | Objeto genérico examinable (fotos, notas, ventanas...). La mayoría de los objetos nuevos son esto, definidos por datos. |
| `Door.js` | Puerta abrir/cerrar; si tiene `leadsTo`, además cambia de escena. Soporta `isLocked`. |
| `Light.js` | Interruptor on/off; avisa a la escena para oscurecer el ambiente. Soporta `flicker` (parpadeo). |
| `Character.js` | Personaje no jugable: verbo Hablar → dispara un diálogo por `dialogueId`. |

### `js/building` — el edificio

| Archivo | Qué hace |
|---|---|
| `Floor.js` | Datos de una planta (número, nombre, si está desbloqueada, a qué escena lleva). |
| `Building.js` | Colección de plantas, cargada desde `data/floors.js`. Exporta `building`. |
| `Elevator.js` | Estado del ascensor (abierto/cerrado) y regla de a qué planta se puede viajar. Exporta `elevator`. |
| `ElevatorEntity.js` | La entidad física del ascensor dentro de una escena (las puertas que se ven y se usan). |
| `ElevatorPanel.js` | El panel modal de selección de planta. Exporta `elevatorPanel`. |

### `js/scenes` — las escenas concretas

| Archivo | Qué hace |
|---|---|
| `sceneRegistry.js` | **Único lugar donde se registran las escenas.** |
| `MainMenuScene.js` | Nueva partida / Continuar / Opciones / Salir. |
| `IntroScene.js` | Texto narrado de introducción. |
| `ApartmentScene.js` | El apartamento del protagonista (contenido en `data/scenes/apartmentData.js`). |
| `Floor9Scene.js` | El pasillo de la Planta 9 (contenido en `data/scenes/floor9Data.js`). |

### `js/effects` — atmósfera

| Archivo | Qué hace |
|---|---|
| `DustField.js` | Motas de polvo flotando (escenas jugables y menú). Una instancia por escena. |
| `AmbientFlicker.js` | Parpadeos aleatorios de la luz general + golpes lejanos ocasionales. Se activa con `ambientFlicker: true` en los datos de la escena. |
| `CameraFX.js` | Sacudidas (`shake('soft'|'strong')`) y pulso de zoom (`zoomPulse()`) sobre #game-root. Exporta `cameraFX`. |

El grano de película, la viñeta, la niebla del menú y la "respiración"
del escenario son CSS puro: viven en `css/effects.css`.

### `js/puzzles` — puzles

| Archivo | Qué hace |
|---|---|
| `puzzleRunner.js` | Ejecuta el campo `puzzle` de un objeto interactivo: valida, marca la bandera, entrega la recompensa y narra el resultado. **Aquí se registran los tipos de puzle nuevos** (mapa RUNNERS). |

### `js/dialogue`, `js/inventory`, `js/audio`, `js/save`, `js/photo`

| Archivo | Qué hace |
|---|---|
| `dialogue/DialogueManager.js` | Máquina de estados de una conversación (nodo actual, elecciones). Exporta `dialogueManager`. |
| `dialogue/DialogueBox.js` | Presentación: texto letra a letra, nombre, retrato, botones de elección. |
| `dialogue/dialogueRegistry.js` | Mapa id → árbol de diálogo. **Aquí se registra cada conversación nueva.** |
| `inventory/Item.js` | Definición de un objeto de inventario. |
| `inventory/Inventory.js` | Los 6 huecos, sin lógica de UI. Exporta `inventory`. |
| `inventory/InventoryUI.js` | El panel visual, se abre con la tecla de inventario. |
| `audio/AudioManager.js` | Fachada única de audio. Exporta `audioManager`. |
| `audio/MusicPlayer.js` | Una pista de música a la vez, en bucle. |
| `audio/SoundEffects.js` | Efectos puntuales + un sonido ambiental en bucle. Si un id no tiene archivo, cae al sintetizador. |
| `audio/proceduralSfx.js` | Placeholder sonoro sintetizado con Web Audio (pasos, puertas, interruptor, teclado). Un archivo real en el manifiesto siempre gana. |
| `audio/audioManifest.js` | Catálogo id → ruta de archivo. **Aquí se registra cada sonido/música nueva.** |
| `save/SaveManager.js` | Guardar/cargar partida en `localStorage`. Exporta `saveManager`. |
| `save/SaveSchema.js` | Forma versionada de una partida guardada. |
| `photo/PhotoMode.js` | Activar/desactivar modo foto y registrar una foto tomada (estructura). |
| `photo/PhotoUI.js` | Visor de la cámara. |

### `js/ui` — interfaz genérica

| Archivo | Qué hace |
|---|---|
| `UIManager.js` | Conecta cada componente de interfaz con su capa del DOM. **Aquí se registra cualquier componente de UI nuevo.** |
| `FadeTransition.js` | Fundido a negro entre escenas (con red de seguridad anti-cuelgue). |
| `InteractionMenu.js` | Menú contextual de verbos (Examinar/Hablar/Abrir/Cerrar/Usar). |
| `HUD.js` | Aviso de interacción flotante, botón de inventario, notificaciones cortas. |
| `OptionsMenu.js` | Panel de volumen y velocidad de texto. |
| `KeypadUI.js` | Teclado numérico modal genérico (lo abre puzzleRunner, no sabe de códigos). |
| `entityAnchor.js` | Helper compartido: calcula dónde flotar un elemento de UI sobre una entidad. |

### `js/utils`

| Archivo | Qué hace |
|---|---|
| `dom.js` | `createElement`, `clearElement`, `applyShape` (forma base + skin de mobiliario). |
| `math.js` | `clamp`, `lerp`, `distance`, `randomRange`. |
| `logger.js` | `console.*` con prefijo consistente, silenciado salvo `CONFIG.DEBUG`. |

### `/data` — contenido del juego

| Archivo | Qué hace |
|---|---|
| `floors.js` | Registro de las plantas del edificio (número, nombre, desbloqueo, escena). |
| `items.js` | Catálogo de objetos de inventario (vacío en esta versión). |
| `dialogues/neighbor9A.js`, `neighbor9B.js`, `neighbor9C.js` | Árboles de conversación de los tres vecinos. |
| `scenes/apartmentData.js` | Contenido del apartamento. |
| `scenes/floor9Data.js` | Contenido del pasillo de la Planta 9. |

### `/css`

Un archivo por sistema visual: `reset.css`, `variables.css` (todos los
colores/tiempos/tamaños del juego), `main.css` (stage y capas),
`scenes.css` (entidades, mundo y fondo parallax), `furniture.css`
(acabado detallado de cada mueble: reglas `.skin--nombre` elegidas con
el campo `skin` del shape), `menu.css` (incluye
el hueco para `assets/ui/menu_background.png`), `hud.css`,
`interaction.css`, `dialogue.css`, `inventory.css`, `elevator.css`,
`puzzles.css` (teclado numérico), `photo.css`, `effects.css` (grano,
viñeta, niebla, polvo, sacudidas), `transitions.css`. Cambiar un color
global es siempre un cambio en `variables.css`, nunca en el archivo de
cada sistema.

---

## Guías: cómo añadir cosas

### Añadir un objeto interactivo a una habitación

Edita `data/scenes/apartmentData.js` (o el archivo de la escena que
toque) y añade una entrada a `objects`:

```js
{
  type: 'object',
  id: 'radio_vieja',
  x: 540,
  shape: { kind: 'rect', width: 30, height: 26, color: '#5a5248' },
  examineText: 'Una radio antigua. No recuerdas la última vez que sonó.',
}
```

No hace falta tocar ningún archivo de `js/`. Campos opcionales de un
objeto (ver `js/entities/InteractiveObject.js`):

- `label: 'Salón'` — etiqueta flotante (útil para marcar zonas).
- `atWall: true` — pegado a la pared del fondo (base en el zócalo,
  detrás del jugador, colisión al fondo). Ver "Pegado a la pared".
- `verbs: ['examine', 'use']` — añade el verbo Usar.
- `useText: '...'` — narración al Usar (interacciones sencillas).
- `examineFlag: 'idBandera'` — marca una bandera al examinarlo.
- `puzzle: { ... }` — lanza un puzle al Usar (ver "Crear un puzle").
- `onUse: (entity) => {}` — escotilla de escape para casos únicos.
- En `shape`: `glow: 'rgba(...)'` (halo de luz), `flicker: true`
  (parpadeo de fluorescente) y `skin: 'nombre'` (acabado detallado
  definido en `css/furniture.css`; el `color` pasa a ser el tinte base
  `--skin-base`). Skins disponibles: wooddoor, wardrobe, nightstand,
  boarded, metaldoor, bed, sink, mirror, toilet, bathtub, pipe,
  bookshelf, plant, sofa, table, tv, chair, desk, radiator, window,
  clock, painting-landscape, painting-building, photo-frame, paper,
  counter, microwave, fridge, boxes, bin, socket, switch, crack,
  junctionbox, fluorescent, exitsign, rug, doormat, shoe. Sin `skin`,
  el shape se pinta como rectángulo/círculo plano del color dado.

### Añadir un personaje (NPC)

1. Crea su árbol de diálogo en `data/dialogues/miPersonaje.js` (copia
   el formato de `neighbor9A.js`).
2. Regístralo en `js/dialogue/dialogueRegistry.js`.
3. Añade una entrada `type: 'character'` en el archivo de datos de la
   escena donde vive, con `dialogueId: 'miPersonaje'`:

```js
{
  type: 'character',
  id: 'vecino_nuevo',
  x: 1000,
  name: 'Alguien',
  dialogueId: 'miPersonaje',
  shape: { kind: 'circle', width: 40, height: 40, color: '#7a7a7a' },
  examineText: 'Descripción antes de hablarle.',
}
```

### Añadir una escena nueva

1. Si es una habitación con jugador: crea `data/scenes/miEscena.js`
   (copia el formato de `apartmentData.js`) y una clase en
   `js/scenes/MiEscena.js` que extienda `GameplayScene`:

```js
import { GameplayScene } from '../engine/GameplayScene.js';
import { miEscenaData } from '../../data/scenes/miEscena.js';

export class MiEscena extends GameplayScene {
  constructor() {
    super('mi-escena', miEscenaData);
  }
}
```

2. Si es una pantalla especial (como el menú o la introducción):
   extiende `Scene` directamente y sobrescribe `createElement()`.
3. Regístrala en `js/scenes/sceneRegistry.js`.
4. Para llegar a ella desde otra escena: una puerta con
   `leadsTo: 'mi-escena'`, o `sceneManager.changeScene('mi-escena')`.

### Añadir una planta nueva al edificio

1. Crea su escena (pasos de arriba).
2. En `data/floors.js`, cambia esa planta: `unlocked: true,
   sceneId: 'mi-escena'`.
3. Listo — `ElevatorPanel` la muestra automáticamente como disponible
   (lee `building.getAllFloors()`, no hace falta tocar el ascensor).

### Modificar el ascensor

- **Reglas de qué planta se puede pedir:** `js/building/Elevator.js`
  (`requestFloor`) y `data/floors.js` (`unlocked`).
- **Coreografía del viaje** (cierre de puertas → marcha → ding →
  llegada) y sus tiempos: constantes al inicio de
  `js/building/Elevator.js`. La duración escala con la distancia
  entre plantas.
- **Aspecto/comportamiento del panel modal:** `js/building/ElevatorPanel.js`
  y `css/elevator.css`.
- **La entidad física en la escena** (puertas correderas + indicador
  de planta): `js/building/ElevatorEntity.js`.

### Cambiar el comportamiento del edificio (luces, atmósfera)

- **Parpadeo de una luz concreta:** `flicker: true` dentro de su
  `shape` en el archivo de datos (clase CSS `light-flicker`).
- **Halo de luz cálida/fría:** `glow: 'rgba(...)'` dentro del `shape`.
- **Parpadeo general de la escena + golpes lejanos:**
  `ambientFlicker: true` en los datos de la escena
  (js/effects/AmbientFlicker.js decide cuándo y cuánto).
- **Oscurecer la habitación al apagar la luz:** ya es automático
  (`GameplayScene` escucha `light:toggled` y llama a `setDark()`
  cuando todas las luces de la escena están apagadas).
- **Polvo y respiración del escenario:** activados por defecto;
  se apagan por escena con `dust: false` / `breathe: false`.
- **Color de las paredes (fondo parallax):** campo `wallColors:
  { top, bottom }` en los datos de la escena; el suelo, con
  `floorColors: { near, far }`.
- **Tabiques entre habitaciones:** campo `walls: [{ x, width?,
  doorway?, doorId? }]` en los datos de la escena. Bloquean el paso a
  CUALQUIER profundidad; si llevan `doorId`, el hueco se abre cuando
  esa puerta (una entidad `door` colocada en la misma x) está abierta —
  así se entra y sale de las habitaciones abriendo su puerta. Toman el
  color de pared de la habitación. Estilo en `.room-wall`
  (css/scenes.css).
- **Muebles sólidos (colisión):** `solid: true` en la entrada del
  objeto. Solo bloquean cuando el jugador camina a su misma
  profundidad (banda `SOLID_DEPTH_MIN..MAX` en GameplayScene); por
  delante o por detrás se les rodea. Los personajes son sólidos por
  defecto (`solid: false` lo desactiva).
- **Pegado a la pared:** `atWall: true` en la entrada del objeto. Su
  base pasa de la línea de paseo (`--floor-line`) a la línea de zócalo
  (`--wall-line`), se encoge un poco por perspectiva y se dibuja
  siempre detrás del jugador (clase `.entity--at-wall`, scenes.css).
  Si además es `solid`, su colisión bloquea solo la banda del fondo
  (`ATWALL_SOLID_DEPTH_MIN` en GameplayScene): se pasa libre por
  delante y se choca al acercarse a la pared. Úsalo para camas,
  armarios, sanitarios, radiadores, puertas y todo lo colgado (cuadros,
  interruptores, enchufes: su `y` se mide desde el zócalo). Quedan
  exentos lo que vive en mitad de la habitación: alfombras, mesitas de
  centro, sillas separadas, el zapato del pasillo...
- **Atrezzo:** `decor: true` = objeto mudo (sin examinar ni foco:
  enchufes, tuberías, cajas eléctricas); `flat: true` = pieza a ras de
  suelo sin sombra (alfombras, felpudos).
- **Zoom de cámara:** global en `CONFIG.WORLD_ZOOM`; cada escena puede
  fijar el suyo con el campo `zoom` en sus datos.
- **Viñeta y grano de pantalla:** css/effects.css (pseudo-elementos
  de #game-stage); afectan a todo el juego.
- **Sonido ambiental:** campo `ambientSound` en el archivo de datos de
  la escena — ver "Añadir un sonido" más abajo.

### Añadir un fondo

Todavía no hay arte real (placeholders de color plano en
`css/scenes.css`). Cuando haya uno:

1. Coloca la imagen en `/assets/backgrounds`.
2. Añade su ruta a un campo `background` en el archivo de datos de la
   escena.
3. En `GameplayScene.createElement()` (o en `onEnter`), aplica esa
   ruta como `background-image` del elemento `.scene-world`.

### Añadir un sonido o música

1. Coloca el archivo en `/assets/sounds` o `/assets/music`.
2. Regístralo con un id corto en `js/audio/audioManifest.js`
   (`SFX_MANIFEST`, `AMBIENT_MANIFEST` o `MUSIC_MANIFEST`).
3. Llama a `audioManager.playSfx('miId')`,
   `audioManager.playAmbient('miId')` o `audioManager.playMusic('miId')`
   — o, para el ambiente de una habitación, usa el campo
   `ambientSound`/`music` de su archivo de datos, que ya está
   conectado en `GameplayScene.onEnter()`.

Mientras el id no exista en el manifiesto, la llamada no falla: solo
avisa por consola en modo `CONFIG.DEBUG`.

### Cambiar el inventario / añadir un objeto de inventario

1. Define el objeto en `data/items.js`:

```js
export const ITEMS = {
  llave_maestra: new Item({
    id: 'llave_maestra',
    name: 'Llave maestra',
    description: 'Abre cualquier puerta de la planta. Probablemente.',
  }),
};
```

2. Para que el jugador lo recoja, un `InteractiveObject` necesita un
   verbo `use` con un `onUse` que llame a
   `inventory.addItem(ITEMS.llave_maestra)`.
3. El panel (`InventoryUI`) y el número de huecos
   (`CONFIG.INVENTORY_SIZE`) no necesitan cambios para objetos nuevos.

### Modificar el sistema de diálogos

- **Formato de un árbol de diálogo:** ver cualquier archivo en
  `data/dialogues/`. Cada nodo tiene `speaker`, `text`, y o bien
  `next` (avanza automáticamente) o `choices: [{ label, next }]`
  (espera una elección). Un nodo sin ninguno de los dos termina la
  conversación.
- **Banderas de historia:** `flags: ['id']` en un nodo (se marcan al
  mostrarse) y `flag: 'id'` en una elección (se marca al elegirla).
  Se consultan en cualquier parte con `gameState.hasFlag('id')` — es
  el enganche entre conversaciones, puzles y eventos futuros.
- **Arranque condicional:** `start` puede ser una función
  `(gameState) => nodeId` para que la conversación empiece distinta
  según las banderas (ver neighbor9A.js: la Sra. Aurora cambia de tema
  cuando ya abriste el cuarto de contadores).
- **Eventos de escena:** el patrón está en Floor9Scene.js — comprobar
  banderas en onEnter, programar el susto con temporizadores (que se
  limpian en onExit) y marcar una bandera para no repetirlo.
- **Sonido por letra:** DialogueBox emite el sfx `dialogueBlip` cada
  dos letras; sonará en cuanto exista el archivo en el manifiesto.
- **Retratos:** campo `portrait` en el nodo; hoy siempre es `null`
  (círculo vacío en `css/dialogue.css`).
- **Velocidad del texto:** `settings.textSpeed`, ajustable desde el
  menú de Opciones.

### Crear un puzle

Los puzles se definen **en los datos de la escena**, no en código. Un
objeto interactivo con campo `puzzle` lo lanza al Usarlo:

```js
{
  type: 'object',
  id: 'meter_room_door',
  x: 1490,
  verbs: ['examine', 'use'],
  examineText: 'Una puerta metálica con un teclado numérico...',
  puzzle: {
    type: 'code',              // tipo registrado en puzzleRunner.js
    code: '1200',
    title: 'Cuarto de contadores',
    solvedFlag: 'meterRoomOpened',
    solvedText: 'El cerrojo se abre...',
    alreadySolvedText: 'Ya está abierto.',
    rewardItemId: 'polaroid',  // opcional, de data/items.js
  },
}
```

El runner marca la bandera, entrega la recompensa, hace sonar
`unlock`, sacude la cámara y emite `puzzle:solved`. **El puzle de
referencia** es el cuarto de contadores de la Planta 9: la clave
(las doce, 1200) se deduce observando los relojes parados y hablando
con la Sra. Aurora y con Cosme — patrón "observa el escenario", no
"busca la llave".

Hay dos tipos de puzle ya implementados en `RUNNERS`:

- `type: 'code'` — teclado numérico (el ejemplo de arriba).
- `type: 'item'` — entrega de objeto: exige llevar `itemId` en el
  inventario; con `consumesItem: true` el objeto se gasta. Campos
  extra: `missingText` (sin el objeto) y `sfx` (sonido al resolver).
  El ejemplo es la puerta clausurada 9D, que pide la polaroid.

Para un **tipo de puzle nuevo** (relacionar fotografías, patrones de
sonido...): añade una función al mapa `RUNNERS` de
`js/puzzles/puzzleRunner.js`; si necesita interfaz propia, créala como
componente al estilo de `KeypadUI` y regístrala en `UIManager`.

### Modificar el sistema de guardado

- **Qué se guarda:** `js/save/SaveManager.js` combina
  `gameState.toJSON()` y los ids de los huecos de inventario.
- **Cambiar la forma del guardado:** edita `SaveSchema.js` y sube
  `SAVE_VERSION` si el cambio no es compatible con partidas viejas
  (`SaveManager.load()` ya descarta versiones distintas en vez de
  romperse).
- Los ajustes (volumen, velocidad de texto) **no** se guardan aquí:
  viven en `Settings.js`, aparte, porque no son parte de la partida.

### Modificar la cámara de fotos

Solo la estructura está lista: `PhotoMode.toggle()`/`takePhoto()`
registran una foto (id, escena, fecha) en `gameState.photos`, y
`PhotoUI` muestra el visor y el destello. Para implementar la mecánica
real (por ejemplo, guardar qué se estaba mirando), amplía
`PhotoMode.takePhoto()` — es el único método pensado para crecer.

---

## Catálogo de eventos (`gameEvents`)

| Evento | Payload | Quién lo emite | Quién escucha |
|---|---|---|---|
| `scene:changed` | `{ sceneId }` | `SceneManager` | sistemas que reaccionan a cambios de escena |
| `dialogue:started` | `{ dialogueId }` | `DialogueManager` | `DialogueBox` |
| `dialogue:line` | `{ speaker, text, portrait }` | `DialogueManager` | `DialogueBox` |
| `dialogue:choices` | `{ choices }` | `DialogueManager` | `DialogueBox` |
| `dialogue:ended` | `{ dialogueId }` | `DialogueManager` | `DialogueBox`, `GameplayScene` (reactiva movimiento) |
| `inventory:changed` | `{ slots }` | `Inventory` | `InventoryUI` |
| `inventory:slot-clicked` | `{ item, index }` | `InventoryUI` | (punto de extensión: usar/examinar objeto) |
| `interaction:focus-changed` | `{ entity }` | `InteractionSystem` | `HUD`, `InteractionMenu` |
| `interaction:menu-open` | `{ entity, actions }` | `InteractionSystem` | `InteractionMenu`, `HUD` |
| `interaction:menu-closed` | — | `InteractionSystem` | `InteractionMenu`, `HUD` |
| `elevator:state-changed` | `{ state }` (closed/open/moving) | `Elevator` | `ElevatorEntity` (puertas), `ElevatorPanel` (se oculta al arrancar) |
| `elevator:floor-denied` | `{ floorId }` | `Elevator` | `ElevatorPanel` (aviso visual) |
| `elevator:moving` | `{ fromNumber, toNumber }` | `Elevator` | `ElevatorEntity` (indicador parpadeante) |
| `elevator:arrived` | `{ floorId, number }` | `Elevator` | `ElevatorEntity` (indicador) |
| `puzzle:solved` | `{ puzzle, entity }` | `puzzleRunner` | (punto de extensión: reacciones de la escena) |
| `puzzle:failed` | `{ puzzle, entity, attempt }` | `puzzleRunner` | (punto de extensión) |
| `light:toggled` | `{ id, isOn, roomId }` | `Light` | `GameplayScene` (ambiente) |
| `settings:changed` | `{ musicVolume, sfxVolume, textSpeed }` | `Settings` | `AudioManager` |
| `game:saved` | `{ slot }` | `SaveManager` | `HUD` (notificación) |
| `game:loaded` | `{ slot }` | `SaveManager` | — |
| `state:flag-changed` | `{ id, value }` | `GameState` | (punto de extensión) |
| `photo:mode-changed` | `{ isActive }` | `PhotoMode` | `PhotoUI` |
| `photo:taken` | `{ id, sceneId, takenAt }` | `PhotoMode` | `PhotoUI` (destello) |

Antes de añadir un evento nuevo, comprueba si ya existe uno que sirva.
Antes de añadir una llamada directa entre singletons, pregúntate si en
realidad debería ser un evento (¿le importa a más de un sistema?).

---

## Convenciones de código

- **Módulos ES nativos**, sin bundler. Todas las rutas de import
  llevan la extensión `.js` explícita.
- **Exports nombrados siempre**, nunca `export default`.
- **Singletons de servicio**: `export const x = new X()` al final del
  archivo que define la clase.
- **Privado con `#`** para métodos internos; los campos de estado
  suelen ser públicos por simplicidad (este proyecto no tiene una capa
  de tests que dependa de encapsulación estricta).
- **Un verbo, una acción**: los verbos de interacción son siempre uno
  de `Verb.EXAMINE/TALK/OPEN/CLOSE/USE` (`js/engine/Interactable.js`).
  No inventes verbos nuevos sin necesidad real.
- **Sin imágenes**: todo el arte de objetos es CSS (`shape:
  { kind, width, height, color, skin }` en los datos de escena; el
  acabado de cada `skin` vive en `css/furniture.css`). No añadas
  imágenes de prueba; si un mueble necesita más detalle, mejora su
  skin. Ojo: las medidas en px de los skins están afinadas a los
  width/height declarados en los datos.
- **Comentarios solo cuando explican un porqué** no evidente en el
  código (una decisión, una restricción, un truco del navegador).

---

## Qué falta / próximos pasos

Esto es un primer capítulo jugable, no el juego completo. Lo que queda
claramente fuera de alcance a propósito:

- Arte real (fondos, personajes, iconos) — todo es placeholder de
  color plano. El menú ya tiene su hueco para
  `assets/ui/menu_background.png`.
- Archivos de sonido y música — **todo el código ya llama a sus ids**
  (pasos, puertas, ascensor, teclado, blip de diálogo, hover del
  menú...): basta con colocar los archivos y descomentar sus líneas en
  `js/audio/audioManifest.js`.
- Plantas 1–8 del edificio — existen en `data/floors.js` como
  bloqueadas, sin escena todavía.
- Condiciones en diálogos (nodos que cambian según banderas) — las
  banderas ya se escriben (`heardKeypadHint`, `sawStoppedClock`,
  `meterRoomOpened`...); falta que los árboles puedan leerlas.
- Mecánica real de la cámara de fotos — hoy solo registra que se tomó
  una foto, no qué había en ella. La polaroid velada del puzle es su
  anzuelo narrativo.
- Menú de pausa durante el juego (hoy solo hay menú principal).
- Recordar la posición exacta del jugador al cargar partida (hoy
  reaparece en el punto de entrada por defecto de la escena guardada).

Nada de esto debería requerir reestructurar lo ya construido: es
exactamente la lista de casillas que esta arquitectura se dejó
preparada para rellenar.
