/**
 * Servicio de persistencia del módulo Físico-Química.
 * Aún no hay backend/storage definido — son placeholders.
 *
 * guardarLectura(datos)  — guarda una lectura. datos: object con
 *                           los valores de pH, temperatura, salinidad, O2
 * obtenerLecturas()      — retorna el historial de lecturas (array)
 *
 * ---
 * EJEMPLO DE USO
 * ---
 * import { guardarLectura, obtenerLecturas } from '../services/fisicoQuimicaService';
 *
 * await guardarLectura({ ph: 7.8, temperatura: 29, salinidad: 18, oxigeno: 6 });
 * const historial = await obtenerLecturas();
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

export const obtenerLecturas = async () => {
  // TODO
  return [];
};

export function obtenerLecturasPorEstanque(estanqueId) {
  return historialLecturasPorEstanque[estanqueId] ?? null;
}