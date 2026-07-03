# /assets/backgrounds

Fondos de las escenas (habitaciones, pasillos, futuras plantas).

Todavía no se usa ninguno: las escenas actuales se dibujan con
`.scene-world` y `.scene-floor` en CSS (ver `css/scenes.css`). Cuando
haya arte final:

1. Coloca aquí la imagen (p. ej. `apartment_bg.png`).
2. Añade su ruta al campo `background` del archivo de datos de la
   escena correspondiente en `/data/scenes/` (ese campo ya existe en
   el esquema, solo no se usa aún).
3. En `js/engine/GameplayScene.js`, `createElement()` es el sitio
   donde aplicar esa imagen como fondo de `.scene-world` en lugar del
   color plano actual.

Convención de nombres: `nombreEscena_bg.png` (minúsculas, snake_case).
