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
 * - OPCIONES_FILTRO: Opciones para filtrar los tickets.
 * - TEXTOS_MODAL_AGREGAR: Etiquetas y placeholders del formulario.
 * - OPCIONES_ESTADO_TICKET: Opciones de estado estandarizadas para el ticket.
 * - TAREAS_DEMO: Tareas disponibles sincronizadas con el servicio de tareas.
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
  btnVerEquipos: "Ver Equipos",
  filtrarPor: "Filtrar por...",
};

export const HEADERS_TABLA = [
  "Ticket ID#", "Fecha creación", "Estado", "Título", "Descripción", "Creado por",
];

export const OPCIONES_FILTRO = [
  { label: "Todos los campos", value: "" },
  { label: "TicketID", value: "id" },
  { label: "Estado", value: "estado" },
  { label: "Equipo / Tool", value: "herramienta" },
  { label: "Descripción", value: "descripcion" },
  { label: "Creado por", value: "creadoPor" },
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
  btnCancelar: "Cancelar",
  btnAceptar: "Aceptar",
  btnActualizar: "Actualizar",
  btnEliminar: "Eliminar",
  tituloEdicion: "Modificar Mantenimiento",
  errorValidacion: "Revisa los campos obligatorios marcados con * antes de guardar.",
};


export const TEXTOS_MODAL_DETALLE = {
  titulo: "Detalle del Ticket",
  btnModificar: "Modificar Ticket",
  btnCancelar: "Cancelar Ticket",
  campoTicketId: "TicketID",
  campoTitulo: "Título",
  campoEquipo: "Equipo",
  campoEstado: "Estado",
  campoTareas: "Tareas",
  campoDesc: "Descripción",
  campoCreadoPor: "Creado por",
  campoFechaC: "Fecha creación",
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
