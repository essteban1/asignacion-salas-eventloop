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
];