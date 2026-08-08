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
function construirErrorHttp(error, mensajeGenerico) {
  const status = error?.response?.status;
  const mensaje = error?.response?.data?.message || error?.response?.data?.error || error?.message;
  if (status === 500) {
    return new Error(mensajeGenerico);
  }
  if (status) {
    const err = new Error(mensaje || mensajeGenerico);
    err.status = status;
    return err;
  }

  return new Error(mensajeGenerico);
}

function mapBackendToFrontend(data) {
  if (!data) return {};

  const idVal = data.id ?? data.tarea_id ?? data.tareaId ?? data.codigo_tarea ?? data.codigoTarea;
  const nombreVal = data.nombre ?? data.nombre_tarea ?? data.nombreTarea ?? data.label ?? (idVal ? `Tarea ${idVal}` : 'Tarea');

  return {
    id: idVal,
    nombre: nombreVal,
    descripcion: data.descripcion || '',
    categoria: (data.categoria || '').toLowerCase(),
    duracionEstimada: Number(data.horas) || 0,  // ← backend devuelve "horas"
    colaboradorId: data.colaborador_id || data.colaboradorId,
    equipoId: data.equipo_id || data.equipoId,
    createdAt: data.fecha_creacion || data.createdAt,
    updatedAt: data.fecha_actualizacion || data.updatedAt,
  };
}

function prepareForBackend(data) {
  // Mapeo de categorías: backend requiere capitalizada
  const categoriaMap = {
    'preventivo':  'Preventivo',
    'correctivo':  'Correctivo',
    'predictivo':  'Predictivo',
    'emergencia':  'Emergencia',
  };

  const codigoTarea = data.codigo || data.codigoTarea || `TAR-${String(Date.now()).slice(-6)}`;
  
  const categoriaBack  = categoriaMap[data.categoria] || data.categoria || 'Preventivo';
  
  // Payload que espera el backend: codigoTarea, nombre, descripcion, categoria, horas
  const payload = {
    codigoTarea: codigoTarea,
    nombre:       data.nombre?.trim() || "",
    descripcion:  data.descripcion?.trim() || "",
    categoria:    categoriaBack,
    horas:        Number(data.duracionEstimada) || Number(data.horas) || 0,  // ← campo "horas"
  };

  // NOTA: el backend NO acepta "productos" ni el campo de estado en este endpoint.
  // Si se necesita asociar productos, debe hacerse mediante otro endpoint
  // (ej. /mantenimientos/:id/productos). Por eso no se incluyen aquí.

  return payload;
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
      const filtro = String(filtros.categoria || '').toLowerCase();
      data = data.filter((t) => String(t.categoria || '').toLowerCase() === filtro);
    }
    
    return data.map(mapBackendToFrontend);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw construirErrorHttp(error, "No se pudieron obtener las tareas");
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
    throw construirErrorHttp(error, "No se pudo obtener la tarea");
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
    throw construirErrorHttp(error, "No se pudo crear la tarea");
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
    throw construirErrorHttp(error, "No se pudo actualizar la tarea");
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
    throw construirErrorHttp(error, "No se pudo eliminar la tarea");
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
    throw construirErrorHttp(error, "No se pudo obtener el catálogo de tareas");
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