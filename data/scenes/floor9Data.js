/**
 * Pasillo de la Planta 9, la única accesible en este capítulo. Además
 * de los tres vecinos, contiene el puzle del cuarto de contadores:
 * un teclado de cuatro dígitos cuya clave (1200, "la hora en la que
 * todo se detuvo") se deduce observando los relojes parados a las
 * doce y hablando con los vecinos. La recompensa es la polaroid velada
 * (data/items.js), primer objeto de inventario del juego.
 *
 * Ver apartmentData.js para el formato general de este archivo.
 */
export const floor9Data = {
  width: 1900,
  floorId: 'floor9',
  ambientSound: 'hallway9',
  ambientFlicker: true,
  wallColors: { top: '#101521', bottom: '#0a0d14' },
  floorColors: { near: '#151a24', far: '#08090d' },
  playerStart: { x: 150, y: 0 },
  bounds: { min: 40, max: 1860 },
  spawns: {
    apartment_door: { x: 150, y: 0 },
    elevator: { x: 1680, y: 0 },
  },

  objects: [
    {
      type: 'door',
      id: 'door_to_apartment',
      x: 80,
      shape: { kind: 'rect', width: 54, height: 96, color: '#4a3f33' },
      examineText: 'Tu puerta, el 9ºD. Al menos, hoy todavía lo es.',
      leadsTo: 'apartment',
      spawnAt: 'from_hallway',
    },
    {
      type: 'door',
      id: 'door_9a',
      x: 300,
      isLocked: true,
      shape: { kind: 'rect', width: 50, height: 92, color: '#39332b' },
      lockedText: 'La puerta del 9ºA. Tras ella se oye una radio muy bajita, como para no molestar a nadie que escuche.',
    },
    {
      type: 'character',
      id: 'neighbor_9a',
      x: 385,
      name: 'Sra. Aurora',
      dialogueId: 'neighbor9A',
      shape: { kind: 'circle', width: 40, height: 40, color: '#a3813f' },
      examineText: 'La Sra. Aurora. Siempre en el pasillo, siempre a medio camino de ninguna parte. Observa mucho y parpadea poco.',
    },
    {
      type: 'object',
      id: 'hallway_painting',
      x: 540,
      y: 150,
      shape: { kind: 'rect', width: 62, height: 78, color: '#3c3226' },
      examineText:
        'Un óleo del edificio, pintado desde la calle. Todas las ventanas a oscuras salvo las de la última planta. Quien lo pintó también dibujó el reloj del portal: las agujas en las doce.',
    },
    {
      type: 'object',
      id: 'wall_crack',
      x: 660,
      y: 140,
      shape: { kind: 'rect', width: 8, height: 90, color: '#0a0a0e' },
      examineText: 'Una grieta que sube por la pared y se pierde en el techo. Parece reciente. Parece ir hacia arriba.',
    },
    {
      type: 'light',
      id: 'hallway_light_1',
      x: 750,
      y: 300,
      startsOn: true,
      shape: { kind: 'rect', width: 60, height: 10, color: '#e4d9ad', glow: 'rgba(228, 217, 173, 0.25)', flicker: true },
      examineText: 'Un fluorescente parpadeante. Lleva así desde que te mudaste.',
    },
    {
      type: 'door',
      id: 'door_9b',
      x: 810,
      isLocked: true,
      shape: { kind: 'rect', width: 50, height: 92, color: '#39332b' },
      lockedText: 'La puerta del 9ºB. Tiene tres cerraduras, y las tres brillan de usarse mucho.',
    },
    {
      type: 'character',
      id: 'neighbor_9b',
      x: 895,
      name: 'Sr. Baltasar',
      dialogueId: 'neighbor9B',
      shape: { kind: 'circle', width: 40, height: 40, color: '#5c6066' },
      examineText: 'El Sr. Baltasar. De pie junto a su puerta, como quien monta guardia sin querer admitirlo.',
    },
    {
      type: 'object',
      id: 'lost_shoe',
      x: 1010,
      shape: { kind: 'rect', width: 26, height: 14, color: '#5a3f35' },
      examineText: 'Un zapato de niño, solo, perfectamente centrado en mitad del pasillo. En este edificio no vive ningún niño.',
    },
    {
      type: 'object',
      id: 'hallway_clock',
      x: 1120,
      y: 210,
      shape: { kind: 'circle', width: 38, height: 38, color: '#4a4438' },
      examineText: 'El reloj comunitario del pasillo. Parado a las doce en punto. Como el tuyo.',
    },
    {
      type: 'light',
      id: 'hallway_light_2',
      x: 1220,
      y: 300,
      startsOn: false,
      shape: { kind: 'rect', width: 60, height: 10, color: '#e4d9ad' },
      examineText: 'Este fluorescente ya ni parpadea. Simplemente no enciende.',
    },
    {
      type: 'door',
      id: 'door_9c',
      x: 1280,
      isLocked: true,
      shape: { kind: 'rect', width: 50, height: 92, color: '#39332b' },
      lockedText: 'La puerta del 9ºC. El felpudo dice "BIENVENIDOS", con el plural gastado.',
    },
    {
      type: 'character',
      id: 'neighbor_9c',
      x: 1365,
      name: 'Cosme',
      dialogueId: 'neighbor9C',
      shape: { kind: 'circle', width: 40, height: 40, color: '#5f7a5a' },
      examineText: 'Cosme, del 9ºC. Te sonríe desde antes de que llegues a verle la cara.',
    },
    {
      type: 'object',
      id: 'meter_room_door',
      x: 1490,
      shape: { kind: 'rect', width: 46, height: 90, color: '#2f3338' },
      verbs: ['examine', 'use'],
      examineText:
        'El cuarto de contadores. Una puerta metálica con un teclado numérico de cuatro dígitos amarilleado por los años. De dentro sale un tic-tac que no encaja con ningún contador.',
      puzzle: {
        type: 'code',
        code: '1200',
        title: 'Cuarto de contadores',
        solvedFlag: 'meterRoomOpened',
        solvedText:
          'El cerrojo se abre con un golpe seco. Dentro, entre contadores muertos, hay una única polaroid clavada en el corcho. Te la guardas. El tic-tac se ha detenido.',
        alreadySolvedText: 'El cuarto de contadores, abierto. Los contadores no marcan nada. Ninguno se mueve.',
        rewardItemId: 'polaroid',
      },
    },
    {
      type: 'door',
      id: 'door_9d_boarded',
      x: 1590,
      isLocked: true,
      shape: { kind: 'rect', width: 50, height: 92, color: '#241f1a' },
      lockedText:
        'Una puerta clausurada con tablones. La madera es vieja, pero los clavos brillan como recién puestos. No tiene letra.',
    },
    {
      type: 'object',
      id: 'exit_sign',
      x: 1700,
      y: 310,
      shape: { kind: 'rect', width: 46, height: 16, color: '#5a8a5a', glow: 'rgba(90, 138, 90, 0.35)', flicker: true },
      examineText: 'El rótulo de SALIDA, sobre el ascensor. Parpadea aunque el pasillo no tiene ninguna otra salida.',
    },
    {
      type: 'elevator',
      id: 'main_elevator',
      x: 1780,
      shape: { kind: 'rect', width: 90, height: 130, color: '#2a2a33' },
      examineText: 'Un viejo ascensor de puertas correderas. El indicador de planta parpadea a veces sin que nadie lo llame.',
    },
  ],
};
