import { CONFIG } from '../core/Config.js';
import { gameEvents } from '../core/EventBus.js';
import { logger } from '../utils/logger.js';
import { gameState } from '../core/GameState.js';
import { inventory } from '../inventory/Inventory.js';
import { ITEMS } from '../../data/items.js';
import { SAVE_VERSION } from './SaveSchema.js';

function storageKey(slot) {
  return `${CONFIG.STORAGE_PREFIX}.save.${slot}`;
}

/**
 * Persistencia de partida en localStorage. Combina GameState (dónde
 * está el jugador, banderas de historia) e Inventory en un único
 * documento versionado. Settings.js se guarda aparte porque no es
 * parte de la partida, es una preferencia del jugador.
 */
export class SaveManager {
  save(slot = 'default') {
    const payload = {
      version: SAVE_VERSION,
      savedAt: new Date().toISOString(),
      gameState: gameState.toJSON(),
      inventorySlots: inventory.getSlots().map((item) => item?.id ?? null),
    };

    try {
      localStorage.setItem(storageKey(slot), JSON.stringify(payload));
      gameEvents.emit('game:saved', { slot });
      return true;
    } catch (error) {
      logger.error(`No se pudo guardar la partida ("${slot}").`, error);
      return false;
    }
  }

  load(slot = 'default') {
    const raw = localStorage.getItem(storageKey(slot));
    if (!raw) return false;

    try {
      const payload = JSON.parse(raw);
      if (payload.version !== SAVE_VERSION) {
        logger.warn(`La partida guardada ("${slot}") es de otra versión y se ignora.`);
        return false;
      }

      gameState.loadFromJSON(payload.gameState ?? {});
      inventory.loadSlots((payload.inventorySlots ?? []).map((id) => (id ? ITEMS[id] ?? null : null)));
      gameEvents.emit('game:loaded', { slot });
      return true;
    } catch (error) {
      logger.error(`No se pudo leer la partida guardada ("${slot}").`, error);
      return false;
    }
  }

  hasSave(slot = 'default') {
    return localStorage.getItem(storageKey(slot)) !== null;
  }

  deleteSave(slot = 'default') {
    localStorage.removeItem(storageKey(slot));
  }
}

export const saveManager = new SaveManager();
