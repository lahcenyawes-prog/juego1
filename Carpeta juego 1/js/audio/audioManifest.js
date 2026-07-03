/**
 * Catálogo de audio del juego. Cuando añadas un archivo a
 * /assets/music o /assets/sounds, descomenta (o añade) su línea aquí.
 * El resto del código nunca usa rutas directamente, solo estos ids
 * (p. ej. `audioManager.playSfx('doorOpen')`), así que mover o
 * renombrar un archivo solo implica tocar esta lista.
 *
 * IMPORTANTE: el código del juego YA llama a todos estos ids (puertas,
 * pasos, ascensor, teclado, diálogo, menú...). Los managers ignoran
 * con un aviso de depuración cualquier id sin entrada, de modo que el
 * juego funciona en silencio hasta que existan los archivos: colocar
 * el .mp3/.ogg y descomentar la línea es todo lo que hace falta.
 */
export const MUSIC_MANIFEST = {
  // menuTheme: 'assets/music/menu_theme.mp3',
  // floor9Theme: 'assets/music/floor9_theme.mp3',
};

export const SFX_MANIFEST = {
  // --- Jugador ---
  // footstep: 'assets/sounds/footstep.mp3',

  // --- Puertas e interruptores ---
  // doorOpen: 'assets/sounds/door_open.mp3',
  // doorClose: 'assets/sounds/door_close.mp3',
  // switchClick: 'assets/sounds/switch_click.mp3',

  // --- Ascensor ---
  // elevatorOpen: 'assets/sounds/elevator_open.mp3',
  // elevatorClose: 'assets/sounds/elevator_close.mp3',
  // elevatorMove: 'assets/sounds/elevator_move.mp3',
  // elevatorDing: 'assets/sounds/elevator_ding.mp3',

  // --- Puzles ---
  // keypadPress: 'assets/sounds/keypad_press.mp3',
  // keypadError: 'assets/sounds/keypad_error.mp3',
  // unlock: 'assets/sounds/unlock.mp3',

  // --- Diálogo e interfaz ---
  // dialogueBlip: 'assets/sounds/dialogue_blip.mp3',
  // uiHover: 'assets/sounds/ui_hover.mp3',
  // uiSelect: 'assets/sounds/ui_select.mp3',

  // --- Atmósfera puntual ---
  // distantKnock: 'assets/sounds/distant_knock.mp3',
};

export const AMBIENT_MANIFEST = {
  // apartment: 'assets/sounds/apartment_ambience.mp3', // nevera, tuberías
  // hallway9: 'assets/sounds/hallway_ambience.mp3',    // zumbido, viento lejano
  // rain: 'assets/sounds/rain_loop.mp3',
  // wind: 'assets/sounds/wind_loop.mp3',
};
