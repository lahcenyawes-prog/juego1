/**
 * Vecino del 9ºC — Cosme. Amable en exceso, sonríe antes de tiempo y
 * habla del edificio como si fuera un ser querido. Es el más
 * inquietante precisamente porque nunca dice nada abiertamente
 * amenazador. Deja caer la pista de los relojes parados.
 */
export const neighbor9C = {
  start: 'saludo',
  nodes: {
    saludo: {
      speaker: 'Cosme (9ºC)',
      text: 'Llevaba tiempo esperando a alguien nuevo en este piso. El edificio también, se le nota.',
      choices: [
        { label: '¿Esperando... a mí?', next: 'aclara' },
        { label: '¿"Se le nota"? ¿Al edificio?', next: 'edificio_1' },
        { label: 'Prefiero no hablar de eso.', next: 'evade' },
      ],
    },
    aclara: {
      speaker: 'Cosme (9ºC)',
      text: 'A quien llegara. Da igual el nombre. Siempre llega alguien, y siempre al 9ºD.',
      next: 'final',
    },
    edificio_1: {
      speaker: 'Cosme (9ºC)',
      text: 'Claro. Respira despacio, como todos los viejos. ¿No lo notas por las noches? Ese vaivén.',
      next: 'edificio_2',
    },
    edificio_2: {
      speaker: 'Cosme (9ºC)',
      text: '¿Y te has fijado en los relojes? En este edificio todos acaban parándose. Y todos a la misma hora, que es lo bonito.',
      flags: ['heardClocksHint'],
      choices: [
        { label: '¿A qué hora?', next: 'edificio_3' },
        { label: 'Eso es que son viejos, sin más.', next: 'edificio_esceptico' },
      ],
    },
    edificio_3: {
      speaker: 'Cosme (9ºC)',
      text: 'Compruébalo tú mismo. El tuyo también se habrá parado ya; siempre empiezan por el piso nuevo.',
      next: 'final',
    },
    edificio_esceptico: {
      speaker: 'Cosme (9ºC)',
      text: 'Puede ser, puede ser. Los viejos nos paramos todos a la misma hora, al final.',
      next: 'final',
    },
    evade: {
      speaker: 'Cosme (9ºC)',
      text: 'Como quieras. Aquí nadie habla de nada. Encajarás de maravilla.',
      next: 'final',
    },
    final: {
      speaker: 'Cosme (9ºC)',
      text: 'Nos veremos por el pasillo. Siempre nos vemos por el pasillo.',
    },
  },
};
