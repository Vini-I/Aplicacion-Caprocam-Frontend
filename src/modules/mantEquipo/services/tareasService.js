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
 * Nota: Se envía un token falso en el header 'Authorization'
 * para evitar el error 401 mientras no se implemente JWT.
 *
 * Dependencias:
 * - api (axios) desde src/api/api.js
 * ============================================================
 */

import api from '../../../api/api';

// ─── TOKEN DE PRUEBA ──────────────────────────────────────────
const FAKE_TOKEN = 'Bearer fake-token-para-pruebas';
api.defaults.headers.common['Authorization'] = FAKE_TOKEN;

// ─── MAPEO DE DATOS ─────────────────────────────────────────────

function mapBackendToFrontend(data) {
  return {
    id: data.id,
    nombre: data.nombre,
    descripcion: data.descripcion,
    categoria: data.categoria,
    duracionEstimada: data.horas || data.duracionEstimada || 0,
    estado: data.estado || 'no_iniciada',
    productos: data.productos || [],
    createdAt: data.fechaCreacion || data.createdAt,
    updatedAt: data.fechaActualizacion || data.updatedAt,
  };
}

function prepareForBackend(data) {
  return {
    nombre: data.nombre?.trim() || '',
    descripcion: data.descripcion?.trim() || '',
    categoria: data.categoria || '',
    horas: Number(data.duracionEstimada) || 0,
    estado: data.estado || 'no_iniciada',
    productos: data.productos || [],
    grupoDatos: 1,
    colaboradorId: data.colaboradorId || null,
    equipoId: data.equipoId || null,
  };
}

// ─── FUNCIONES PRINCIPALES ──────────────────────────────────────

export async function getTareas(filtros = {}) {
  try {
    const response = await api.get('/tareas');
    let data = response.data.data || [];
    if (filtros.categoria) {
      data = data.filter((t) => t.categoria === filtros.categoria);
    }
    if (filtros.estado) {
      data = data.filter((t) => t.estado === filtros.estado);
    }
    return data.map(mapBackendToFrontend);
  } catch (error) {
    // Si el backend no existe (404) o no tiene datos, devolvemos array vacío
    // y no lanzamos error para que la UI no muestre un mensaje de error.
    // Esto es útil cuando el módulo de tareas aún no está implementado en backend.
    if (error.response && error.response.status === 404) {
      console.warn('⚠️ El endpoint /tareas no está disponible. Retornando lista vacía.');
      return [];
    }
    // Para otros errores (500, red, etc.) los lanzamos para que la UI los muestre.
    throw error;
  }
}

export async function getTareaById(id) {
  try {
    const response = await api.get(`/tareas/${id}`);
    const data = response.data.data;
    if (!data) throw new Error('Tarea no encontrada');
    return mapBackendToFrontend(data);
  } catch (error) {
    throw error;
  }
}

export async function createTarea(data) {
  try {
    const payload = prepareForBackend(data);
    const response = await api.post('/tareas', payload);
    const created = response.data.data;
    return mapBackendToFrontend(created);
  } catch (error) {
    // Para crear, si el endpoint no existe, lanzamos error para que el usuario sepa
    throw error;
  }
}

export async function updateTarea(id, data) {
  try {
    const payload = prepareForBackend(data);
    const response = await api.put(`/tareas/${id}`, payload);
    return mapBackendToFrontend(response.data.data);
  } catch (error) {
    throw error;
  }
}

export async function deleteTarea(id) {
  try {
    const response = await api.delete(`/tareas/${id}`);
    return response.data.data ? true : false;
  } catch (error) {
    throw error;
  }
}

export async function getCatalogoTareas() {
  try {
    const response = await api.get('/tareas/catalogo');
    const data = response.data.data || [];
    return data.map((t) => ({
      id: t.id,
      nombre: t.nombre,
      value: t.id,
      label: t.nombre,
    }));
  } catch (error) {
    // Si el catálogo no existe, devolvemos array vacío
    if (error.response && error.response.status === 404) {
      console.warn('⚠️ El endpoint /tareas/catalogo no está disponible. Retornando catálogo vacío.');
      return [];
    }
    throw error;
  }
}

// ─── EXPORTACIÓN COMPATIBLE ──────────────────────────────────

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