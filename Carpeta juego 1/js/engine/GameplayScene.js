import { Scene } from './Scene.js';
import { Camera } from './Camera.js';
import { interactionSystem } from './InteractionSystem.js';
import { CONFIG } from '../core/Config.js';
import { input } from '../core/InputManager.js';
import { gameState } from '../core/GameState.js';
import { gameEvents } from '../core/EventBus.js';
import { createElement } from '../utils/dom.js';
import { audioManager } from '../audio/AudioManager.js';
import { dialogueManager } from '../dialogue/DialogueManager.js';
import { DustField } from '../effects/DustField.js';
import { AmbientFlicker } from '../effects/AmbientFlicker.js';
import { Player } from '../entities/Player.js';
import { InteractiveObject } from '../entities/InteractiveObject.js';
import { Door } from '../entities/Door.js';
import { Light } from '../entities/Light.js';
import { Character } from '../entities/Character.js';
import { ElevatorEntity } from '../building/ElevatorEntity.js';

// Distancia (px) entre pasos sonoros del jugador.
const FOOTSTEP_STRIDE = 52;
// El fondo lejano se desplaza a esta fracción de la cámara (parallax).
const BG_PARALLAX_FACTOR = 0.35;
// Moverse en profundidad es más lento que lateralmente (pseudo-perspectiva).
const DEPTH_SPEED_FACTOR = 0.55;

/** type (en los archivos de data/scenes/*.js) -> clase de entidad. */
const ENTITY_FACTORIES = {
  object: (config) => new InteractiveObject(config),
  door: (config) => new Door(config),
  light: (config) => new Light(config),
  character: (config) => new Character(config),
  elevator: (config) => new ElevatorEntity(config),
};

/**
 * Base común de cualquier escena "de mundo" (habitaciones, pasillos,
 * futuras plantas del edificio): jugador, cámara, suelo caminable y
 * una población de entidades construida automáticamente a partir de
 * un archivo de datos. Ver data/scenes/apartmentData.js como ejemplo.
 *
 * Las subclases (ApartmentScene, Floor9Scene...) normalmente solo
 * necesitan pasar sus datos al constructor y, si acaso, añadir lógica
 * propia puntual sobre onEnter/update.
 */
export class GameplayScene extends Scene {
  constructor(id, data) {
    super(id);
    this.data = data;
    this.entities = [];
    this.player = null;
    this.camera = null;
    this.worldElement = null;
    this.backgroundElement = null;
    this.unsubscribeLight = null;
    this.dustField = null;
    this.ambientFlicker = null;
    this.footstepDistance = 0;
  }

  onEnter(context = {}) {
    this.element = this.createElement();
    this.worldElement = this.element.querySelector('.scene-world');
    this.worldElement.style.width = `${this.data.width}px`;
    this.backgroundElement = this.element.querySelector('.scene-bg');
    this.backgroundElement.style.width = `${this.data.width}px`;
    if (this.data.wallColors) {
      this.element.style.setProperty('--scene-wall-top', this.data.wallColors.top);
      this.element.style.setProperty('--scene-wall-bottom', this.data.wallColors.bottom);
    }
    if (this.data.floorColors) {
      this.element.style.setProperty('--scene-floor-near', this.data.floorColors.near);
      this.element.style.setProperty('--scene-floor-far', this.data.floorColors.far);
    }

    this.#populateFromData();

    const spawn = this.#resolveSpawn(context.spawnId);
    this.player = new Player({ x: spawn.x, depth: spawn.depth });
    this.worldElement.appendChild(this.player.getElement());

    this.camera = new Camera(CONFIG.VIEWPORT_WIDTH);
    this.camera.setBounds(0, Math.max(this.data.width - CONFIG.VIEWPORT_WIDTH, 0));
    this.camera.follow(this.player);
    this.camera.snapToTarget();
    this.#applyCameraOffset();

    gameState.currentSceneId = this.id;
    if (this.data.floorId) gameState.currentFloorId = this.data.floorId;
    interactionSystem.setScene(this);

    if (this.data.ambientSound) audioManager.playAmbient(this.data.ambientSound);
    if (this.data.music) audioManager.playMusic(this.data.music);

    this.unsubscribeLight = gameEvents.on('light:toggled', () => this.#refreshAmbiance());
    this.#refreshAmbiance();

    // Atmósfera: polvo, respiración y parpadeo ambiental, configurables
    // por escena desde su archivo de datos.
    if (this.data.dust !== false) {
      this.dustField = new DustField(this.element, { count: this.data.dustCount ?? 16 });
    }
    if (this.data.breathe !== false) {
      this.element.classList.add('fx-breathe');
    }
    if (this.data.ambientFlicker) {
      this.ambientFlicker = new AmbientFlicker();
      this.ambientFlicker.start(this.element);
    }
  }

  onExit() {
    this.unsubscribeLight?.();
    this.unsubscribeLight = null;
    this.ambientFlicker?.stop();
    this.ambientFlicker = null;
    this.dustField?.destroy();
    this.dustField = null;
    interactionSystem.setScene(null);
    audioManager.stopAmbient();
    this.entities.forEach((entity) => entity.destroy());
    this.entities = [];
    this.player?.destroy();
    this.player = null;
  }

  update(dt) {
    if (!dialogueManager.isActive) {
      this.#handleMovement(dt);
      interactionSystem.update(dt, this.player);
    } else {
      this.player?.setWalking(false);
    }

    this.entities.forEach((entity) => entity.update(dt));
    this.camera?.update(dt);
    this.#applyCameraOffset();
  }

  createElement() {
    const scene = createElement('div', 'scene');
    // El fondo va antes que el mundo: se desplaza más lento (parallax).
    scene.appendChild(createElement('div', 'scene-bg'));
    const world = createElement('div', 'scene-world');
    world.appendChild(createElement('div', 'scene-floor'));
    scene.appendChild(world);
    scene.appendChild(createElement('div', 'scene-haze'));
    scene.appendChild(createElement('div', 'scene-ambient-overlay'));
    return scene;
  }

  addEntity(entity) {
    this.entities.push(entity);
    this.worldElement.appendChild(entity.getElement());
    return entity;
  }

  getInteractableEntities() {
    return this.entities.filter((entity) => entity.isInteractable);
  }

  getEntityById(id) {
    return this.entities.find((entity) => entity.id === id);
  }

  setDark(isDark) {
    this.element.classList.toggle('is-dark', isDark);
  }

  /** La habitación se oscurece cuando todas sus luces están apagadas. */
  #refreshAmbiance() {
    const lights = this.entities.filter((entity) => entity instanceof Light);
    if (lights.length === 0) return;
    this.setDark(lights.every((light) => !light.isOn));
  }

  #populateFromData() {
    for (const config of this.data.objects ?? []) {
      const factory = ENTITY_FACTORIES[config.type];
      if (!factory) {
        console.warn(`[GameplayScene] Tipo de entidad desconocido: "${config.type}" (id: ${config.id})`);
        continue;
      }
      this.addEntity(factory(config));
    }
  }

  #resolveSpawn(spawnId) {
    const spawns = this.data.spawns ?? {};
    return spawns[spawnId] ?? this.data.playerStart ?? { x: 100, y: 0 };
  }

  #handleMovement(dt) {
    if (!this.player) return;
    const bounds = this.data.bounds ?? { min: 0, max: this.data.width };

    let dx = 0;
    let dy = 0;
    if (input.isActionDown('moveLeft')) dx = -CONFIG.PLAYER_SPEED * dt;
    else if (input.isActionDown('moveRight')) dx = CONFIG.PLAYER_SPEED * dt;
    if (input.isActionDown('moveUp')) dy = CONFIG.PLAYER_SPEED * DEPTH_SPEED_FACTOR * dt;
    else if (input.isActionDown('moveDown')) dy = -CONFIG.PLAYER_SPEED * DEPTH_SPEED_FACTOR * dt;

    const isMoving = dx !== 0 || dy !== 0;
    this.player.setWalking(isMoving);
    if (!isMoving) return;

    this.player.move(dx, dy, bounds);

    this.footstepDistance += Math.abs(dx) + Math.abs(dy);
    if (this.footstepDistance >= FOOTSTEP_STRIDE) {
      this.footstepDistance = 0;
      audioManager.playSfx('footstep');
    }
  }

  #applyCameraOffset() {
    if (!this.camera || !this.worldElement) return;
    const offset = this.camera.getOffset();
    this.worldElement.style.transform = `translateX(${-offset}px)`;
    this.backgroundElement.style.transform = `translateX(${-offset * BG_PARALLAX_FACTOR}px)`;
  }
}
