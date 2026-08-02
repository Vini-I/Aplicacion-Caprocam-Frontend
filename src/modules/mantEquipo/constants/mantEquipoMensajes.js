/**
 * ============================================================
 * CONSTANTES: mantEquipoMensajes
 * ============================================================
 * 
 * Responsabilidad: Centraliza los textos estáticos, etiquetas de campos,
 * cabeceras de tabla, opciones para selectores y los mapeos de estados
 * del módulo de Mantenimiento de Equipos.
 * 
 * Incluye:
 * - Textos UI (labels, placeholders, mensajes de validación)
 * - Listas de opciones para SelectorPills y comboboxes
 * - Mapeos frontend ↔ backend para estado del ticket y tipo de personal
 * - Constantes de estado del ticket
 * 
 * Dependencias:
 * - tokenStorage (solo para obtener el usuario de sesión)
 */



// ─── Textos de la pantalla principal ──────────────────────────────────────────
export const TEXTOS_PANTALLA = {
  sinTickets: "No se encuentran equipos.",
  placeholderBuscar: "Buscar ticket, equipo, tarea, descripción...",
  btnAgregarMant: "Registrar Ticket",
  btnAgregarTarea: "Ver Tareas",
};

// ─── Cabeceras de tabla ────────────────────────────────────────────────────────
export const HEADERS_TABLA = [
  "Ticket ID", "Fecha creación", "Estado", "Título", "Descripción", "Creado por",
];

// ─── Textos del formulario Agregar / Editar ────────────────────────────────────
export const TEXTOS_MODAL_AGREGAR = {
  titulo:              "Agregar Mantenimiento",
  labelFechaHora:      "Fecha de creación",
  labelCreadoPor:      "Creado por",
  labelTitulo:         "Título Ticket*",
  placeholderTitulo:   "Ej: Revisión mensual BOSCH",
  labelEquipo:         "Equipo *",
  placeholderEquipo:   "Seleccione un equipo...",
  labelTarea:          "Tareas *",
  placeholderTarea:    "Busca o selecciona una tarea...",
  labelEstadoEquipo:   "Estado del equipo",
  labelDescripcion:    "Descripción *",
  placeholderDesc:     "Ej: Cambio de aceite y revisión de frenos",
  labelEstado:         "Estado del ticket",
  btnAceptar:          "Registrar Ticket",
  btnActualizar:       "Actualizar Ticket",
  btnEliminar:         "Eliminar Ticket",
  tituloEdicion:       "Modificar Mantenimiento",
  errorValidacion:     "Revisa los campos obligatorios marcados con * antes de guardar.",
  
};

// ─── Labels del detalle de equipo ─────────────────────────────────────────────
export const LABELS_EQUIPO_DETALLE = [
  ["codigo",       "Código"],
  ["tipo",         "Tipo"],
  ["descripcion",  "Descripción"],
  ["ubicacion",    "Ubicación"],
  ["estado",       "Estado actual"],
  ["funcionEquipo","Función"],
  ["horasUso",     "Horas de uso actual"],
];

// ─── Estados del ticket (valores frontend) ────────────────────────────────────
export const ESTADOS_TICKET = {
  EN_ESPERA:        'en_espera',
  EN_MANTENIMIENTO: 'en_mantenimiento',
  TERMINADO:        'Terminado',
};

// ─── Opciones para SelectorPills — lista de estados del ticket ─────────────────
export const LISTA_ESTADOS_TICKET = [
  { label: "En espera",        value: ESTADOS_TICKET.EN_ESPERA        },
  { label: "En mantenimiento", value: ESTADOS_TICKET.EN_MANTENIMIENTO },
  { label: "Terminado",        value: ESTADOS_TICKET.TERMINADO        },
];

// ─── Opciones para SelectorPills — tipo de personal ───────────────────────────
export const LISTA_TIPOS_PERSONAL = [
  { label: "Trabajador Interno", value: "interno" },
  { label: "Trabajador Externo", value: "externo" },
];

// ─── Opciones para SelectorPills — estado del equipo ──────────────────────────
export const LISTA_ESTADOS_EQUIPO = [
  { label: "Activo",           value: "activo"        },
  { label: "Inactivo",         value: "inactivo"      },
  { label: "En mantenimiento", value: "mantenimiento" },
];

// ─── Mapeo de estados ticket: backend → frontend ───────────────────────────────
export const ESTADO_BACKEND_A_FRONTEND = {
  'En espera':        ESTADOS_TICKET.EN_ESPERA,
  'En mantenimiento': ESTADOS_TICKET.EN_MANTENIMIENTO,
  'Terminado':        ESTADOS_TICKET.TERMINADO,
};

// ─── Mapeo de estados ticket: frontend → backend ───────────────────────────────
export const ESTADO_FRONTEND_A_BACKEND = {
  [ESTADOS_TICKET.EN_ESPERA]:        'En espera',
  [ESTADOS_TICKET.EN_MANTENIMIENTO]: 'En mantenimiento',
  [ESTADOS_TICKET.TERMINADO]:        'Terminado',
};

// ─── Mapeo de tipo de personal: frontend → backend ────────────────────────────
export const TIPO_PERSONAL_A_BACKEND = {
  'interno': 'TrabajadorInterno',
  'externo': 'TrabajadorExterno',
};

// ─── Mapeo de tipo de personal: backend → frontend ────────────────────────────
export const TIPO_PERSONAL_A_FRONTEND = {
  'TrabajadorInterno': 'interno',
  'TrabajadorExterno': 'externo',
};