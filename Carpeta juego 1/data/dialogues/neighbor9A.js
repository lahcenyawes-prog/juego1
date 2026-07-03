/**
 * Vecina del 9ºA — Sra. Aurora. Nerviosa, vigilante, habla en voz baja
 * y da la información a regañadientes, como si le costara caro. Es la
 * pista principal del puzle del cuarto de contadores: sabe cuál era la
 * regla nemotécnica de la clave.
 */
export const neighbor9A = {
  start: 'saludo',
  nodes: {
    saludo: {
      speaker: 'Sra. Aurora (9ºA)',
      text: 'Ah... eres tú. Del 9ºD, ¿verdad? No sueles salir mucho. Haces bien.',
      next: 'pregunta',
    },
    pregunta: {
      speaker: 'Sra. Aurora (9ºA)',
      text: '¿Has oído algo raro esta noche? Golpes, pasos... algo.',
      choices: [
        { label: 'No, nada fuera de lo normal.', next: 'respuesta_no' },
        { label: 'Sí. Pasos, encima de mí.', next: 'respuesta_si', flag: 'toldAuroraAboutSteps' },
        { label: '¿Qué es esa puerta metálica del fondo?', next: 'contadores_1' },
      ],
    },
    respuesta_no: {
      speaker: 'Sra. Aurora (9ºA)',
      text: 'Mejor. Tú sigue sin escuchar, así se vive más tranquilo aquí.',
      next: 'despedida',
    },
    respuesta_si: {
      speaker: 'Sra. Aurora (9ºA)',
      text: 'Encima de ti no vive nadie, cariño. Esta es la última planta. Siempre lo ha sido.',
      next: 'respuesta_si_2',
    },
    respuesta_si_2: {
      speaker: 'Sra. Aurora (9ºA)',
      text: 'Casi siempre.',
      next: 'despedida',
    },
    contadores_1: {
      speaker: 'Sra. Aurora (9ºA)',
      text: 'El cuarto de contadores. Mantenimiento dejó de venir hace años; ahora tiene uno de esos teclados con clave.',
      next: 'contadores_2',
    },
    contadores_2: {
      speaker: 'Sra. Aurora (9ºA)',
      text: 'El del mono azul decía que era fácil de recordar: "la hora en la que todo se detuvo". A mí eso nunca me ha hecho gracia.',
      flags: ['heardKeypadHint'],
      choices: [
        { label: '¿La hora en la que todo se detuvo?', next: 'contadores_3' },
        { label: 'Gracias. Lo recordaré.', next: 'despedida' },
      ],
    },
    contadores_3: {
      speaker: 'Sra. Aurora (9ºA)',
      text: 'Mira los relojes de este edificio, cariño. Míralos bien. Ninguno se ha vuelto a mover.',
      next: 'despedida',
    },
    despedida: {
      speaker: 'Sra. Aurora (9ºA)',
      text: 'Cierra bien tu puerta. Las de este piso no cierran solas.',
    },
  },
};
