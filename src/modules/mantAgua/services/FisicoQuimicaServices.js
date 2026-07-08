/**
 * ============================================================
 * SERVICIOS - FÍSICO-QUÍMICA
 * ============================================================
 *
 * Descripción:
 * Funciones de persistencia y consulta para el módulo Físico-Química.
 * Actualmente son implementaciones locales/placeholder hasta que
 * exista un backend o almacenamiento definido.
 *
 * Funcionalidad / reglas importantes:
 * - `guardarLectura(datos)`: guarda una lectura (pendiente implementar
 *   almacenamiento real).
 * - `obtenerLecturasPorEstanque(estanqueId)`: devuelve lecturas por estanque.
 *
 * Restricciones del proyecto:
 * - No realizar llamadas a APIs externas desde aquí sin control de
 *   errores y pruebas. Reemplazar por la capa de integración cuando
 *   exista el backend.
 */

const historialLecturasPorEstanque = {
  A01: {
    ph: [7.8, 7.6],
    salinidad: [18.2, 17.9],
    temperatura: [28.5, 28.8],
    ox: [6.1, 5.9],
  },
  A02: {
    ph: [7.7, 7.6],
    salinidad: [17.5, 17.2],
    temperatura: [28.8, 29.0],
    ox: [6.0, 5.8],
  },
  'P-03': {
    ph: [7.6],
    salinidad: [16.0],
    temperatura: [29.0],
    ox: [6.2],
  },
};

export const guardarLectura = async (datos) => {
  // TODO: AsyncStorage, API call, etc.
  console.log('guardarLectura - pendiente de implementar', datos);
};

export function obtenerLecturasPorEstanque(estanqueId) {
  return historialLecturasPorEstanque[estanqueId] ?? null;
}