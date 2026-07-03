import { MainMenuScene } from './MainMenuScene.js';
import { IntroScene } from './IntroScene.js';
import { ApartmentScene } from './ApartmentScene.js';
import { Floor9Scene } from './Floor9Scene.js';

/**
 * Único lugar donde se registran las escenas del juego. Para añadir
 * una nueva: crea su clase en js/scenes/ (y su archivo de contenido en
 * data/scenes/ si es una habitación) y añade aquí una línea con el id
 * por el que se la invoca (sceneManager.changeScene('miId')). Ver
 * PROJECT_MAP.md → "Añadir una escena nueva".
 */
export function registerScenes(sceneManager) {
  sceneManager.register('main-menu', () => new MainMenuScene());
  sceneManager.register('intro', () => new IntroScene());
  sceneManager.register('apartment', () => new ApartmentScene());
  sceneManager.register('floor9', () => new Floor9Scene());
}
