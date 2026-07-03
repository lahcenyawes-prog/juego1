/**
 * Contenido del apartamento del protagonista (9ºD): cuatro zonas de
 * izquierda a derecha — dormitorio, baño, salón y cocina — y la puerta
 * al pasillo al fondo. GameplayScene crea una entidad por cada entrada
 * de `objects` según su `type` (object | door | light | character |
 * elevator); ver ENTITY_FACTORIES en js/engine/GameplayScene.js.
 *
 * El reloj parado a las doce es la pista principal del puzle del
 * cuarto de contadores de la Planta 9 (código 1200).
 *
 * Para añadir un objeto nuevo basta con añadir una entrada aquí: no
 * hace falta tocar ningún archivo de js/.
 */
export const apartmentData = {
  width: 2300,
  floorId: 'floor9',
  ambientSound: 'apartment',
  ambientFlicker: false,
  wallColors: { top: '#171320', bottom: '#0f0c14' },
  floorColors: { near: '#1c1721', far: '#0b0a0f' },
  playerStart: { x: 170, y: 0 },
  bounds: { min: 70, max: 2240 },
  spawns: {
    from_hallway: { x: 2140, y: 0 },
  },

  objects: [
    // ---- Dormitorio ----
    {
      type: 'object',
      id: 'bed',
      label: 'Dormitorio',
      x: 220,
      shape: { kind: 'rect', width: 130, height: 44, color: '#2c2733' },
      verbs: ['examine', 'use'],
      examineText: 'Las sábanas siguen deshechas de esta mañana. O de ayer. Los días se parecen demasiado últimamente.',
      useText: 'Todavía no. Si te duermes ahora, volverá a ser mañana. Y esta noche importa.',
    },
    {
      type: 'object',
      id: 'nightstand_letter',
      x: 330,
      shape: { kind: 'rect', width: 26, height: 18, color: '#c9bd9a' },
      examineFlag: 'readWelcomeLetter',
      examineText:
        '"Bienvenido de nuevo al Meridiano. La comunidad no olvida a los suyos." Sin firma. Estaba bajo la puerta el día que llegaste. Lo de "de nuevo" nunca te ha cuadrado.',
    },
    {
      type: 'light',
      id: 'bedroom_light',
      x: 140,
      y: 260,
      startsOn: true,
      shape: { kind: 'rect', width: 14, height: 22, color: '#d8c98a' },
      examineText: 'El interruptor del dormitorio. La luz zumba un poco al encenderse.',
    },

    // ---- Baño ----
    {
      type: 'object',
      id: 'mirror',
      label: 'Baño',
      x: 700,
      y: 130,
      shape: { kind: 'rect', width: 54, height: 70, color: '#27313b' },
      examineFlag: 'lookedInMirror',
      examineText:
        'Te miras. Estás cansado, nada más. Aun así, durante un segundo, tienes la sensación de que el reflejo tarda un poco más que tú en apartar la vista.',
    },
    {
      type: 'object',
      id: 'sink',
      x: 620,
      shape: { kind: 'rect', width: 44, height: 36, color: '#3a4048' },
      verbs: ['examine', 'use'],
      examineText: 'El lavabo. La porcelana tiene una grieta fina que no recuerdas de antes.',
      useText: 'Abres el grifo. Las tuberías tosen dos veces antes de soltar el agua. Suenan como si vinieran de muy arriba.',
    },

    // ---- Salón ----
    {
      type: 'object',
      id: 'sofa',
      label: 'Salón',
      x: 1050,
      shape: { kind: 'rect', width: 140, height: 50, color: '#3b3230' },
      examineText: 'El hueco de tu cuerpo sigue marcado en el cojín. Algo más profundo de lo que debería.',
    },
    {
      type: 'object',
      id: 'tv',
      x: 1200,
      shape: { kind: 'rect', width: 76, height: 52, color: '#10141c', glow: 'rgba(80, 110, 140, 0.12)' },
      verbs: ['examine', 'use'],
      examineText: 'La televisión apagada refleja el salón entero. Un poco más oscuro de lo que es.',
      useText: 'Solo estática, en todos los canales. Entre la nieve, por un instante, te parece ver un pasillo largo. Apagas.',
    },
    {
      type: 'object',
      id: 'framed_photo',
      x: 1320,
      y: 150,
      shape: { kind: 'rect', width: 34, height: 44, color: '#2f2b24' },
      examineText:
        'Una fotografía enmarcada. Sales tú, más joven, delante de este mismo portal. No recuerdas quién la hizo. No recuerdas haberla colgado.',
    },
    {
      type: 'object',
      id: 'wall_clock',
      x: 1430,
      y: 210,
      shape: { kind: 'circle', width: 40, height: 40, color: '#4a4438' },
      examineFlag: 'sawStoppedClock',
      examineText:
        'El reloj de pared. Está parado en las doce en punto, con las dos agujas abrazadas. Le diste cuerda anteayer.',
    },
    {
      type: 'object',
      id: 'window',
      x: 1560,
      y: 110,
      shape: { kind: 'rect', width: 90, height: 110, color: '#1a2430' },
      examineText:
        'La fachada de enfrente, a oscuras. Cuentas las plantas por costumbre: ocho. Desde aquí, tu edificio siempre parece tener una más que los demás.',
    },
    {
      type: 'object',
      id: 'desk',
      x: 1700,
      shape: { kind: 'rect', width: 100, height: 46, color: '#3d3428' },
      examineText: 'Tu escritorio. Facturas, un bolígrafo sin capuchón y polvo con forma de cosas que ya no están.',
    },
    {
      type: 'object',
      id: 'desk_note',
      x: 1760,
      y: 48,
      shape: { kind: 'rect', width: 26, height: 16, color: '#c9bd9a' },
      examineText: '"No cojas el ascensor después de medianoche." Tu propia letra. No recuerdas haberlo escrito.',
    },
    {
      type: 'light',
      id: 'living_room_light',
      x: 950,
      y: 260,
      startsOn: true,
      shape: { kind: 'rect', width: 16, height: 24, color: '#d8c98a' },
      examineText: 'El interruptor del salón.',
    },

    // ---- Cocina ----
    {
      type: 'door',
      id: 'fridge',
      label: 'Cocina',
      x: 1930,
      shape: { kind: 'rect', width: 58, height: 100, color: '#4c5258' },
      examineText: 'El frigorífico zumba con un motor cansado. Dentro: media lata, mostaza y un frío que se agradece.',
    },
    {
      type: 'object',
      id: 'stove',
      x: 2030,
      shape: { kind: 'rect', width: 70, height: 46, color: '#2e2e34' },
      examineText: 'Los fogones. Llevan tanto sin usarse que la cocina ya ni huele a nada.',
    },

    // ---- Salida ----
    {
      type: 'door',
      id: 'apartment_door',
      x: 2200,
      shape: { kind: 'rect', width: 54, height: 96, color: '#4a3f33' },
      examineText: 'La puerta de tu casa, el 9ºD. Da al pasillo de la novena planta.',
      leadsTo: 'floor9',
      spawnAt: 'apartment_door',
    },
  ],
};
