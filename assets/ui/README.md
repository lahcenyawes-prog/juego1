# /assets/ui

Iconos y elementos gráficos de interfaz: el fondo del menú, el icono
de inventario, el marco de la cámara, botones, etc.

**`menu_background.png` ya está conectado:** colócalo aquí (a pantalla
completa, 1280×720 o mayor) y el menú principal lo mostrará
automáticamente bajo su velo oscuro — la regla está en `.main-menu`
dentro de `css/menu.css`. Mientras no exista, se ve el degradado de
respaldo.

El resto de la interfaz es CSS puro (ver `/css`). Cuando haya arte
final, sustitúyelo directamente en el CSS del componente
correspondiente (p. ej. `css/hud.css` para el botón de inventario,
`css/photo.css` para el visor de la cámara) usando `background-image`
en vez de color plano.

Convención de nombres: `nombre_elemento.png`, en minúsculas y snake_case.
