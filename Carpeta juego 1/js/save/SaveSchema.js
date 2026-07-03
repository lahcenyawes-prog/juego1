/**
 * Forma exacta de una partida guardada. Subir SAVE_VERSION cuando la
 * forma cambie de manera incompatible; SaveManager.load() ya rechaza
 * (en lugar de reventar) cualquier partida de una versión distinta.
 */
export const SAVE_VERSION = 1;

export function createEmptySave() {
  return {
    version: SAVE_VERSION,
    savedAt: null,
    gameState: null,
    inventorySlots: [],
  };
}
