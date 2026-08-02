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

function mapBackendToFrontend(data) {
  if (!data) return {};

  const estadoMapInverso = {
    'Pendiente': 'no_iniciada',
    'En proceso': 'en_ejecucion',
    'Finalizada': 'finalizada',
    'Cancelada': 'cancelada',
  };

  const estadoFrontend = estadoMapInverso[data.estado] || data.estado || 'no_iniciada';
  const idVal = data.id ?? data.tarea_id ?? data.tareaId ?? data.codigo_tarea ?? data.codigoTarea;
  const nombreVal = data.nombre ?? data.nombre_tarea ?? data.nombreTarea ?? data.label ?? (idVal ? `Tarea ${idVal}` : 'Tarea');

  return {
    id: idVal,
    nombre: nombreVal,
    descripcion: data.descripcion || '',
    categoria: data.categoria || '',
    duracionEstimada: Number(data.horas) || Number(data.duracion_estimada) || 0,
    estado: estadoFrontend,
    colaboradorId: data.colaborador_id || data.colaboradorId,
    equipoId: data.equipo_id || data.equipoId,
    productos: data.productos || [],
    createdAt: data.fecha_creacion || data.createdAt,
    updatedAt: data.fecha_actualizacion || data.updatedAt,
  };
}

function prepareForBackend(data) {
  // Mapeo de estados del frontend al backend
  const estadoMap = {
    'no_iniciada': 'Pendiente',
    'pendiente': 'Pendiente',
    'en_ejecucion': 'En proceso',
    'en_proceso': 'En proceso',
    'finalizada': 'Finalizada',
    'cancelada': 'Cancelada',
  };

  // Mapeo de categorías: backend requiere capitalizada
  const categoriaMap = {
    'preventivo':  'Preventivo',
    'correctivo':  'Correctivo',
    'predictivo':  'Predictivo',
    'emergencia':  'Emergencia',
    'Preventivo':  'Preventivo',
    'Correctivo':  'Correctivo',
    'Predictivo':  'Predictivo',
    'Emergencia':  'Emergencia',
  };

  const codigoTarea = data.codigo || data.codigoTarea || `TAR-${String(Date.now()).slice(-6)}`;
  
  const estadoFrontend = data.estado || 'no_iniciada';
  const estadoBackend  = estadoMap[estadoFrontend.toLowerCase()] || 'Pendiente';
  const categoriaBack  = categoriaMap[data.categoria] || data.categoria || 'Preventivo';
  
  return {
    nombre:       data.nombre?.trim() || "",
    descripcion:  data.descripcion?.trim() || "",
    categoria:    categoriaBack,
    horas:        Number(data.horas) || Number(data.duracionEstimada) || 0,
    estado:       estadoBackend,
    codigo_tarea: codigoTarea,
  };
}


// ─── FUNCIONES PRINCIPALES ──────────────────────────────────────

/**
 * Obtiene todas las tareas activas del backend.
 * Permite filtrar por categoría y estado.
 */
async function getTareas(filtros = {}) {
  try {
    const response = await api.get("/tareas");
    const raw = response.data;
    let data = [];
    if (Array.isArray(raw)) {
      data = raw;
    } else if (Array.isArray(raw?.data)) {
      data = raw.data;
    } else if (Array.isArray(raw?.datos)) {
      data = raw.datos;
    }
    
    if (filtros && filtros.categoria) {
      data = data.filter((t) => t.categoria === filtros.categoria);
    }
    if (filtros && filtros.estado) {
      data = data.filter((t) => t.estado === filtros.estado);
    }
    
    return data.map(mapBackendToFrontend);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al obtener tareas";
    throw new Error(message);
  }
}

/**
 * Obtiene una tarea por su ID.
 * Ruta corregida: /tareas/${id}
 */
async function getTareaById(id) {
  try {
    const response = await api.get(`/tareas/${id}`);
    const data = response.data.data;
    if (!data) throw new Error("Tarea no encontrada");
    return mapBackendToFrontend(data);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al obtener tarea";
    throw new Error(message);
  }
}

/**
 * Crea una nueva tarea.
 * Ruta corregida: /tareas
 */
async function createTarea(data) {
  try {
    const payload = prepareForBackend(data);
    const response = await api.post("/tareas", payload);
    return mapBackendToFrontend(response.data.data);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al crear tarea";
    throw new Error(message);
  }
}

/**
 * Actualiza una tarea existente.
 * Ruta corregida: /tareas/${id}
 */
async function updateTarea(id, data) {
  try {
    const payload = prepareForBackend(data);
    const response = await api.put(`/tareas/${id}`, payload);
    return mapBackendToFrontend(response.data.data);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al actualizar tarea";
    throw new Error(message);
  }
}

/**
 * Elimina (borrado lógico) una tarea.
 * Ruta corregida: /tareas/${id}
 */
async function deleteTarea(id) {
  try {
    const response = await api.delete(`/tareas/${id}`);
    return response.data.data ? true : false;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al eliminar tarea";
    throw new Error(message);
  }
}

/**
 * Obtiene catálogo de tareas para selects.
 * Ruta corregida: /tareas/catalogo
 */
async function getCatalogoTareas() {
  try {
    const response = await api.get("/tareas/catalogo");
    const data = response.data.data || [];
    return data.map((t) => ({
      id: t.id,
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

// ─── EXPORTACIÓN ────────────────────────────────────────────────

export const tareasService = {
  getTareas,
  getTareaById,
  createTarea,
  updateTarea,
  deleteTarea,
  getCatalogoTareas,
};

// Alias para compatibilidad con código existente
export const obtenerTareas = getTareas;
export const obtenerTareaPorId = getTareaById;
export const crearTarea = createTarea;
export const actualizarTarea = updateTarea;
export const eliminarTarea = deleteTarea;
export const obtenerCatalogoTareas = getCatalogoTareas;