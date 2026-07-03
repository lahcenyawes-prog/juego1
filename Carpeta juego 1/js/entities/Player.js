import { Entity } from './Entity.js';
import { CONFIG } from '../core/Config.js';
import { createElement } from '../utils/dom.js';
import { clamp, lerp } from '../utils/math.js';

/*
  Rango de profundidad caminable dentro de la franja de suelo (px desde
  el borde inferior del mundo) y escala aparente en cada extremo. Solo
  presentación: la interacción sigue midiendo distancia horizontal.
*/
export const DEPTH_MIN = 16; // primer plano (más cerca de la pantalla)
export const DEPTH_MAX = 100; // al fondo, junto al zócalo
const SCALE_NEAR = 1.12;
const SCALE_FAR = 0.84;

/**
 * El protagonista. No es interactivo consigo mismo: solo se mueve, ahora
 * también en profundidad (W/S): al alejarse hacia la pared encoge y se
 * dibuja detrás; al acercarse crece y pasa por delante de los muebles.
 *
 * El placeholder es un maniquí articulado por divs (cabeza, torso,
 * brazos y piernas) definido en css/scenes.css. Estructura:
 *   .player__shadow — elipse de contacto con el suelo (no gira ni bota)
 *   .player__flip   — voltea el rig al mirar a la izquierda
 *   .player__rig    — respira en reposo y bota al andar; contiene los miembros
 * El volteo y las animaciones viven en capas separadas para que sus
 * transforms no se pisen entre sí.
 */
export class Player extends Entity {
  constructor({ x, depth = CONFIG.FLOOR_BASELINE }) {
    super({ id: 'player', x, y: 0 });
    this.facing = 'right';
    this.setDepth(depth);
  }

  createElement() {
    const el = createElement('div', 'player');
    el.appendChild(createElement('div', 'player__shadow'));

    const flip = createElement('div', 'player__flip');
    const rig = createElement('div', 'player__rig');
    for (const part of ['arm--far', 'leg--far', 'torso', 'head', 'leg--near', 'arm--near']) {
      rig.appendChild(createElement('div', `player__part player__${part}`));
    }
    flip.appendChild(rig);
    el.appendChild(flip);
    return el;
  }

  /** Desplaza en las dos dimensiones, respetando límites de escena y suelo. */
  move(dx, dy, xBounds) {
    if (dx !== 0) {
      this.facing = dx < 0 ? 'left' : 'right';
      this.element.classList.toggle('is-facing-left', this.facing === 'left');
    }

    this.x = clamp(this.x + dx, xBounds.min, xBounds.max);
    this.setDepth(this.y + dy);
  }

  setDepth(depth) {
    this.y = clamp(depth, DEPTH_MIN, DEPTH_MAX);
    this.applyPosition();
  }

  /** Además de left/bottom, aplica la escala y la capa según profundidad. */
  applyPosition() {
    const t = clamp((this.y - DEPTH_MIN) / (DEPTH_MAX - DEPTH_MIN), 0, 1);
    const scale = lerp(SCALE_NEAR, SCALE_FAR, t);

    this.element.style.left = `${this.x}px`;
    this.element.style.bottom = `${this.y}px`;
    this.element.style.transform = `translateX(-50%) scale(${scale.toFixed(3)})`;
    // Cuanto más cerca de la pantalla, por delante de más cosas se dibuja.
    this.element.style.zIndex = String(Math.round(clamp(98 - this.y, 12, 90)));
  }

  /** Activa/desactiva el balanceo de caminar (lo llama GameplayScene cada frame). */
  setWalking(isWalking) {
    this.element.classList.toggle('is-walking', isWalking);
  }
}
