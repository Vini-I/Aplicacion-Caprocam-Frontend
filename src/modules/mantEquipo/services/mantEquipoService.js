/**
 * ============================================================
 * SERVICIO: mantEquipoService
 * ============================================================
 * 
 * Responsabilidad: Centraliza los datos mock, constantes de estado
 * y funciones de consulta y persistencia en memoria para el módulo
 * de Mantenimiento de Equipos.
 * 
 * Datos:
 * - ESTADOS: Estados válidos para los tickets de mantenimiento.
 * - ESTADOS_EQUIPO: Estados válidos de funcionamiento de los equipos.
 * - EQUIPOS_MOCK: Listado inicial de equipos de la organización.
 * - EMPLEADOS_MOCK: Mapeo de empleados creadores de tickets a sus IDs.
 * - TICKETS_INICIALES: Listado inicial de tickets de mantenimiento.
 * 
 * Validaciones:
 * - Simulación de retardo de red con promesas resueltas.
 * - Actualización de estado del equipo mutando el mock local.
 * 
 * Navegación:
 * - Ninguna navegación directa. Utilizado por los hooks y pantallas.
 * 
 * Dependencias:
 * - Ninguna dependencia externa.
 */

export const ESTADOS = {
  EN_ESPERA: "en_espera",
  EN_MANTENIMIENTO: "en_mantenimiento",
  TICKET_RESUELTO: "Terminado",
};

export const ESTADOS_EQUIPO = [
  { label: "En funcionamiento", value: "funcionamiento" },
  { label: "En mantenimiento", value: "mantenimiento" },
  { label: "Fuera de servicio", value: "fuera_servicio" },
];

// Array mutable para demo — actualizarEstadoEquipo lo modifica en memoria
export let EQUIPOS_MOCK = [
  { id: "eq-001", nombre: "MAKITA", serie: "9-0050", tipo: "Aireación", marca: "Makita", ubicacion: "Estanque 1", fechaInstalacion: "2022-03-15", funcionEquipo: "Oxigenación del estanque principal", estadoEquipo: "funcionamiento" },
  { id: "eq-002", nombre: "FT", serie: "9-0024", tipo: "Bombeo", marca: "FT Industrial", ubicacion: "Estanque 2", fechaInstalacion: "2021-07-20", funcionEquipo: "Bombeo y circulación estanque 2", estadoEquipo: "funcionamiento" },
  { id: "eq-003", nombre: "MAKITA", serie: "9-0052", tipo: "Aireación", marca: "Makita", ubicacion: "Estanque 3", fechaInstalacion: "2023-01-10", funcionEquipo: "Aireación secundaria estanque 3", estadoEquipo: "funcionamiento" },
  { id: "eq-004", nombre: "ERABLUE", serie: "9-0015", tipo: "Monitoreo", marca: "Erablue", ubicacion: "Estanque 4", fechaInstalacion: "2022-11-05", funcionEquipo: "Monitoreo de parámetros del agua", estadoEquipo: "funcionamiento" },
  { id: "eq-005", nombre: "BOSCH", serie: "9-0003", tipo: "Mantenimiento", marca: "Bosch", ubicacion: "General", fechaInstalacion: "2020-06-18", funcionEquipo: "Herramienta eléctrica de mantenimiento", estadoEquipo: "funcionamiento" },
  { id: "eq-006", nombre: "CRAFTSMAN", serie: "9-0013", tipo: "Alimentación", marca: "Craftsman", ubicacion: "Estanque 5", fechaInstalacion: "2021-09-22", funcionEquipo: "Sistema automático de alimentación", estadoEquipo: "funcionamiento" },
  { id: "eq-007", nombre: "Westinghouse", serie: "9-0003", tipo: "Bombeo", marca: "Westinghouse", ubicacion: "Estanque 6", fechaInstalacion: "2019-04-30", funcionEquipo: "Motor de bombeo principal", estadoEquipo: "funcionamiento" },
];

// Mock de empleados para mostrar ID debajo del nombre
export const EMPLEADOS_MOCK = {
  "Amalia": { id: "EMP-001" },
  "Juli": { id: "EMP-002" },
  "Usuario": { id: "EMP-003" },
};

const TICKETS_INICIALES = [
  { id: "A026", equipoId: "eq-001", herramienta: "MAKITA 9-0050", titulo: "Preventivo MAKITA", descripcion: "Cambio de aceite y filtros (500 hrs)", tareas: [{ value: "T001", label: "Cambio de aceite y filtros" }], estado: ESTADOS.EN_MANTENIMIENTO, creadoPor: "Amalia", fechaCreacion: new Date("2024-03-12T03:55:00") },
  { id: "A025", equipoId: "eq-002", herramienta: "FT 9-0024", titulo: "Limpieza FT", descripcion: "Limpieza profunda y calibración", tareas: [{ value: "T002", label: "Limpieza de intercambiadores de calor" }], estado: ESTADOS.EN_ESPERA, creadoPor: "Amalia", fechaCreacion: new Date("2024-03-12T03:55:00") },
  { id: "A024", equipoId: "eq-003", herramienta: "MAKITA 9-0052", titulo: "Inspección MAKITA", descripcion: "Inspección estructural completa", tareas: [{ value: "T004", label: "Revisión de sistema de alimentación automática" }], estado: ESTADOS.EN_MANTENIMIENTO, creadoPor: "Amalia", fechaCreacion: new Date("2024-02-14T08:20:00") },
  { id: "A022", equipoId: "eq-004", herramienta: "ERABLUE 9-0015", titulo: "Rodamientos ERABLUE", descripcion: "Sustitución de rodamientos desgastados", tareas: [{ value: "T004", label: "Revisión de sistema de alimentación automática" }], estado: ESTADOS.TICKET_RESUELTO, creadoPor: "Amalia", fechaCreacion: new Date("2023-11-05T03:49:00") },
  { id: "A021", equipoId: "eq-005", herramienta: "BOSCH 9-0003", titulo: "Update BOSCH", descripcion: "Instalación de actualización de software", tareas: [{ value: "T002", label: "Limpieza de intercambiadores de calor" }], estado: ESTADOS.EN_MANTENIMIENTO, creadoPor: "Juli", fechaCreacion: new Date("2023-05-26T04:55:00") },
  { id: "A020", equipoId: "eq-006", herramienta: "CRAFTSMAN 9-0013", titulo: "Diagnóstico CRAFTSMAN", descripcion: "Diagnóstico de vibración y ruido", tareas: [{ value: "T003", label: "Calibración de sensores de pH" }], estado: ESTADOS.EN_ESPERA, creadoPor: "Juli", fechaCreacion: new Date("2023-05-26T04:55:00") },
  { id: "A019", equipoId: "eq-006", herramienta: "CRAFTSMAN 9-0013", titulo: "Seguridad CRAFTSMAN", descripcion: "Revisión general de seguridad", tareas: [{ value: "T001", label: "Cambio de aceite y filtros" }], estado: ESTADOS.EN_MANTENIMIENTO, creadoPor: "Juli", fechaCreacion: new Date("2023-05-26T04:55:00") },
  { id: "A018", equipoId: "eq-007", herramienta: "Westinghouse 9-0003", titulo: "Preventivo Westinghouse", descripcion: "Mantenimiento preventivo anual", tareas: [{ value: "T001", label: "Cambio de aceite y filtros" }], estado: ESTADOS.TICKET_RESUELTO, creadoPor: "Juli", fechaCreacion: new Date("2023-05-26T04:55:00") },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function obtenerTickets() {
  await delay(2500);
  return [...TICKETS_INICIALES];
}

// Muta EQUIPOS_MOCK en memoria para la demo — TODO: reemplazar por PATCH /equipos/:id
export function actualizarEstadoEquipo(equipoId, nuevoEstado) {
  EQUIPOS_MOCK = EQUIPOS_MOCK.map((e) =>
    e.id === equipoId ? { ...e, estadoEquipo: nuevoEstado } : e
  );
}
