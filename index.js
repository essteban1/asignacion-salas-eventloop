'use strict';

const catalogo = [
  { id: 'A1', capacidad: 10, equipamiento: ['proyector'] },
  { id: 'A2', capacidad: 25, equipamiento: ['proyector', 'audio'] },
  { id: 'A3', capacidad: 6, equipamiento: [] },
  { id: 'A4', capacidad: 40, equipamiento: ['proyector', 'audio', 'videoconferencia'] },
];

const solicitudes = [
  { id: 1, franja: '09:00-10:00', asistentes: 8, equipamiento: ['proyector'] },
  { id: 2, franja: '09:00-10:00', asistentes: 20, equipamiento: ['proyector', 'audio'] },
  { id: 3, franja: '10:00-11:00', asistentes: 5, equipamiento: [] },
  { id: 4, franja: '09:00-10:00', asistentes: 35, equipamiento: ['videoconferencia'] },
  { id: 5, franja: '10:00-11:00', asistentes: 50, equipamiento: [] },

  const ocupacion = new Map();
const aceptadas = [];
const rechazadas = [];

function cumpleRestricciones(sala, solicitud) {
  const capacidadOk = sala.capacidad >= solicitud.asistentes;
  const equipoOk = solicitud.equipamiento.every((e) => sala.equipamiento.includes(e));
  const clave = `${sala.id}|${solicitud.franja}`;
  const libreOk = !ocupacion.has(clave);
  return capacidadOk && equipoOk && libreOk;
}

function procesarSolicitud(solicitud) {
  const sala = catalogo.find((s) => cumpleRestricciones(s, solicitud));
  if (sala) {
    ocupacion.set(`${sala.id}|${solicitud.franja}`, true);
    aceptadas.push({ solicitud: solicitud.id, sala: sala.id, franja: solicitud.franja });
  } else {
    rechazadas.push({
      solicitud: solicitud.id,
      motivo: 'ninguna sala satisface capacidad, equipamiento y disponibilidad en esa franja',
    });
  }
}
];  