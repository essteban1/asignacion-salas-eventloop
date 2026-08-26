# Sistema de Asignación de Salas — Programación con Bucle de Eventos

**Asignatura:** Programación Avanzada (INF-223)  
**Docente:** Dr. Ruber Hernández García  
**Fecha:** 27 de agosto de 2026  

### Integrantes
* Paulo Rey
* Richard Moya
* Matías Morales
* Esteban Salgado
* Ángel Pacheco

---

## Descripción del Proyecto

Este repositorio contiene la implementación del caso de estudio **Asignación de Salas** aplicando el **Paradigma de Programación con Bucles de Eventos (Event-Loop Programming)** sobre la plataforma **Node.js**.

La arquitectura se fundamenta en la taxonomía de lenguajes de programación de **Peter Van Roy (2009)**, incorporando como concepto diferencial el **Puerto / Canal asíncrono** (`EventEmitter`) operando sobre un **único Hilo ejecutor**.

---

## Puntos Diferenciales de la Solución

1. **Suscripción al Puerto (`bus.on('solicitud', ...)`):** El flujo de control no avanza mediante bucles `for` o `while` síncronos; avanza reaccionando de forma asíncrona a los eventos despachados en el puerto.
2. **Control del Bucle de Eventos (`setImmediate`):** La programación de la siguiente solicitud se delega al próximo turno del bucle de eventos, evitando el crecimiento de la pila de llamadas (*stack*) y manteniendo la ejecución no bloqueante.
3. **Desacoplamiento del Evento Final (`bus.on('fin', ...)`):** La emisión del reporte final de asignaciones y rechazos está desacoplada de la función procesadora, comunicándose exclusivamente a través del canal de eventos.

---

## Ejecución del Programa

### Requisitos
* **Node.js** (v14 o superior)

### Comando de Ejecución
```bash
node index.js