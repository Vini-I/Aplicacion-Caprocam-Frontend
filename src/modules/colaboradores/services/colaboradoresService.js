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
 * Nota: El backend espera el campo 'pinHash'. Dado que no podemos
 * hashear el PIN en el frontend, enviamos el PIN en texto plano
 * en el campo 'pinHash' para que la base de datos reciba un valor
 * no nulo. Esto es temporal hasta que el backend implemente la
 * generación/hasheo automático del PIN.
 *
 * Dependencias:
 * - api (axios) desde src/api/api.js
 * ============================================================
 */

// src/modules/colaboradores/services/colaboradoresService.js
import api from "../../../api/api";

// Mapeo de roles
const rolMapToId = {
  camprocam_worker: 3,
  external_owner: 2,
  external_worker: 3,
};

const rolMapToTipo = {
  camprocam_worker: "caprocam_collab",
  external_owner: "external_owner",
  external_worker: "external_collab",
};

const rolIdToRol = {
  2: "external_owner",
  3: (tipo) => {
    if (tipo === "caprocam_collab") return "camprocam_worker";
    if (tipo === "external_collab") return "external_worker";
    return "external_worker";
  },
};

// Mapeo de backend a frontend
function mapBackendToFrontend(data) {
  let rol = "camprocam_worker";
  if (data.rolId === 2) {
    rol = "external_owner";
  } else if (data.rolId === 3) {
    rol = rolIdToRol[3](data.tipoColaborador);
  }
  return {
    id: data.id,
    nombre: `${data.nombre} ${data.apellidos}`,
    cedula: data.nombreUsuario,
    telefono: data.telefono,
    email: data.email,
    rol,
    fincaId: data.fincaId,
    activo: Boolean(data.activo), // ← Convierte 1/0 a true/false
  };
}

// Preparar payload para backend
function prepareForBackend(data, pinHash = null) {
  const [nombre, ...apellidosParts] = data.nombre.split(" ");
  const apellidos = apellidosParts.join(" ") || "";
  const payload = {
    nombre: nombre || "",
    apellidos,
    nombreUsuario: data.cedula,
    rolId: rolMapToId[data.rol] || 3,
    fincaId: data.fincaId ? Number(data.fincaId) : null,
    telefono: data.telefono || null,
    email: data.email || null,
    tipoColaborador: rolMapToTipo[data.rol] || "external_collab",
    grupoDatos: 1, // temporal hasta autenticación
  };
  if (pinHash) {
    payload.pinHash = pinHash;
  }
  return payload;
}

// ─── FUNCIONES PRINCIPALES ──────────────────────────────────────

/**
 * Obtiene todos los colaboradores activos del backend.
 * Filtra por fincaId, rol, activo si se pasan.
 */
async function getColaboradores(filtros = {}) {
  try {
    const response = await api.get("/api/v0/colaboradores");
    let data = response.data.data || [];
    console.log("📦 Datos crudos del backend:", data); // ← Verifica que lleguen

    if (filtros.fincaId) {
      data = data.filter((c) => c.fincaId === Number(filtros.fincaId));
    }
    if (filtros.rol) {
      data = data.filter((c) => {
        const rol = mapBackendToFrontend(c).rol;
        return rol === filtros.rol;
      });
    }
    if (filtros.activo !== undefined) {
      // Convierte el valor del backend a booleano antes de comparar
      data = data.filter((c) => Boolean(c.activo) === filtros.activo);
    }

    console.log("📋 Datos después de filtrar:", data); // ← Verifica el resultado
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
    const response = await api.get(`/api/v0/colaboradores/${id}`);
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
    const response = await api.post("/api/v0/colaboradores", payload);
    const created = response.data.data;
    return {
      ...mapBackendToFrontend(created),
      pin, // devuelve el PIN para mostrarlo al administrador
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al crear colaborador";
    throw new Error(message);
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
    const response = await api.put(`/api/v0/colaboradores/${id}`, payload);
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
    const response = await api.delete(`/api/v0/colaboradores/${id}`);
    return response.data.data ? true : false;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al eliminar colaborador";
    throw new Error(message);
  }
}

// ─── FUNCIONES AUXILIARES (mock) ──────────────────────────────

/**
 * Obtiene estadísticas de un colaborador (mock).
 * (El backend no tiene este endpoint aún)
 */
async function getEstadisticasColaborador(colaboradorId) {
  // TODO: implementar cuando el backend lo soporte
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
  // TODO: implementar cuando el backend lo soporte
  return [];
}

// ─── EXPORTACIÓN ────────────────────────────────────────────────

export const colaboradoresService = {
  getColaboradores,
  getColaboradorById,
  createColaborador,
  updateColaborador,
  deleteColaborador,
  getEstadisticasColaborador,
  getTrabajadoresByOwner,
};