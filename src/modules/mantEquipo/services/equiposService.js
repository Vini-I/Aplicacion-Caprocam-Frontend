/**
 * ============================================================
 * SERVICIO: equiposService
 * ============================================================
 *
 * Servicio con operaciones CRUD para equipos.
 * CONECTADO al backend real (API REST /api/v0/equipos).
 *
 * Funciones:
 * - getEquipos(filtros) -> Promise<Array>
 * - getEquipoById(id) -> Promise<Object>
 * - createEquipo(data) -> Promise<Object>
 * - updateEquipo(id, data) -> Promise<Object>
 * - deleteEquipo(id) -> Promise<boolean>
 * - toggleEquipoEstado(id, equipoActual) -> Promise<Object>
 * - getEquiposProximosMantenimiento() -> Promise<Array>
 * - getEstadisticasEquipos() -> Promise<Object>
 *
 * Ejemplo:
 * const equipos = await equiposService.getEquipos({ tipo: 'aireacion' });
 * ============================================================
 */

// ============================================================
// IMPORTS
// ============================================================
import api from "../../../api/api";

// ============================================================
// CONSTANTES
// ============================================================

// Tipos de equipo con sus códigos de prefijo (usado en la UI)
export const TIPOS_EQUIPO = [
  { label: "Aireación", value: "aireacion", prefijo: "20" },
  { label: "Bombeo", value: "bombeo", prefijo: "10" },
  { label: "Alimentación", value: "alimentacion", prefijo: "30" },
  { label: "Monitoreo", value: "monitoreo", prefijo: "40" },
  { label: "Mantenimiento", value: "mantenimiento", prefijo: "50" },
  { label: "Otro", value: "otro", prefijo: "99" },
];

// ============================================================
// MAPEOS DE ENUMS (frontend en minúsculas <-> backend en español capitalizado)
// ============================================================

// tipoEquipo: TipoEquipo enum del backend (equipo.dto.js)
const TIPO_BACKEND_A_FRONTEND = {
  Aireacion: "aireacion",
  Bombeo: "bombeo",
  Alimentacion: "alimentacion",
  Monitoreo: "monitoreo",
  Mantenimiento: "mantenimiento",
  Otro: "otro",
};

const TIPO_FRONTEND_A_BACKEND = {
  aireacion: "Aireacion",
  bombeo: "Bombeo",
  alimentacion: "Alimentacion",
  monitoreo: "Monitoreo",
  mantenimiento: "Mantenimiento",
  otro: "Otro",
};

// estadoOperativo: EstadoOperativoEquipo enum del backend
// (esto reemplaza el antiguo campo "estado" del mock: activo/inactivo/mantenimiento)
const ESTADO_OPERATIVO_BACKEND_A_FRONTEND = {
  Activo: "activo",
  Inactivo: "inactivo",
  Mantenimiento: "mantenimiento",
};

const ESTADO_OPERATIVO_FRONTEND_A_BACKEND = {
  activo: "Activo",
  inactivo: "Inactivo",
  mantenimiento: "Mantenimiento",
};

// estado: EstadoEquipo enum del backend (Encendido/Apagado)
// En el frontend se maneja como booleano "encendido"

// ============================================================
// FUNCIONES AUXILIARES DE MAPEO
// ============================================================

// Convierte YYYY-MM-DD (formato que devuelve el backend) a dd/mm/aaaa (formato del formulario)
function fechaBackendAFormulario(fecha) {
  if (!fecha) return "";
  const [anio, mes, dia] = String(fecha).split("-");
  if (!anio || !mes || !dia) return "";
  return `${dia}/${mes}/${anio}`;
}

/**
 * Mapea la respuesta del backend (camelCase, enums capitalizados)
 * al shape que espera el frontend (lista, formulario, detalle).
 */
function mapEquipoBackend(equipo) {
  return {
    id: equipo.id,
    uuid: equipo.uuid,

    // Identificación
    codigo: equipo.identificador,
    codigoInterno: equipo.identificador, // alias usado por el formulario de registro

    nombre: equipo.nombreEquipo,
    descripcion: equipo.descripcion,

    // Tipo (antes tipo + subcategoria, ahora un solo campo)
    tipo: TIPO_BACKEND_A_FRONTEND[equipo.tipoEquipo] || "otro",

    fechaInstalacion: fechaBackendAFormulario(equipo.fechaInstalacion),
    funcionEquipo: equipo.funcionEquipo,

    // Ubicación (antes texto libre, ahora es el estanque asociado)
    estanqueId: equipo.estanqueId,
    ubicacion: equipo.estanqueId,

    // Horas
    horasMantenimiento: equipo.horasMantenimiento,
    horasUso: Number(equipo.horasActuales || 0),

    // Estado operativo: activo / inactivo / mantenimiento
    estado: ESTADO_OPERATIVO_BACKEND_A_FRONTEND[equipo.estadoOperativo] || "activo",

    // Encendido / Apagado
    encendido: equipo.estado === "Encendido",

    activo: Boolean(equipo.activo),
  };
}

function mapEquiposBackend(lista) {
  return (lista || []).map(mapEquipoBackend);
}

/**
 * Mapea los datos del formulario del frontend al shape que
 * espera el backend para crear/actualizar un equipo.
 */
function mapEquipoFrontendABackend(data) {
  const payload = {
    identificador: data.codigo || data.codigoInterno,
    nombreEquipo: data.nombre,
    descripcion: data.descripcion,
    tipoEquipo: TIPO_FRONTEND_A_BACKEND[data.tipo] || "Otro",
    fechaInstalacion: data.fechaInstalacion,
    funcionEquipo: data.funcionEquipo,
    estadoOperativo: ESTADO_OPERATIVO_FRONTEND_A_BACKEND[data.estado] || "Activo",
  };

  // Campos opcionales: solo se envían si tienen valor
  if (data.estanqueId || data.ubicacion) {
    payload.estanqueId = data.estanqueId || data.ubicacion;
  }
  if (data.horasMantenimiento) {
    payload.horasMantenimiento = data.horasMantenimiento;
  }
  if (data.estadoEncendido !== undefined) {
    payload.estado = data.estadoEncendido ? "Encendido" : "Apagado";
  }

  return payload;
}

function necesitaMantenimientoProximo(equipo, umbral = 100) {
  if (!equipo.horasMantenimiento) return false;
  const restantes = equipo.horasMantenimiento - equipo.horasUso;
  return restantes > 0 && restantes <= umbral;
}

// ============================================================
// EXPORTACIÓN DE FUNCIONES
// ============================================================

export const equiposService = {
  /**
   * Obtiene todos los equipos con filtros opcionales — CONECTADO a la API real.
   * El backend solo filtra por estanqueId; el resto de filtros
   * (tipo, estado, encendido, búsqueda) se aplican en el cliente
   * porque el endpoint actual no los soporta.
   */
  async getEquipos(filtros = {}) {
    try {
      const params = {};
      if (filtros.estanqueId) params.estanqueId = filtros.estanqueId;

      const response = await api.get("/equipos", { params });
      let resultados = mapEquiposBackend(response.data.data);

      if (filtros.tipo) {
        resultados = resultados.filter((e) => e.tipo === filtros.tipo);
      }
      if (filtros.estado) {
        resultados = resultados.filter((e) => e.estado === filtros.estado);
      }
      if (filtros.encendido !== undefined) {
        resultados = resultados.filter((e) => e.encendido === filtros.encendido);
      }
      if (filtros.busqueda) {
        const q = filtros.busqueda.toLowerCase();
        resultados = resultados.filter(
          (e) =>
            e.nombre.toLowerCase().includes(q) ||
            e.descripcion.toLowerCase().includes(q) ||
            e.codigo.toLowerCase().includes(q)
        );
      }

      resultados.sort((a, b) => a.nombre.localeCompare(b.nombre));
      return resultados;
    } catch (err) {
      throw new Error(err.response?.data?.message || "No se pudieron obtener los equipos.");
    }
  },

  /**
   * Obtiene un equipo por su ID — CONECTADO a la API real
   */
  async getEquipoById(id) {
    try {
      const response = await api.get(`/equipos/${id}`);
      return mapEquipoBackend(response.data.data);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Equipo no encontrado");
    }
  },

  /**
   * Crea un nuevo equipo — CONECTADO a la API real
   */
  async createEquipo(data) {
    try {
      const payload = mapEquipoFrontendABackend(data);
      const response = await api.post("/equipos", payload);
      return mapEquipoBackend(response.data.data);
    } catch (err) {
      throw new Error(err.response?.data?.message || "No se pudo crear el equipo.");
    }
  },

  /**
   * Actualiza un equipo existente — CONECTADO a la API real
   */
  async updateEquipo(id, data) {
    try {
      const payload = mapEquipoFrontendABackend(data);
      const response = await api.put(`/equipos/${id}`, payload);
      return mapEquipoBackend(response.data.data);
    } catch (err) {
      throw new Error(err.response?.data?.message || "No se pudo actualizar el equipo.");
    }
  },

  /**
   * Elimina (lógicamente) un equipo — CONECTADO a la API real
   */
  async deleteEquipo(id) {
    try {
      await api.delete(`/equipos/${id}`);
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || "No se pudo eliminar el equipo.");
    }
  },

  /**
   * Cambia el estado de encendido/apagado de un equipo — CONECTADO a la API real.
   *
   * IMPORTANTE: el backend actual no registra la fecha/hora en que
   * el equipo se encendió, por lo que este toggle NO puede calcular
   * automáticamente las horas a sumar a horasActuales. Solo actualiza
   * el campo "estado" (Encendido/Apagado). Si se necesita el conteo
   * automático de horas, el backend debe agregar un campo tipo
   * "fecha_ultimo_encendido" y sumar el delta al apagar.
   *
   * Requiere el objeto del equipo actual (tal como viene de la lista)
   * porque el backend exige el body completo en el PUT.
   */
  async toggleEquipoEstado(id, equipoActual) {
    try {
      const payload = mapEquipoFrontendABackend(equipoActual);
      payload.estado = equipoActual.encendido ? "Apagado" : "Encendido";

      const response = await api.put(`/equipos/${id}`, payload);
      return mapEquipoBackend(response.data.data);
    } catch (err) {
      throw new Error(err.response?.data?.message || "No se pudo cambiar el estado del equipo.");
    }
  },

  /**
   * Obtiene los equipos que están próximos a necesitar mantenimiento.
   * Calculado en el cliente a partir de getEquipos(), ya que el
   * backend no expone un endpoint dedicado.
   */
  async getEquiposProximosMantenimiento(umbral = 100) {
    const equipos = await this.getEquipos();
    const activos = equipos.filter((e) => e.estado === "activo");
    const proximos = activos.filter((e) => necesitaMantenimientoProximo(e, umbral));

    proximos.sort(
      (a, b) =>
        (a.horasMantenimiento - a.horasUso) - (b.horasMantenimiento - b.horasUso)
    );
    return proximos;
  },

  /**
   * Obtiene estadísticas generales de equipos.
   * Calculado en el cliente a partir de getEquipos(), ya que el
   * backend no expone un endpoint dedicado.
   */
  async getEstadisticasEquipos() {
    const equipos = await this.getEquipos();
    const total = equipos.length;
    const activos = equipos.filter((e) => e.estado === "activo").length;
    const mantenimiento = equipos.filter((e) => e.estado === "mantenimiento").length;
    const encendidos = equipos.filter((e) => e.encendido).length;
    const proximosMantenimiento = equipos.filter(
      (e) => e.estado === "activo" && necesitaMantenimientoProximo(e)
    ).length;

    return { total, activos, mantenimiento, encendidos, proximosMantenimiento };
  },

  /**
   * Obtiene los tipos de equipo disponibles
   */
  getTiposEquipo() {
    return TIPOS_EQUIPO;
  },

  /**
   * Obtiene la lista de estanques disponibles para asociar — CONECTADO a la API real
   */
  async getEstanquesDisponibles() {
    try {
      const response = await api.get("/estanques");
      return response.data.data.map((estanque) => ({
        label: `${estanque.codigo} (${estanque.tipoEstanque})`,
        value: String(estanque.id),
      }));
    } catch (err) {
      return [];
    }
  },

  /**
   * Formatea las horas de uso para mostrar
   */
  formatearHoras(horas) {
    if (horas < 1) {
      return `${Math.round(horas * 60)} min`;
    }
    return `${Math.round(horas)} h`;
  },
};