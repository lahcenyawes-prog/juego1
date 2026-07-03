import { Game } from './core/Game.js';

// Si este script llega a ejecutarse, retiramos el aviso de "no arranca"
// del index.html; a partir de aquí los errores se ven en la consola.
document.getElementById('boot-fallback')?.remove();

const game = new Game();
game.init();
game.start();
