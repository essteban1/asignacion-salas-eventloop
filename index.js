'use strict';

/**
 * Sistema de asignación de salas
 * Paradigma asignado: Programación con bucle de eventos (Event-loop programming)
 * Herramienta: Node.js (módulo nativo 'events')
 *
 * Concepto diferencial (Van Roy, 2009, Fig. 2): el paradigma de bucle de eventos
 * agrega a la programación funcional de primer orden el concepto de PUERTO/CANAL
 * asíncrono (aquí, un EventEmitter) sobre el que se emiten y consumen eventos.
 * El control del programa no avanza por llamadas directas entre funciones ni por
 * un ciclo for/while síncrono: avanza porque el bucle de eventos de Node.js
 * despacha, uno a la vez, los manejadores registrados para cada evento.
 *
 * Los tres puntos donde el concepto diferencial determina la solución están
 * marcados en el código como "PUNTO DIFERENCIAL 1/2/3".
 */

const EventEmitter = require('events');

// ---------------------------------------------------------------------------
// DATOS (equivalente a la sección DATOS del pseudocódigo)
// ---------------------------------------------------------------------------

const catalogo = [
  { id: 'A', capacidad: 4, equipamiento: ['proyector'] },
  { id: 'B', capacidad: 10, equipamiento: ['proyector', 'pizarra'] },
  { id: 'C', capacidad: 20, equipamiento: ['proyector', 'pizarra', 'videoconferencia'] },
  { id: 'D', capacidad: 6, equipamiento: [] },
];

const solicitudes = [
  { franja: '08:00-09:00', asistentes: 3, equipamiento: ['proyector'] },
  { franja: '08:00-09:00', asistentes: 8, equipamiento: ['pizarra'] },
  { franja: '09:00-10:00', asistentes: 3, equipamiento: ['proyector'] },
  { franja: '08:00-09:00', asistentes: 15, equipamiento: ['videoconferencia'] },
  { franja: '10:00-11:00', asistentes: 25, equipamiento: [] },
  { franja: '09:00-10:00', asistentes: 5, equipamiento: [] },
];

// Estado con nombre (named state, Sección 4.4 de Van Roy): mapa "salaId|franja" -> ocupado
const ocupacion = new Map();

const aceptadas = [];
const rechazadas = [];

// ---------------------------------------------------------------------------
// cumpleRestricciones(sala, solicitud)
// ---------------------------------------------------------------------------
function cumpleRestricciones(sala, solicitud) {
  const capacidadOk = sala.capacidad >= solicitud.asistentes;
  const equipoOk = solicitud.equipamiento.every((e) => sala.equipamiento.includes(e));
  const libreOk = !ocupacion.has(`${sala.id}|${solicitud.franja}`);
  return capacidadOk && equipoOk && libreOk;
}

// Motivo de rechazo más informativo posible, evaluando el catálogo completo.
function motivoRechazo(solicitud) {
  const sinCapacidad = catalogo.every((s) => s.capacidad < solicitud.asistentes);
  if (sinCapacidad) return 'ninguna sala tiene capacidad suficiente';

  const sinEquipo = catalogo.every(
    (s) => !solicitud.equipamiento.every((e) => s.equipamiento.includes(e))
  );
  if (sinEquipo) return 'ninguna sala tiene el equipamiento requerido';

  return 'todas las salas aptas están ocupadas en esa franja horaria';
}

// ---------------------------------------------------------------------------
// procesarSolicitud(solicitud)
// ---------------------------------------------------------------------------
function procesarSolicitud(solicitud) {
  const sala = catalogo.find((s) => cumpleRestricciones(s, solicitud));
  if (sala) {
    ocupacion.set(`${sala.id}|${solicitud.franja}`, true);
    aceptadas.push({ solicitud, sala: sala.id, franja: solicitud.franja });
  } else {
    rechazadas.push({ solicitud, motivo: motivoRechazo(solicitud) });
  }
}

// ---------------------------------------------------------------------------
// BUS DE EVENTOS y manejadores ('solicitud', 'fin')
// ---------------------------------------------------------------------------
const bus = new EventEmitter();

// PUNTO DIFERENCIAL 1
// El flujo de control NO es un for/while que recorre 'solicitudes' de forma
// síncrona (eso sería programación imperativa/funcional de primer orden).
// Es un manejador registrado sobre un EventEmitter: el programa avanza
// porque REACCIONA al evento 'solicitud', no porque una función llame
// explícitamente a la siguiente. Esto es precisamente el concepto de
// "puerto/canal" que añade este paradigma según la taxonomía de Van Roy.
bus.on('solicitud', (solicitud, indice) => {
  procesarSolicitud(solicitud);

  // PUNTO DIFERENCIAL 2
  // En vez de invocar recursiva o iterativamente el procesamiento de la
  // siguiente solicitud (lo que acoplaría directamente ambas llamadas y
  // haría crecer la pila), se PROGRAMA la emisión del próximo evento para
  // el siguiente ciclo del bucle de eventos con setImmediate. El control
  // vuelve explícitamente al bucle de eventos entre solicitud y solicitud;
  // eso es lo que hace a esta solución "event-loop" y no una simple función
  // recursiva.
  if (indice + 1 < solicitudes.length) {
    setImmediate(() => bus.emit('solicitud', solicitudes[indice + 1], indice + 1));
  } else {
    setImmediate(() => bus.emit('fin'));
  }
});

// PUNTO DIFERENCIAL 3
// El manejador de 'fin' está desacoplado de quien generó el evento: nunca es
// llamado directamente, solo se activa cuando el bucle de eventos despacha
// ese evento sobre el bus. La comunicación entre "quien termina de procesar"
// y "quien informa resultados" pasa exclusivamente por el canal de eventos,
// no por una llamada de función compartida.
bus.on('fin', () => {
  console.log('=== Asignaciones aceptadas ===');
  aceptadas.forEach((a, i) => {
    console.log(
      `${i + 1}. Sala ${a.sala} | franja ${a.franja} | asistentes ${a.solicitud.asistentes} | equipo [${a.solicitud.equipamiento.join(', ')}]`
    );
  });

  console.log('\n=== Solicitudes rechazadas ===');
  rechazadas.forEach((r, i) => {
    console.log(
      `${i + 1}. franja ${r.solicitud.franja} | asistentes ${r.solicitud.asistentes} | equipo [${r.solicitud.equipamiento.join(', ')}] -> motivo: ${r.motivo}`
    );
  });

  console.log(
    `\nTotal: ${aceptadas.length} aceptadas, ${rechazadas.length} rechazadas de ${solicitudes.length} solicitudes.`
  );
});

// ---------------------------------------------------------------------------
// ARRANQUE DEL PROGRAMA: se emite el primer evento y el bucle de eventos
// de Node.js se encarga de todo lo demás.
// ---------------------------------------------------------------------------
console.log('Iniciando procesamiento de solicitudes (bucle de eventos)...\n');
bus.emit('solicitud', solicitudes[0], 0);