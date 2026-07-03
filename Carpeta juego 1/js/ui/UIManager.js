import { fadeTransition } from './FadeTransition.js';
import { interactionMenu } from './InteractionMenu.js';
import { hud } from './HUD.js';
import { optionsMenu } from './OptionsMenu.js';
import { keypadUI } from './KeypadUI.js';
import { dialogueBox } from '../dialogue/DialogueBox.js';
import { inventoryUI } from '../inventory/InventoryUI.js';
import { elevatorPanel } from '../building/ElevatorPanel.js';
import { photoUI } from '../photo/PhotoUI.js';

/**
 * Punto único donde cada componente de interfaz se conecta con su capa
 * del DOM (ver las capas declaradas en index.html). Game.js llama a
 * init() una sola vez al arrancar; ningún otro archivo debería tocar
 * esos elementos raíz directamente.
 *
 * Para añadir un componente de UI nuevo: créalo como los demás (una
 * clase con `init(rootElement)` que escucha gameEvents), impórtalo
 * aquí y añade una línea a init(). Si es específico de un sistema
 * concreto (diálogo, inventario...) vive en su propia carpeta; si es
 * genérico y transversal, vive en js/ui.
 */
class UIManager {
  init(layers) {
    hud.init(layers.hud);
    interactionMenu.init(layers.interaction);
    dialogueBox.init(layers.dialogue);
    inventoryUI.init(layers.inventory);
    elevatorPanel.init(layers.elevator);
    keypadUI.init(layers.puzzle);
    photoUI.init(layers.photo);
    optionsMenu.init(layers.menu);
    fadeTransition.init(layers.transition);
  }
}

export const uiManager = new UIManager();
