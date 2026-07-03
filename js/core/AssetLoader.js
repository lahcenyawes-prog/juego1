/**
 * Precarga de imágenes y audio. La v1 del juego funciona sin arte real
 * (placeholders CSS), así que esta clase apenas se usa todavía, pero
 * deja lista la vía para cuando /assets empiece a llenarse: registra
 * un fondo o un sonido en su manifiesto (ver js/audio/audioManifest.js
 * y data/scenes/*.js) y esta clase se encargará de tenerlo listo antes
 * de que la escena se muestre.
 */
export class AssetLoader {
  #imageCache = new Map();

  loadImage(path) {
    if (this.#imageCache.has(path)) return this.#imageCache.get(path);

    const promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${path}`));
      image.src = path;
    });

    this.#imageCache.set(path, promise);
    return promise;
  }

  loadAudio(path) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = () => reject(new Error(`No se pudo cargar el audio: ${path}`));
      audio.src = path;
    });
  }

  /** Precarga una lista de rutas de imagen; ignora las que ya fallaron antes. */
  async preloadImages(paths = []) {
    const results = await Promise.allSettled(paths.map((path) => this.loadImage(path)));
    return results.filter((result) => result.status === 'fulfilled').map((result) => result.value);
  }
}

export const assetLoader = new AssetLoader();
