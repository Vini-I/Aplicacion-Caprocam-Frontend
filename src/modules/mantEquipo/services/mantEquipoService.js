/**
 * SERVICE: mantEquipoService
 * Ruta: src/modules/mantEquipo/services/mantEquipoService.js
 *
 * Datos y funciones mock para demostración.
 * TODO backend: reemplazar EQUIPOS_MOCK, TICKETS_INICIALES y las funciones
 *              exportadas por llamadas reales al API REST.
 */

/** Posibles estados de un ticket de mantenimiento. */
export const ESTADOS = {
  EN_MANTENIMIENTO:  "en_mantenimiento",
  FUERA_DE_SERVICIO: "fuera_de_servicio",
};

/** Catálogo de equipos de la empresa (mock temporal). */
export const EQUIPOS_MOCK = [
  { id: "eq-001", nombre: "MAKITA",       serie: "9-0050", tipo: "Aireación",     marca: "Makita",        ubicacion: "Estanque 1", fechaInstalacion: "2022-03-15", funcionEquipo: "Oxigenación del estanque principal" },
  { id: "eq-002", nombre: "FT",           serie: "9-0024", tipo: "Bombeo",        marca: "FT Industrial", ubicacion: "Estanque 2", fechaInstalacion: "2021-07-20", funcionEquipo: "Bombeo y circulación estanque 2" },
  { id: "eq-003", nombre: "MAKITA",       serie: "9-0052", tipo: "Aireación",     marca: "Makita",        ubicacion: "Estanque 3", fechaInstalacion: "2023-01-10", funcionEquipo: "Aireación secundaria estanque 3" },
  { id: "eq-004", nombre: "ERABLUE",      serie: "9-0015", tipo: "Monitoreo",     marca: "Erablue",       ubicacion: "Estanque 4", fechaInstalacion: "2022-11-05", funcionEquipo: "Monitoreo de parámetros del agua" },
  { id: "eq-005", nombre: "BOSCH",        serie: "9-0003", tipo: "Mantenimiento", marca: "Bosch",         ubicacion: "General",    fechaInstalacion: "2020-06-18", funcionEquipo: "Herramienta eléctrica de mantenimiento" },
  { id: "eq-006", nombre: "CRAFTSMAN",    serie: "9-0013", tipo: "Alimentación",  marca: "Craftsman",     ubicacion: "Estanque 5", fechaInstalacion: "2021-09-22", funcionEquipo: "Sistema automático de alimentación" },
  { id: "eq-007", nombre: "Westinghouse", serie: "9-0003", tipo: "Bombeo",        marca: "Westinghouse",  ubicacion: "Estanque 6", fechaInstalacion: "2019-04-30", funcionEquipo: "Motor de bombeo principal" },
];

/** Tickets de ejemplo para la demo (mock temporal). */
const TICKETS_INICIALES = [
  { id: "A026", equipoId: "eq-001", herramienta: "MAKITA 9-0050",       titulo: "Preventivo MAKITA",       descripcion: "Cambio de aceite y filtros (500 hrs)",       estado: ESTADOS.EN_MANTENIMIENTO,  creadoPor: "Amalia", fechaCreacion: new Date("2024-03-12T03:55:00"), fechaVencimiento: new Date("2024-03-13T03:55:00") },
  { id: "A025", equipoId: "eq-002", herramienta: "FT 9-0024",           titulo: "Limpieza FT",             descripcion: "Limpieza profunda y calibración",             estado: ESTADOS.FUERA_DE_SERVICIO, creadoPor: "Amalia", fechaCreacion: new Date("2024-03-12T03:55:00"), fechaVencimiento: new Date("2024-03-15T03:55:00") },
  { id: "A024", equipoId: "eq-003", herramienta: "MAKITA 9-0052",       titulo: "Inspección MAKITA",       descripcion: "Inspección estructural completa",              estado: ESTADOS.EN_MANTENIMIENTO,  creadoPor: "Amalia", fechaCreacion: new Date("2024-02-14T08:20:00"), fechaVencimiento: new Date("2023-04-24T06:00:00") },
  { id: "A022", equipoId: "eq-004", herramienta: "ERABLUE 9-0015",      titulo: "Rodamientos ERABLUE",     descripcion: "Sustitución de rodamientos desgastados",       estado: ESTADOS.FUERA_DE_SERVICIO, creadoPor: "Amalia", fechaCreacion: new Date("2023-11-05T03:49:00"), fechaVencimiento: new Date("2024-03-12T03:40:00") },
  { id: "A021", equipoId: "eq-005", herramienta: "BOSCH 9-0003",        titulo: "Update BOSCH",            descripcion: "Instalación de actualización de software",     estado: ESTADOS.EN_MANTENIMIENTO,  creadoPor: "Juli",   fechaCreacion: new Date("2023-05-26T04:55:00"), fechaVencimiento: new Date("2024-03-14T04:55:00") },
  { id: "A020", equipoId: "eq-006", herramienta: "CRAFTSMAN 9-0013",    titulo: "Diagnóstico CRAFTSMAN",   descripcion: "Diagnóstico de vibración y ruido",             estado: ESTADOS.FUERA_DE_SERVICIO, creadoPor: "Juli",   fechaCreacion: new Date("2023-05-26T04:55:00"), fechaVencimiento: new Date("2024-03-13T05:55:00") },
  { id: "A019", equipoId: "eq-006", herramienta: "CRAFTSMAN 9-0013",    titulo: "Seguridad CRAFTSMAN",     descripcion: "Revisión general de seguridad",                estado: ESTADOS.EN_MANTENIMIENTO,  creadoPor: "Juli",   fechaCreacion: new Date("2023-05-26T04:55:00"), fechaVencimiento: new Date("2024-03-19T04:55:00") },
  { id: "A018", equipoId: "eq-007", herramienta: "Westinghouse 9-0003", titulo: "Preventivo Westinghouse", descripcion: "Mantenimiento preventivo anual",                estado: ESTADOS.FUERA_DE_SERVICIO, creadoPor: "Juli",   fechaCreacion: new Date("2023-05-26T04:55:00"), fechaVencimiento: null },
];

/**
 * Obtiene todos los tickets de mantenimiento.
 * TODO backend: reemplazar por GET /tickets-mantenimiento
 * @returns {Promise<Array>}
 */
export async function obtenerTickets() {
  return Promise.resolve([...TICKETS_INICIALES]);
}

/**
 * Crea un nuevo ticket de mantenimiento.
 * TODO backend: reemplazar por POST /tickets-mantenimiento
 * @param {object} payload - Datos del ticket a crear.
 * @returns {Promise<{ok: boolean, data: object}>}
 */
export async function crearTicket(payload) {
  return Promise.resolve({ ok: true, data: payload });
}
