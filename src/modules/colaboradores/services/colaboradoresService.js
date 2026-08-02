/**
 * ============================================================
 * SERVICIO: colaboradoresService
 * ============================================================
 * Módulo: Colaboradores
 *
 * Servicio que conecta con el backend real mediante la API.
 * Todas las funciones son asíncronas y devuelven los datos
 * mapeados al formato usado por el frontend.
 *
 * Dependencias:
 * - api (axios) desde src/api/api.js (ya incluye el interceptor de tokens)
 * ============================================================
 */

import api from "../../../api/api";

// Mapeo de roles (frontend -> backend) - se mantiene para compatibilidad,
// pero ahora también se puede usar directamente un rolId numérico.
const rolMapToId = {
  camprocam_worker: 1,
  external_owner: 2,
  external_worker: 3,
};

// Este mapeo aún se usa para determinar tipoColaborador a partir del rolId numérico.
// Pero prepareForBackend lo determinará automáticamente.

// ─── MAPEO BACKEND → FRONTEND ──────────────────────────────────────
function mapBackendToFrontend(data) {
  // Determinar el rol a partir del rol_id (numérico)
  let rol = "camprocam_worker";
  if (data.rol_id === 2) rol = "external_owner";
  else if (data.rol_id === 3) rol = "external_worker";

  // Si el backend no guardó la cédula en la columna 'cedula',
  // se toma de 'nombre_usuario' (donde sí está)
  const cedula = data.cedula || data.nombre_usuario || "";

  return {
    id: data.id,
    nombre: `${data.nombre} ${data.apellidos}`,
    cedula: cedula,
    telefono: data.telefono,
    email: data.email,
    rol: rol,
    fincaId: data.finca_id,
    activo: Boolean(data.activo),
  };
}

// ─── PREPARAR PAYLOAD PARA BACKEND ─────────────────────────────────
function prepareForBackend(data, pinHash = null) {
  const [nombre, ...apellidosParts] = data.nombre.split(" ");
  const apellidos = apellidosParts.join(" ") || "";

  // 1. Determinar rolId:
  // Si es número (ej: 3), usarlo directamente.
  // Si es string (ej: "external_owner"), mapearlo.
  let rolId = data.rol;
  if (typeof data.rol === "string" && rolMapToId[data.rol]) {
    rolId = rolMapToId[data.rol];
  }
  // Si no se pudo determinar, usar 3 (external_worker) por defecto.
  if (!rolId || isNaN(Number(rolId))) {
    rolId = 3;
  }
  const rolIdNumerico = Number(rolId);

  // 2. Determinar tipoColaborador basado en el rolId para cumplir con el ENUM de la DB.
  let tipoColaborador = "external_collab"; // default
  if (rolIdNumerico === 1 || rolIdNumerico === 2) {
    tipoColaborador = "caprocam_collab";
  } else if (rolIdNumerico === 3) {
    tipoColaborador = "external_owner";
  }
  // Nota: para roles 4 y 5, ¿qué tipoColaborador? Según el backend, parece que solo usa caprocam_collab, external_owner, external_collab.
  // Para roles 4 y 5, probablemente sea caprocam_collab, o podríamos dejar external_collab por defecto.
  // Decisión: si rolId > 3, usaremos "caprocam_collab" porque son roles internos.
  if (rolIdNumerico >= 4) {
    tipoColaborador = "caprocam_collab";
  }

  const payload = {
    nombre: nombre || "",
    apellidos,
    nombreUsuario: data.cedula, // temporal: cédula como nombre de usuario
    cedula: data.cedula,
    rolId: rolIdNumerico,
    fincaId: data.fincaId ? Number(data.fincaId) : null,
    telefono: data.telefono || null,
    email: data.email || null,
    tipoColaborador: tipoColaborador,
    grupoDatos: 1, // temporal hasta autenticación
  };

  if (pinHash) {
    payload.pinHash = pinHash;
  }

  return payload;
}

// ─── FUNCIONES PRINCIPALES ──────────────────────────────────────────

/**
 * Obtiene todos los colaboradores activos del backend.
 * Filtra por fincaId, rol, activo si se pasan.
 */
async function getColaboradores(filtros = {}) {
  try {
    const response = await api.get("/colaboradores");
    let data = response.data.data || [];

    if (filtros.fincaId) {
      data = data.filter((c) => c.finca_id === Number(filtros.fincaId));
    }
    if (filtros.rol) {
      data = data.filter((c) => {
        const rol = mapBackendToFrontend(c).rol;
        return rol === filtros.rol;
      });
    }
    if (filtros.activo !== undefined) {
      data = data.filter((c) => Boolean(c.activo) === filtros.activo);
    }

    return data.map(mapBackendToFrontend);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al obtener colaboradores";
    throw new Error(message);
  }
}

/**
 * Obtiene un colaborador por su ID.
 */
async function getColaboradorById(id) {
  try {
    const response = await api.get(`/colaboradores/${id}`);
    const data = response.data.data;
    if (!data) throw new Error("Colaborador no encontrado");
    return mapBackendToFrontend(data);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al obtener colaborador";
    throw new Error(message);
  }
}

/**
 * Crea un nuevo colaborador.
 * Genera un PIN de 4 dígitos y lo envía en pinHash.
 * Devuelve el colaborador creado y el PIN en texto plano.
 */
async function createColaborador(data) {
  try {
    const pin = String(Math.floor(1000 + Math.random() * 9000));
    const payload = prepareForBackend(data, pin);
    const response = await api.post("/colaboradores", payload);
    const created = response.data.data;
    return {
      ...mapBackendToFrontend(created),
      pin,
    };
  } catch (error) {
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || error.message || "Error al crear colaborador";
    const errorDetail = errorData?.error || errorData?.errors;

    if (typeof errorDetail === "string" && errorDetail.includes("cedula")) {
      throw new Error("Colaborador ya existente.");
    }
    throw new Error(errorMessage);
  }
}

/**
 * Actualiza un colaborador existente.
 * Si se proporciona un nuevo PIN, se envía en pinHash.
 */
async function updateColaborador(id, data, newPin = null) {
  try {
    const payload = prepareForBackend(data, newPin);
    if (!newPin) delete payload.pinHash;
    const response = await api.put(`/colaboradores/${id}`, payload);
    return mapBackendToFrontend(response.data.data);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al actualizar colaborador";
    throw new Error(message);
  }
}

/**
 * Elimina (borrado lógico) un colaborador.
 */
async function deleteColaborador(id) {
  try {
    const response = await api.delete(`/colaboradores/${id}`);
    return response.data.data ? true : false;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al eliminar colaborador";
    throw new Error(message);
  }
}

// ─── FUNCIONES AUXILIARES (mock) ────────────────────────────────────

/**
 * Obtiene estadísticas de un colaborador (mock).
 */
async function getEstadisticasColaborador(colaboradorId) {
  return {
    alimentaciones: 0,
    estanquesCreados: 0,
    siembrasRegistradas: 0,
    ultimaActividad: null,
  };
}

/**
 * Obtiene trabajadores externos asociados a un dueño (mock).
 */
async function getTrabajadoresByOwner(ownerId) {
  return [];
}

// ─── EXPORTACIÓN ────────────────────────────────────────────────────

export const colaboradoresService = {
  getColaboradores,
  getColaboradorById,
  createColaborador,
  updateColaborador,
  deleteColaborador,
  getEstadisticasColaborador,
  getTrabajadoresByOwner,
};