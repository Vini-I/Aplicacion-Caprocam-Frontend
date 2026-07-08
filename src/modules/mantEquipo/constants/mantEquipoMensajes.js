/**
 * CONSTANTES: mantEquipoMensajes
 * Ruta: src/modules/mantEquipo/constants/mantEquipoMensajes.js
 *
 * Centraliza todos los textos visibles al usuario del módulo de mantenimiento.
 * Facilita la futura internacionalización (i18n) sin tocar los componentes.
 */

/** Textos de la pantalla principal (toolbar, tabla vacía). */
export const TEXTOS_PANTALLA = {
  sinTickets:        "No se encontraron tickets.",
  placeholderBuscar: "Buscar… (filtrado por backend)",
  btnAgregarMant:    "Agregar Mantenimiento",
  btnAgregarTarea:   "Agregar Tarea",
  filtrarPor:        "Filtrar por…",
};

/** Cabeceras de las columnas de la tabla de tickets. */
export const HEADERS_TABLA = [
  "Ticket ID#",
  "Fecha creación",
  "Estado",
  "Herramienta",
  "Descripción",
  "Creado por",
];

/** Opciones del select de filtro de la toolbar. */
export const OPCIONES_FILTRO = [
  { label: "Filtrar por…",  value: "" },
  { label: "TicketID",      value: "id" },
  { label: "Estado",        value: "estado" },
  { label: "Equipo / Tool", value: "herramienta" },
  { label: "Descripción",   value: "descripcion" },
  { label: "Creado por",    value: "creadoPor" },
];

/** Textos del modal para crear o editar un ticket de mantenimiento. */
export const TEXTOS_MODAL_AGREGAR = {
  titulo:            "Agregar Mantenimiento",
  labelFechaHora:    "Fecha y Hora",
  labelCreadoPor:    "Creado por",
  labelTitulo:       "Título del ticket",
  placeholderTitulo: "Busca el ticket por nombre, serie, tipo…",
  labelEquipo:       "Equipo",
  placeholderEquipo: "Busca por nombre, serie, tipo…",
  labelTarea:        "Tarea",
  placeholderTarea:  "Busca o selecciona una tarea…",
  labelDescripcion:  "Descripción del problema *",
  placeholderDesc:   "Describe por qué el equipo requiere mantenimiento",
  labelEstado:       "Estado",
  btnCancelar:       "Cancelar",
  btnAceptar:        "Aceptar",
};

/**
 * Opciones disponibles para cambiar el estado de un ticket desde el modal de edición.
 * Al crear un ticket siempre inicia en FUERA_DE_SERVICIO, por lo que este selector
 * solo aparece en modo edición.
 */
export const OPCIONES_ESTADO_TICKET = [
  { label: "Fuera de servicio", value: "fuera_de_servicio" },
  { label: "En mantenimiento",  value: "en_mantenimiento"  },
];

/** Textos del modal de detalle de un ticket existente. */
export const TEXTOS_MODAL_DETALLE = {
  titulo:         "Detalle del Ticket",
  btnModificar:   "Modificar Ticket",
  btnCancelar:    "Cancelar Ticket",
  campoTicketId:  "TicketID",
  campoTitulo:    "Título",
  campoEquipo:    "Equipo",
  campoEstado:    "Estado",
  campoDesc:      "Descripción",
  campoCreadoPor: "Creado por",
  campoFechaC:    "Fecha creación",
};

/**
 * Pares [clave, etiqueta] para mostrar el detalle del equipo
 * seleccionado dentro del modal de agregar mantenimiento.
 */
export const LABELS_EQUIPO_DETALLE = [
  ["serie",         "Serie"],
  ["tipo",          "Tipo"],
  ["marca",         "Marca"],
  ["ubicacion",     "Ubicación"],
  ["funcionEquipo", "Función"],
];

/**
 * Tareas predefinidas disponibles para asignar a un ticket.
 * TODO: reemplazar por llamada al módulo de Tareas cuando esté disponible.
 */
export const TAREAS_DEMO = [
  { label: "Cambio de aceite y filtros (500 hrs)",     value: "tarea-001" },
  { label: "Limpieza profunda y calibración",           value: "tarea-002" },
  { label: "Inspección estructural completa",           value: "tarea-003" },
  { label: "Sustitución de rodamientos desgastados",   value: "tarea-004" },
  { label: "Instalación de actualización de software", value: "tarea-005" },
  { label: "Diagnóstico de vibración y ruido",         value: "tarea-006" },
  { label: "Revisión general de seguridad",            value: "tarea-007" },
  { label: "Mantenimiento preventivo anual",           value: "tarea-008" },
];

/** Mensajes de error para los campos del formulario de mantenimiento. */
export const ERRORES_FORM = {
  titulo:      "El título es requerido",
  descripcion: "La descripción es requerida",
  equipoId:    "Debe seleccionar un equipo",
  tareaId:     "Debe seleccionar una tarea",
};
