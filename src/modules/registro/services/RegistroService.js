/**
 * Servicio de persistencia del módulo Registro.
 * Aún no hay backend/storage definido — son placeholders.
 *
 * guardarRegistro(datos)     — guarda un registro. datos: object con
 *                               la información del registro a persistir
 * obtenerRegistros(fincaId)  — retorna los registros de una finca (array)
 *
 * ---
 * EJEMPLO DE USO
 * ---
 * import { guardarRegistro, obtenerRegistros } from '../services/registroService';
 *
 * await guardarRegistro({ fincaId: 1, estanqueId: 'E-01', modulo: 'alimentacion', datos: {...} });
 * const registros = await obtenerRegistros(1);
 */

export const guardarRegistro = async (datos) => {
  // TODO: AsyncStorage, API call, etc.
  console.log('guardarRegistro pendiente', datos);
};

export const obtenerRegistros = async (fincaId) => {
  // TODO
  return [];
};