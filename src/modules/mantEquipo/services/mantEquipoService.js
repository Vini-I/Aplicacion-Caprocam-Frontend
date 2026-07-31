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

import { equiposService } from "./equiposService.js";

export const ESTADOS = {
  EN_ESPERA: "en_espera",
  EN_MANTENIMIENTO: "en_mantenimiento",
  TICKET_RESUELTO: "Terminado",
};

export const ESTADOS_EQUIPO = [
  { label: "Activo", value: "activo" },
  { label: "Inactivo", value: "inactivo" },
  { label: "En mantenimiento", value: "mantenimiento" },
];

// Array mutable para demo — actualizarEstadoEquipo lo modifica en memoria
export let EQUIPOS_MOCK = [
  { id: "eq-001", nombre: "MAKITA", serie: "9-0050", tipo: "Aireación", marca: "Makita", ubicacion: "Estanque 1", fechaInstalacion: "2022-03-15", funcionEquipo: "Oxigenación del estanque principal", estado: "activo", horasUso: 1247, horasMantenimiento: 500 },
  { id: "eq-002", nombre: "FT", serie: "9-0024", tipo: "Bombeo", marca: "FT Industrial", ubicacion: "Estanque 2", fechaInstalacion: "2021-07-20", funcionEquipo: "Bombeo y circulación estanque 2", estado: "activo", horasUso: 876, horasMantenimiento: 500 },
  { id: "eq-003", nombre: "MAKITA", serie: "9-0052", tipo: "Aireación", marca: "Makita", ubicacion: "Estanque 3", fechaInstalacion: "2023-01-10", funcionEquipo: "Aireación secundaria estanque 3", estado: "activo", horasUso: 876, horasMantenimiento: 500 },
  { id: "eq-004", nombre: "ERABLUE", serie: "9-0015", tipo: "Monitoreo", marca: "Erablue", ubicacion: "Estanque 4", fechaInstalacion: "2022-11-05", funcionEquipo: "Monitoreo de parámetros del agua", estado: "activo", horasUso: 567, horasMantenimiento: 1000 },
  { id: "eq-005", nombre: "BOSCH", serie: "9-0003", tipo: "Mantenimiento", marca: "Bosch", ubicacion: "General", fechaInstalacion: "2020-06-18", funcionEquipo: "Herramienta eléctrica de mantenimiento", estado: "activo", horasUso: 432, horasMantenimiento: 500 },
  { id: "eq-006", nombre: "CRAFTSMAN", serie: "9-0013", tipo: "Alimentación", marca: "Craftsman", ubicacion: "Estanque 5", fechaInstalacion: "2021-09-22", funcionEquipo: "Sistema automático de alimentación", estado: "activo", horasUso: 432, horasMantenimiento: 500 },
  { id: "eq-007", nombre: "Westinghouse", serie: "9-0003", tipo: "Bombeo", marca: "Westinghouse", ubicacion: "Estanque 6", fechaInstalacion: "2019-04-30", funcionEquipo: "Motor de bombeo principal", estado: "activo", horasUso: 3210, horasMantenimiento: 1000 },
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

export let TICKETS_MOCK = [...TICKETS_INICIALES];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function obtenerTickets() {
  await delay(1200); // Retardo reducido para agilizar flujo
  return [...TICKETS_MOCK];
}

// Muta EQUIPOS_MOCK en memoria y sincroniza con el catálogo de equipos general
export function actualizarEstadoEquipo(equipoId, nuevoEstado) {
  // 1. Actualizar en el mock local de mantEquipo
  EQUIPOS_MOCK = EQUIPOS_MOCK.map((e) =>
    e.id === equipoId ? { ...e, estado: nuevoEstado } : e
  );

  // 2. Actualizar en el catálogo de equipos general llamando a la API pública oficial
  equiposService.updateEquipo(equipoId, { estado: nuevoEstado }).catch(() => {});
}

// Reinicia el contador de horas de uso de un equipo (cuando el ticket se completa a Terminado)
export function reiniciarHorasEquipo(equipoId) {
  // 1. Reiniciar en el mock local de mantEquipo
  EQUIPOS_MOCK = EQUIPOS_MOCK.map((e) =>
    e.id === equipoId ? { ...e, horasUso: 0, estado: "activo" } : e
  );

  // 2. Reiniciar en el catálogo de equipos general llamando a la API pública oficial
  equiposService.updateEquipo(equipoId, { horasUso: 0, estado: "activo" }).catch(() => {});
}

// Funciones CRUD para TICKETS_MOCK
export function agregarTicket(ticket) {
  TICKETS_MOCK = [ticket, ...TICKETS_MOCK];
}

export function actualizarTicket(ticket) {
  TICKETS_MOCK = TICKETS_MOCK.map((t) => (t.id === ticket.id ? { ...t, ...ticket } : t));
}

export function eliminarTicket(id) {
  TICKETS_MOCK = TICKETS_MOCK.filter((t) => t.id !== id);
}
