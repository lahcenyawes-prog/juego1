import { CONFIG } from '../core/Config.js';

/**
 * Envoltorio fino sobre console.* con un prefijo consistente. Los
 * mensajes de depuración solo se muestran si CONFIG.DEBUG está activo,
 * para no ensuciar la consola en producción.
 */
const PREFIX = '[La Última Planta]';

export const logger = {
  debug(...args) {
    if (CONFIG.DEBUG) console.debug(PREFIX, ...args);
  },
  info(...args) {
    console.info(PREFIX, ...args);
  },
  warn(...args) {
    console.warn(PREFIX, ...args);
  },
  error(...args) {
    console.error(PREFIX, ...args);
  },
};
