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

function esErrorDuplicadoColaborador(error) {
  const status = error?.response?.status;
  const mensaje = `${error?.response?.data?.message || ''} ${error?.response?.data?.error || ''} ${error?.message || ''}`.toLowerCase();

  return (
    status === 409 ||
    mensaje.includes('duplicate entry') ||
    mensaje.includes('duplicate') ||
    mensaje.includes('uq_colaborador_usuario_grupo') ||
    mensaje.includes('colaborador_usuario_grupo') ||
    mensaje.includes('unique')
  );
}

// ─── MAPEO BACKEND → FRONTEND ──────────────────────────────────────
function mapBackendToFrontend(data) {
  // IMPORTANTE: el backend no es 100% consistente con el formato de sus
  // llaves: algunos endpoints devuelven snake_case (finca_id, rol_id,
  // nombre_usuario) y otros camelCase (fincaId, rolId, nombreUsuario;
  // ver fincaService.js, que documenta que /fincas devuelve "nombreFinca").
  // Para no perder datos silenciosamente (como pasaba con la finca del
  // colaborador, que se guardaba bien en la BD pero nunca se leía aquí),
  // se soportan ambos formatos.

  const rolIdRaw = data.rol_id ?? data.rolId;
  const rolId = rolIdRaw !== undefined && rolIdRaw !== null && rolIdRaw !== ""
    ? Number(rolIdRaw)
    : null;

  // Determinar el rol a partir del rol_id (numérico)
  let rol = "camprocam_worker";
  if (rolId === 2) rol = "external_owner";
  else if (rolId === 3) rol = "external_worker";

  // Si el backend no guardó la cédula en la columna 'cedula',
  // se toma de 'nombre_usuario' (donde sí está)
  const cedula = data.cedula || data.nombre_usuario || data.nombreUsuario || "";

  const fincaIdRaw = data.finca_id ?? data.fincaId;
  const fincaId = fincaIdRaw !== undefined && fincaIdRaw !== null && fincaIdRaw !== ""
    ? Number(fincaIdRaw)
    : null;

  return {
    id: data.id,
    nombre: `${data.nombre} ${data.apellidos}`,
    cedula: cedula,
    telefono: data.telefono,
    email: data.email,
    rol: rol,
    rolId: rolId,
    fincaId: fincaId,
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
      data = data.filter(
        (c) => Number(c.finca_id ?? c.fincaId) === Number(filtros.fincaId)
      );
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
    throw construirErrorHttp(error, "No se pudieron obtener los colaboradores");
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
    throw construirErrorHttp(error, "No se pudo cargar el colaborador");
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
    if (!payload) {
      throw new Error("No se pudo preparar los datos del colaborador.");
    }
    const response = await api.post("/colaboradores", payload);
    const created = response.data.data;
    return {
      ...mapBackendToFrontend(created),
      pin,
    };
  } catch (error) {
    if (esErrorDuplicadoColaborador(error)) {
      throw construirErrorHttp(error, "Ya existe un colaborador con esa cedula");
    }
    throw construirErrorHttp(error, "No se pudo crear el colaborador");
  }
}

/**
 * Actualiza un colaborador existente.
 * Si el objeto `data` contiene un campo `pin`, se usa para actualizar el PIN.
 * El PIN debe ser un string de 4 dígitos.
 */
async function updateColaborador(id, data) {
  try {
    // Extraer el PIN del objeto data si existe
    const { pin, ...restData } = data;

    // Si hay PIN, lo pasamos a prepareForBackend; si no, null.
    const payload = prepareForBackend(restData, pin || null);
    if (!payload) {
      throw new Error("No se pudo preparar los datos del colaborador.");
    }
    // Si no se proporcionó PIN, eliminamos pinHash del payload para que no se actualice.
    if (!pin) {
      delete payload.pinHash;
    }

    const response = await api.put(`/colaboradores/${id}`, payload);
    return mapBackendToFrontend(response.data.data);
  } catch (error) {
    throw construirErrorHttp(error, "No se pudo actualizar el colaborador");
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
    throw construirErrorHttp(error, "No se pudo eliminar el colaborador");
  }
}

// ─── FUNCIONES AUXILIARES (mock) ────────────────────────────────────

/**
 * Obtiene estadísticas de un colaborador (mock).
 */
async function getEstadisticasColaborador(colaboradorId) {
  try {
    return {
      alimentaciones: 0,
      estanquesCreados: 0,
      siembrasRegistradas: 0,
      ultimaActividad: null,
    };
  } catch (error) {
    throw construirErrorHttp(error, "No se pudieron obtener las estadísticas del colaborador");
  }
}

/**
 * Obtiene trabajadores externos asociados a un dueño (mock).
 */
async function getTrabajadoresByOwner(ownerId) {
  try {
    return [];
  } catch (error) {
    throw construirErrorHttp(error, "No se pudieron obtener los trabajadores asociados al dueño");
  }
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