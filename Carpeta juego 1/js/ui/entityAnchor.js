import { sceneManager } from '../engine/SceneManager.js';
import { CONFIG } from '../core/Config.js';

const DEFAULT_ANCHOR_HEIGHT = 60;

/**
 * Punto de anclaje en pantalla (no en coordenadas de mundo) justo
 * encima de una entidad, para flotar sobre ella un prompt o un menú.
 * Usado por HUD.js y InteractionMenu.js para no repetir el cálculo.
 *
 * Suma FLOOR_BASELINE porque las entidades se dibujan elevadas hasta
 * la línea de suelo (ver --floor-line en variables.css).
 */
export function getEntityAnchor(entity, margin = 14) {
  const anchorHeight = entity.config?.shape?.height ?? DEFAULT_ANCHOR_HEIGHT;
  return {
    left: sceneManager.worldToScreenX(entity.x),
    bottom: entity.y + CONFIG.FLOOR_BASELINE + anchorHeight + margin,
  };
}
