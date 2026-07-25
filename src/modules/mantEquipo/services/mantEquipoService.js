import api from "../../../api/api.js";
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

function adaptBackendTicket(item) {
  return {
    id: item.codigoTicket || (item.id ? `A${String(item.id).padStart(3, "0")}` : "A001"),
    dbId: item.id,
    equipoId: item.equipoId || item.equipo_id,
    herramienta: item.herramienta || (item.equipoId ? `Equipo ${item.equipoId}` : "Equipo General"),
    titulo: item.tituloTicket || item.titulo || "Mantenimiento",
    descripcion: item.descripcionTicket || item.descripcion || "",
    tareas: item.tareas || [],
    estado: item.estadoTicket || item.estado || ESTADOS.EN_ESPERA,
    creadoPor: item.creadoPor || "Usuario",
    fechaCreacion: item.fechaCreacion ? new Date(item.fechaCreacion) : new Date(),
    tipoPersonal: item.tipoPersonal || item.tipo_personal || "interno",
    costoManoObra: Number(item.costoManoObra || item.costo_mano_obra || 0),
    costoTotal: Number(item.costoTotalEstimado || item.costoTotal || item.costo_total_estimado || 0),
    productos: item.productos || [],
  };
}

export async function obtenerTickets() {
  try {
    const response = await api.get("/mantenimientos");
    const data = response.data?.datos || response.data?.data || response.data;
    if (Array.isArray(data) && data.length > 0) {
      const adaptados = data.map(adaptBackendTicket);
      TICKETS_MOCK = adaptados;
      return adaptados;
    }
  } catch (e) {
    // Si no responde la API o falla la conexión, retorna la lista en memoria de respaldo
  }
  return [...TICKETS_MOCK];
}

// Muta EQUIPOS_MOCK en memoria y sincroniza con el catálogo de equipos general
export function actualizarEstadoEquipo(equipoId, nuevoEstado) {
  EQUIPOS_MOCK = EQUIPOS_MOCK.map((e) =>
    e.id === equipoId ? { ...e, estado: nuevoEstado } : e
  );
  equiposService.updateEquipo(equipoId, { estado: nuevoEstado }).catch(() => {});
}

// Reinicia el contador de horas de uso de un equipo (cuando el ticket se completa a Terminado)
export function reiniciarHorasEquipo(equipoId) {
  EQUIPOS_MOCK = EQUIPOS_MOCK.map((e) =>
    e.id === equipoId ? { ...e, horasUso: 0, estado: "activo" } : e
  );
  equiposService.updateEquipo(equipoId, { horasUso: 0, estado: "activo" }).catch(() => {});
}

// Funciones CRUD para TICKETS_MOCK con llamadas a la API
export async function agregarTicket(ticket) {
  TICKETS_MOCK = [ticket, ...TICKETS_MOCK];
  try {
    const payload = {
      tituloTicket: ticket.titulo,
      descripcionTicket: ticket.descripcion,
      equipoId: ticket.equipoId,
      estadoTicket: ticket.estado,
      estadoEquipo: ticket.estadoEquipo,
      tipoPersonal: ticket.tipoPersonal,
      costoManoObra: ticket.costoManoObra,
      costoTotalEstimado: ticket.costoTotal,
      tareas: ticket.tareas,
      productos: ticket.productos,
    };
    const res = await api.post("/mantenimientos", payload);
    const backendData = res.data?.datos || res.data?.data || res.data;
    if (backendData && backendData.id) {
      ticket.dbId = backendData.id;
    }
  } catch (e) {
    // Si el backend no responde, se conserva localmente
  }
  return ticket;
}

export async function actualizarTicket(ticket) {
  TICKETS_MOCK = TICKETS_MOCK.map((t) => (t.id === ticket.id ? { ...t, ...ticket } : t));
  try {
    const targetId = ticket.dbId || ticket.id;
    const payload = {
      tituloTicket: ticket.titulo,
      descripcionTicket: ticket.descripcion,
      equipoId: ticket.equipoId,
      estadoTicket: ticket.estado,
      estadoEquipo: ticket.estadoEquipo,
      tipoPersonal: ticket.tipoPersonal,
      costoManoObra: ticket.costoManoObra,
      costoTotalEstimado: ticket.costoTotal,
      tareas: ticket.tareas,
      productos: ticket.productos,
    };
    await api.put(`/mantenimientos/${targetId}`, payload);
  } catch (e) {
    // Si el backend no responde, se conserva localmente
  }
  return ticket;
}

export async function eliminarTicket(id) {
  const target = TICKETS_MOCK.find((t) => t.id === id);
  TICKETS_MOCK = TICKETS_MOCK.filter((t) => t.id !== id);
  try {
    const targetId = target?.dbId || id;
    await api.delete(`/mantenimientos/${targetId}`);
  } catch (e) {
    // Si el backend no responde, se elimina localmente
  }
}
