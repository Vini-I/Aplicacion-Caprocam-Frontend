/**
 * ============================================================
 * SERVICIOS - FÍSICO-QUÍMICA
 * ============================================================
 *
 * Descripción:
 * Funciones de persistencia y consulta para el módulo Físico-Química.
 * Lecturas y fincas ya consumen la API real. Estanques por finca
 * sigue local porque el módulo de fincas todavía no expone ese
 * endpoint (GET /fincas/:fincaId/estanques pendiente).
 *
 * Restricciones del proyecto:
 * - No modificar el módulo de finca, solo se consume fincaService.
 */

import api from '../../../api/api';
import { fincaService } from '../../finca/services/finca.service';

const estanquesPorFinca = {
  laReina: [
    { label: 'Estanque P-01 (Pre-cría)', value: 'A01' },
    { label: 'Estanque P-02 (Pre-cría)', value: 'A02' },
    { label: 'Estanque E-08 (Engorde)', value: 'B01' },
    { label: 'Estanque E-09 (Engorde)', value: 'B02' },
  ],
  laEsperanza: [
    { label: 'Estanque P-03 (Pre-cría)', value: 'P-03' },
    { label: 'Estanque E-02 (Engorde)', value: 'E-02' },
    { label: 'Estanque E-03 (Engorde)', value: 'E-03' },
  ],
  laVilla: [
    { label: 'Estanque P-04 (Pre-cría)', value: 'P-04' },
    { label: 'Estanque E-05 (Engorde)', value: 'E-05' },
  ],
};

export async function getLecturas() {
  try {
    const response = await api.get('/lecturasFisicoQuimicas');
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function getLecturaPorId(id) {
  try {
    const response = await api.get(`/lecturasFisicoQuimicas/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function crearLectura(datos) {
  try {
    const response = await api.post('/lecturasFisicoQuimicas', datos);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function actualizarLectura(id, datos) {
  try {
    const response = await api.put(`/lecturasFisicoQuimicas/${id}`, datos);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

// Consulta si el estanque ya tiene lectura en la fecha dada. Esta es
// la única ruta para ese propósito (el equipo de API quitó el
// /estanque/:id/ultimo por duplicar esto). Con eso se decide
// "Guardar" vs "Actualizar" y se precargan los valores del formulario.
export async function getLecturaPorEstanqueYFecha(estanqueId, fecha) {
  try {
    const response = await api.get(`/lecturasFisicoQuimicas/estanque/${estanqueId}`, {
      params: { fecha },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function guardarLectura(datos) {
  return crearLectura(datos);
}

export async function obtenerOpcionesFincas() {
  const fincas = await fincaService.getFincas();
  // TODO: confirmar con API los nombres reales de los campos de finca
  return fincas.map((finca) => ({ label: finca.nombre, value: finca.id }));
}

export function obtenerEstanquesPorFinca(fincaSeleccionada) {
  // Bloqueado: pendiente que finca exponga GET /fincas/:fincaId/estanques
  return estanquesPorFinca[fincaSeleccionada] || [];
}

export function obtenerEstadoLecturasLocal(medicionesPorEstanque = {}) {
  return {
    lecturasPhLocal: medicionesPorEstanque.ph ?? [],
    lecturasSalinidadLocal: medicionesPorEstanque.salinidad ?? [],
    lecturasTempLocal: medicionesPorEstanque.temperatura ?? [],
    lecturasOxLocal: medicionesPorEstanque.ox ?? [],
  };
}

export function sincronizarLecturasLocales({ medicionesPorEstanque = {}, setters = {} }) {
  const siguienteEstado = obtenerEstadoLecturasLocal(medicionesPorEstanque);
  setters.ph?.(siguienteEstado.lecturasPhLocal);
  setters.salinidad?.(siguienteEstado.lecturasSalinidadLocal);
  setters.temperatura?.(siguienteEstado.lecturasTempLocal);
  setters.ox?.(siguienteEstado.lecturasOxLocal);
}

export function hayMedicionesRegistradas(lecturasPorTipo = []) {
  return lecturasPorTipo.some((lecturas) => Array.isArray(lecturas) && lecturas.length > 0);
}

export function validarFormularioFisicoQuimica({ fincaSeleccionada, estanqueSeleccionado, tieneAlgunaMedicion }) {
  if (!fincaSeleccionada || !estanqueSeleccionado) {
    return 'Selecciona la finca y el estanque antes de guardar.';
  }

  if (!tieneAlgunaMedicion) {
    return 'Agrega al menos una medición antes de guardar.';
  }

  return '';
}

export function validarSeleccionAntesDeAgregar({ fincaSeleccionada, estanqueSeleccionado }) {
  if (!fincaSeleccionada || !estanqueSeleccionado) {
    return 'Selecciona la finca y el estanque antes de agregar mediciones.';
  }
  return '';
}

export function manejarCambioFinca({ value, setters }) {
  setters?.finca?.(value);
  setters?.estanque?.("");
  setters?.mediciones?.({ ph: [], salinidad: [], temperatura: [], ox: [] });
  setters?.error?.("");
}

export function manejarCambioPh({ values, setters, localSetters }) {
  const valores = values ?? [];
  localSetters?.ph?.(valores);
  setters?.ph?.(valores);
}

export function manejarCambioSalinidad({ values, setters, localSetters }) {
  const valores = values ?? [];
  localSetters?.salinidad?.(valores);
  setters?.salinidad?.(valores);
}

export function manejarCambioTemperatura({ values, setters, localSetters }) {
  const valores = values ?? [];
  localSetters?.temperatura?.(valores);
  setters?.temperatura?.(valores);
}

export function manejarCambioOxigeno({ values, setters, localSetters }) {
  const valores = values ?? [];
  localSetters?.ox?.(valores);
  setters?.ox?.(valores);
}