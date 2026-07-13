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
  "Ticket ID#", "Fecha creación", "Estado", "Herramienta", "Tareas", "Descripción", "Creado por",
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
  labelTitulo: "Título del ticket *",
  placeholderTitulo: "Ej: Revisión mensual BOSCH",
  labelEquipo: "Equipo *",
  placeholderEquipo: "Busca por nombre, serie, tipo...",
  labelTarea: "Tareas *",
  placeholderTarea: "Busca o selecciona una tarea...",
  labelEstadoEquipo: "Estado del equipo",
  labelDescripcion: "Descripción del problema *",
  placeholderDesc: "Describe por qué el equipo requiere mantenimiento",
  labelEstado: "Estado del ticket",
  btnCancelar: "Cancelar",
  btnAceptar: "Aceptar",
  btnActualizar: "Actualizar",
  btnEliminar: "Eliminar",
  tituloEdicion: "Modificar Mantenimiento",
  errorValidacion: "Revisa los campos obligatorios marcados con * antes de guardar.",
};

export const OPCIONES_ESTADO_TICKET = [
  { label: "En espera", value: "en_espera" },
  { label: "En mantenimiento", value: "en_mantenimiento" },
  { label: "Terminado", value: "Terminado" },
];

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
  ["estadoEquipo", "Estado actual"],
  ["funcionEquipo", "Función"],
];

//esto se puede eliminar apenas este la api
export const TAREAS_DEMO = [
  {
    id: "T001",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    label: "Cambio de aceite y filtros",
    value: "T001"
  },
  {
    id: "T002",
    nombre: "Limpieza de intercambiadores de calor",
    descripcion: "Limpieza profunda de los intercambiadores de calor de los sistemas de refrigeración.",
    categoria: "correctivo",
    duracionEstimada: 4.0,
    label: "Limpieza de intercambiadores de calor",
    value: "T002"
  },
  {
    id: "T003",
    nombre: "Calibración de sensores de pH",
    descripcion: "Calibración de los sensores de pH en los estanques de cultivo.",
    categoria: "predictivo",
    duracionEstimada: 1.0,
    label: "Calibración de sensores de pH",
    value: "T003"
  },
  {
    id: "T004",
    nombre: "Revisión de sistema de alimentación automática",
    descripcion: "Inspección y ajuste de los alimentadores automáticos.",
    categoria: "preventivo",
    duracionEstimada: 3.0,
    label: "Revisión de sistema de alimentación automática",
    value: "T004"
  },
  {
    id: "T005",
    nombre: "Reparación de bomba de agua",
    descripcion: "Diagnóstico y reparación de la bomba de agua principal.",
    categoria: "emergencia",
    duracionEstimada: 6.0,
    label: "Reparación de bomba de agua",
    value: "T005"
  }
];

export const LISTA_ESTADOS_EQUIPO = [
  { label: "En funcionamiento", value: "funcionamiento" },
  { label: "En mantenimiento", value: "mantenimiento" },
  { label: "Fuera de servicio", value: "fuera_servicio" },
];

export const LISTA_ESTADOS_TICKET = [
  { label: "En espera", value: "en_espera" },
  { label: "En mantenimiento", value: "en_mantenimiento" },
  { label: "Terminado", value: "Terminado" },
];
