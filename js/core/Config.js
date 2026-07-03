/**
 * Constantes globales del juego. Cualquier número o clave "mágica"
 * que se use en más de un sitio debe vivir aquí.
 */
export const CONFIG = Object.freeze({
  VIEWPORT_WIDTH: 1280,
  VIEWPORT_HEIGHT: 720,

  STORAGE_PREFIX: 'ultimaPlanta',
  SETTINGS_KEY: 'ultimaPlanta.settings',

  DEBUG: false,

  PLAYER_SPEED: 220, // px/s
  INTERACTION_RANGE: 90, // px de distancia máxima para poder interactuar

  DIALOGUE_CHAR_INTERVAL: 28, // ms entre letras a velocidad normal
  INVENTORY_SIZE: 6,

  // Altura visual de la línea de suelo, en px. Solo presentación: los
  // pies de las entidades se dibujan a esta altura para quedar "dentro"
  // del suelo con perspectiva. Debe coincidir con --floor-line
  // (css/variables.css); la usa js/ui/entityAnchor.js.
  FLOOR_BASELINE: 58,

  DEFAULT_MUSIC_VOLUME: 0.6,
  DEFAULT_SFX_VOLUME: 0.8,
});

export const KEY_BINDINGS = Object.freeze({
  moveLeft: ['ArrowLeft', 'KeyA'],
  moveRight: ['ArrowRight', 'KeyD'],
  moveUp: ['ArrowUp', 'KeyW'],
  moveDown: ['ArrowDown', 'KeyS'],
  interact: ['KeyE', 'Enter', 'Space'],
  toggleInventory: ['KeyI', 'Tab'],
  togglePhotoMode: ['KeyC'],
  cancel: ['Escape'],
});
