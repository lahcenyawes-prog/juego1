# /assets/music

Música de fondo: tema del menú, temas por planta o por momento
narrativo.

Todavía no hay ningún archivo real. Para añadir una pista:

1. Coloca aquí el archivo (p. ej. `menu_theme.mp3`).
2. Regístrala en `MUSIC_MANIFEST` dentro de `js/audio/audioManifest.js`,
   con un id corto.
3. Llama a `audioManager.playMusic('miId')` desde donde corresponda
   (p. ej. en `onEnter()` de una escena) o añade el campo `music` al
   archivo de datos de esa escena en `/data/scenes/` — ese campo ya
   está conectado en `GameplayScene.onEnter()`.

Formato recomendado: `.mp3` u `.ogg`, nombres en snake_case.
