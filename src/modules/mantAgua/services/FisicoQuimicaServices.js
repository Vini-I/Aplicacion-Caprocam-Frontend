/**
 * ============================================================
 * SERVICIO FisicoQuimicaServices
 * ============================================================
 *
 * Descripción:
 * Funciones de integración con la API RESTful para la gestión y
 * consulta de lecturas físico-químicas (pH, salinidad, temperatura, oxígeno).
 *
 * @dependencies api, fincaService
 * @validations Normalización de parámetros, validación de estado y mapeo de lecturas.
 * @navigation N/A
 */

import api from '../../../api/api';
import { fincaService } from '../../finca/services/finca.service';

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

export async function eliminarLectura(id) {
  try {
    const response = await api.delete(`/lecturasFisicoQuimicas/${id}`);
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

function normalizarLecturas(valor) {
  if (Array.isArray(valor)) {
    return valor;
  }

  if (valor === undefined || valor === null || valor === "") {
    return [];
  }

  if (typeof valor === "number") {
    return [valor];
  }

  if (typeof valor === "string") {
    const numero = Number(valor);
    return Number.isNaN(numero) ? [valor] : [numero];
  }

  return [valor];
}

export async function obtenerLecturasPorEstanque(estanqueId, fecha = null) {
  if (!estanqueId) {
    return null;
  }

  const fechaConsulta = fecha ?? new Date().toISOString().slice(0, 10);

  try {
    const response = await api.get(`/lecturasFisicoQuimicas/estanque/${estanqueId}`, {
      params: { fecha: fechaConsulta },
    });

    const datos = response.data?.data ?? null;

    if (!datos) {
      return null;
    }

    return {
      ph: normalizarLecturas(datos.ph),
      ox: normalizarLecturas(datos.ox ?? datos.oxigenoDisuelto),
      temperatura: normalizarLecturas(datos.temperatura),
      salinidad: normalizarLecturas(datos.salinidad),
    };
  } catch (error) {
    return null;
  }
}

export async function obtenerOpcionesFincas() {
  const fincas = await fincaService.getFincas();
  return fincas.map((finca) => ({ label: finca.nombreFinca, value: finca.id }));
}
export async function obtenerEstanquesPorFinca(fincaId) {
  if (!fincaId) return [];
  try {
    const response = await api.get('/estanques');
    return (response.data.data ?? [])
      .filter((estanque) => estanque.idFinca === fincaId)
      .map((estanque) => ({
        label: `${estanque.codigo} (${estanque.tipoEstanque})`,
        value: estanque.id,
      }));
  } catch (error) {
    return [];
  }
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

export function validarFormularioFisicoQuimica({ fincaSeleccionada, estanqueSeleccionado, tieneAlgunaMedicion, tieneMedicionesExistentes }) {
  if (!fincaSeleccionada || !estanqueSeleccionado) {
    return 'Selecciona la finca y el estanque antes de guardar.';
  }

  if (!tieneMedicionesExistentes && !tieneAlgunaMedicion) {
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