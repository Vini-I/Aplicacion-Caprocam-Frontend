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

export const guardarLectura = async (datos) => {
  // TODO: AsyncStorage, API call, etc.
  console.log('guardarLectura - pendiente de implementar', datos);
};

export const obtenerLecturas = async () => {
  // TODO
  return [];
};