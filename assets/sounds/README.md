# /assets/sounds

Efectos puntuales (puertas, pasos, el ascensor) y sonidos ambientales
en bucle de cada escena.

Todavía no hay ningún archivo real: `js/audio/SoundEffects.js` ya
sabe reproducirlos, pero `js/audio/audioManifest.js` no tiene rutas
que apuntar, así que cualquier llamada a `audioManager.playSfx(...)` o
`audioManager.playAmbient(...)` simplemente no hace nada (con un aviso
en consola si `CONFIG.DEBUG` está activo). Para añadir un sonido:

1. Coloca aquí el archivo (p. ej. `door_open.mp3`).
2. Regístralo en `SFX_MANIFEST` o `AMBIENT_MANIFEST` dentro de
   `js/audio/audioManifest.js`, con un id corto.
3. Llama a `audioManager.playSfx('miId')` o
   `audioManager.playAmbient('miId')` desde donde corresponda — para
   sonidos ambientales de una escena, el campo `ambientSound` del
   archivo de datos de esa escena en `/data/scenes/` ya está
   conectado.

Formato recomendado: `.mp3` u `.ogg`, nombres en snake_case.
