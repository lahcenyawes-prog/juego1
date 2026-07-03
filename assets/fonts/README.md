# /assets/fonts

Tipografías propias del juego.

Todavía no hay ninguna: `css/variables.css` usa fuentes de sistema
(`--font-display`, `--font-body`) como placeholder. Para añadir una
fuente propia:

1. Coloca aquí los archivos (p. ej. `display.woff2`).
2. Declárala con `@font-face` en `css/variables.css` (o en un nuevo
   `css/fonts.css` si son varias — recuerda enlazarlo en `index.html`).
3. Actualiza `--font-display` / `--font-body` (o añade una variable
   nueva) para que apunte al `font-family` declarado.

Formato recomendado: `.woff2` (con `.woff` como alternativa si hace
falta compatibilidad adicional).
