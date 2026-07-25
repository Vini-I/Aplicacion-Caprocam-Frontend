/**
 * ============================================================
 * CONSTANTES: mantEquipoMensajes
 * ============================================================
 * 
 * Responsabilidad: Centraliza los textos estáticos, etiquetas de campos,
 * cabeceras de tabla y opciones para comboboxes y selectores en el módulo
 * de Mantenimiento de Equipos.
 * 
 * Datos:
 * - TEXTOS_MODAL_AGREGAR: Etiquetas y placeholders del formulario.
 * - LISTA_ESTADOS_TICKET: Opciones de estado estandarizadas para el ticket.
 * - LABELS_EQUIPO_DETALLE: Etiquetas de campos del detalle de equipo.
 * 
 * Validaciones:
 * - Los campos obligatorios están marcados con asterisco (*).
 * 
 * Navegación:
 * - Ninguna.
 * 
 * Dependencias:
 * - Ninguna.
 */

export const USUARIO_SESION = "Usuario";

export const TEXTOS_PANTALLA = {
  sinTickets: "No se encuentran equipos.",
  placeholderBuscar: "Buscar ticket, equipo, tarea, descripción...",
  btnAgregarMant: "Agregar Mantenimiento",
  btnAgregarTarea: "Ver Tareas",
};

export const HEADERS_TABLA = [
  "Ticket ID#", "Fecha creación", "Estado", "Título", "Descripción", "Creado por",
];

export const TEXTOS_MODAL_AGREGAR = {
  titulo: "Agregar Mantenimiento",
  labelFechaHora: "Fecha y Hora",
  labelCreadoPor: "Creado por",
  labelTitulo: "Título *",
  placeholderTitulo: "Ej: Revisión mensual BOSCH",
  labelEquipo: "Equipo *",
  placeholderEquipo: "Seleccione un equipo...",
  labelTarea: "Tareas *",
  placeholderTarea: "Busca o selecciona una tarea...",
  labelEstadoEquipo: "Estado del equipo",
  labelDescripcion: "Descripción *",
  placeholderDesc: "Describe el mantenimiento requerido",
  labelEstado: "Estado del ticket",
  btnAceptar: "Crear Mantenimiento",
  btnActualizar: "Actualizar",
  btnEliminar: "Eliminar",
  tituloEdicion: "Modificar Mantenimiento",
  errorValidacion: "Revisa los campos obligatorios marcados con * antes de guardar.",
};

export const LABELS_EQUIPO_DETALLE = [
  ["serie", "Serie"],
  ["tipo", "Tipo"],
  ["marca", "Marca"],
  ["ubicacion", "Ubicación"],
  ["estado", "Estado actual"],
  ["funcionEquipo", "Función"],
  ["horasUso", "Horas de uso actual"],
];

// NOTA: Los estados de equipo se definen en mantEquipoService.js como ESTADOS_EQUIPO

export const LISTA_ESTADOS_TICKET = [
  { label: "En espera", value: "en_espera" },
  { label: "En mantenimiento", value: "en_mantenimiento" },
  { label: "Terminado", value: "Terminado" },
];

export const LISTA_TIPOS_PERSONAL = [
  { label: "Trabajador Interno", value: "interno" },
  { label: "Trabajador Externo", value: "externo" },
];