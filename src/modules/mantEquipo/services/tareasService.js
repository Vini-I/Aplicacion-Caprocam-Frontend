/**
 * ============================================================
 * SERVICIO: tareasService
 * ============================================================
 * Módulo: Mantenimiento de Equipos - Tareas
 *
 * Servicio que conecta con el backend real mediante la API.
 * Todas las funciones son asíncronas y devuelven los datos
 * mapeados al formato usado por el frontend.
 *
 * Dependencias:
 * - api (axios) desde src/api/api.js (ya incluye interceptor de tokens)
 * ============================================================
 */

import api from "../../../api/api";

// ─── MAPEO DE DATOS ─────────────────────────────────────────────

// Mapeo de categorías del frontend (minúsculas) al backend (primera letra mayúscula)
const categoriaMap = {
  'preventivo': 'Preventivo',
  'correctivo': 'Correctivo',
  'predictivo': 'Predictivo',
  'emergencia': 'Emergencia',
};

// Mapeo de estados del frontend al backend
const estadoMap = {
  'no_iniciada': 'Pendiente',
  'pendiente': 'Pendiente',
  'en_ejecucion': 'En proceso',
  'en_proceso': 'En proceso',
  'finalizada': 'Finalizada',
  'cancelada': 'Cancelada',
};

function mapBackendToFrontend(data) {
  const estadoMapInverso = {
    'Pendiente': 'no_iniciada',
    'En proceso': 'en_ejecucion',
    'Finalizada': 'finalizada',
    'Cancelada': 'cancelada',
  };

  const estadoFrontend = estadoMapInverso[data.estado] || data.estado || 'no_iniciada';

  return {
    id: data.id,
    codigoTarea: data.codigoTarea || data.codigo_tarea,
    nombre: data.nombre,
    descripcion: data.descripcion,
    categoria: data.categoria,
    duracionEstimada: Number(data.horas) || 0,
    estado: estadoFrontend,
    colaboradorId: data.colaborador_id,
    equipoId: data.equipo_id,
    productos: data.productos || [],
    createdAt: data.fecha_creacion,
    updatedAt: data.fecha_actualizacion,
  };
}

// ─── GENERACIÓN DE CÓDIGO ÚNICO ────────────────────────────────

let lastTimestamp = 0;
let counter = 0;

function generarCodigoTareaUnico() {
  const now = Date.now();
  if (now === lastTimestamp) {
    counter++;
  } else {
    counter = 0;
    lastTimestamp = now;
  }
  const base = now.toString(36).toUpperCase();
  const sufijo = (counter > 0 ? counter.toString(36).toUpperCase() : '');
  let combined = (base + sufijo).slice(-7);
  while (combined.length < 7) combined = '0' + combined;
  const codigo = `TAR${combined}`;
  return codigo;
}

// ─── PREPARACIÓN DE PAYLOAD ────────────────────────────────────

function prepareForBackend(data, codigoTarea) {
  if (!codigoTarea) {
    codigoTarea = generarCodigoTareaUnico();
  }

  // Mapear categoría a la forma esperada por el backend
  let categoriaBackend = data.categoria;
  if (categoriaBackend) {
    // Si la categoría está en minúsculas, mapear
    const mapeada = categoriaMap[categoriaBackend.toLowerCase()];
    if (mapeada) {
      categoriaBackend = mapeada;
    } else {
      // Si no está en el mapa, intentar capitalizar primer letra
      categoriaBackend = categoriaBackend.charAt(0).toUpperCase() + categoriaBackend.slice(1).toLowerCase();
    }
  }

  const estadoFrontend = data.estado || 'no_iniciada';
  const estadoBackend = estadoMap[estadoFrontend.toLowerCase()] || 'Pendiente';

  const payload = {
    grupoDatos: data.grupoDatos || 1,
    colaboradorId: data.colaboradorId || null,
    equipoId: data.equipoId || null,
    nombre: data.nombre?.trim() || "",
    descripcion: data.descripcion?.trim() || "",
    categoria: categoriaBackend || "",
    horas: Number(data.horas) || Number(data.duracionEstimada) || 0,
    estado: estadoBackend,
    codigoTarea: codigoTarea,
  };

  return payload;
}

// ─── FUNCIONES PRINCIPALES ──────────────────────────────────────

async function getTareas(filtros = {}) {
  try {
    const response = await api.get("/tareas");
    let data = response.data.data || [];
    if (filtros.categoria) {
      data = data.filter((t) => t.categoria === filtros.categoria);
    }
    if (filtros.estado) {
      data = data.filter((t) => t.estado === filtros.estado);
    }
    return data.map(mapBackendToFrontend);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw new Error(error.response?.data?.message || error.message || "Error al obtener tareas");
  }
}

async function getTareaById(id) {
  try {
    const response = await api.get(`/tareas/${id}`);
    const data = response.data.data;
    if (!data) throw new Error("Tarea no encontrada");
    return mapBackendToFrontend(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Error al obtener tarea");
  }
}

// ─── CREACIÓN CON REINTENTOS ────────────────────────────────────

async function createTarea(data, intentos = 0) {
  try {
    const codigo = generarCodigoTareaUnico();
    const payload = prepareForBackend(data, codigo);
    const response = await api.post("/tareas", payload);
    return mapBackendToFrontend(response.data.data);
  } catch (error) {
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    } else if (error.request) {
      console.error('   No se recibió respuesta del servidor');
    } else {
      console.error('   Mensaje:', error.message);
    }

    const errorMsg = error.response?.data?.message || error.message || '';
    const esDuplicado = errorMsg.toLowerCase().includes('código') ||
                        errorMsg.toLowerCase().includes('codigo') ||
                        errorMsg.toLowerCase().includes('duplicate') ||
                        errorMsg.toLowerCase().includes('unique');
    if (esDuplicado && intentos < 5) {
      console.log(`🔄 Reintentando con nuevo código (intento ${intentos + 1})...`);
      return createTarea(data, intentos + 1);
    }
    throw new Error(error.response?.data?.message || error.message || "Error al crear tarea");
  }
}

async function updateTarea(id, data) {
  try {
    const payload = prepareForBackend(data, null);
    delete payload.codigoTarea; // no se envía en actualización
    const response = await api.put(`/tareas/${id}`, payload);
    return mapBackendToFrontend(response.data.data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Error al actualizar tarea");
  }
}

async function deleteTarea(id) {
  try {
    const response = await api.delete(`/tareas/${id}`);
    return response.data.data ? true : false;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Error al eliminar tarea");
  }
}

async function getCatalogoTareas() {
  try {
    const response = await api.get("/tareas/catalogo");
    const data = response.data.data || [];
    return data.map((t) => ({
      id: t.id,
      codigoTarea: t.codigoTarea || t.codigo_tarea,
      nombre: t.nombre,
      value: t.id,
      label: t.nombre,
    }));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
}

export const tareasService = {
  getTareas,
  getTareaById,
  createTarea,
  updateTarea,
  deleteTarea,
  getCatalogoTareas,
};

export const obtenerTareas = getTareas;
export const obtenerTareaPorId = getTareaById;
export const crearTarea = createTarea;
export const actualizarTarea = updateTarea;
export const eliminarTarea = deleteTarea;
export const obtenerCatalogoTareas = getCatalogoTareas;