/**
 * Vecino del 9ºB — Sr. Baltasar. Huraño, monosílabos, fue el portero
 * del edificio hace décadas y no quiere que se sepa. Su hostilidad
 * esconde miedo: si el jugador insiste con calma, algo se le escapa.
 */
export const neighbor9B = {
  start: 'saludo',
  nodes: {
    saludo: {
      speaker: 'Sr. Baltasar (9ºB)',
      text: 'Ahora no.',
      choices: [
        { label: 'Solo quería presentarme.', next: 'presentacion' },
        { label: 'Perdone. Ya me voy.', next: 'cierre_seco' },
      ],
    },
    presentacion: {
      speaker: 'Sr. Baltasar (9ºB)',
      text: 'Ya sé quién eres. El del 9ºD. Aquí se sabe todo; lo que pasa es que no se dice.',
      choices: [
        { label: '¿Usted lleva mucho viviendo aquí?', next: 'pasado_1' },
        { label: '¿Qué es lo que no se dice?', next: 'evasiva' },
      ],
    },
    pasado_1: {
      speaker: 'Sr. Baltasar (9ºB)',
      text: 'Demasiado. Antes trabajaba abajo, en portería. Tenía llaves de todas partes. De todas.',
      next: 'pasado_2',
    },
    pasado_2: {
      speaker: 'Sr. Baltasar (9ºB)',
      text: 'Las devolví. Todas menos el peso que hacen. Eso no se devuelve.',
      flags: ['knowsBaltasarWasDoorman'],
      next: 'cierre_cansado',
    },
    evasiva: {
      speaker: 'Sr. Baltasar (9ºB)',
      text: 'Si te lo dijera, ya se estaría diciendo. Y yo no digo. Ahí está el truco.',
      next: 'cierre_seco',
    },
    cierre_cansado: {
      speaker: 'Sr. Baltasar (9ºB)',
      text: 'Vete a dormir. Y si oyes el ascensor moverse solo... ya sabes dónde NO tienes que mirar.',
    },
    cierre_seco: {
      speaker: 'Sr. Baltasar (9ºB)',
      text: '...',
    },
  },
};
