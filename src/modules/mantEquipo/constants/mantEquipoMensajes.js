/**
 * ============================================================
 * CONSTANTES: mantEquipoMensajes
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Centralizar los textos estáticos, etiquetas, opciones de selectores y mapeos de enum frontend ↔ backend.
 *
 * @dependencies - tokenStorage.js (login/utils/tokenStorage.js)
 * @validations  - Mapeo bidireccional estricto de estados de ticket y tipo de personal para la API.
 * @navigation   - Ninguna
 */



// ─── Textos de la pantalla principal ──────────────────────────────────────────
export const TEXTOS_PANTALLA = {
  sinTickets: "No se encuentran equipos.",
  placeholderBuscar: "Buscar ticket, equipo, tarea, descripción...",
  btnAgregarMant: "Registrar Ticket",
  btnAgregarTarea: "Ver Tareas",
};

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
  labelTipoPersonal:   "Tipo de Personal",
  btnAceptar:          "Registrar Ticket",
  btnCrear:            "Crear Ticket",
  btnActualizar:       "Actualizar Ticket",
  btnEliminar:         "Eliminar Ticket",
  tituloEdicion:       "Modificar Mantenimiento",
  errorValidacion:     "Revisa los campos obligatorios marcados con * antes de guardar.",
  errorTareasPendientes: "No se puede terminar el ticket si existen tareas pendientes.",
  errorTituloCorto:    "El título debe tener más de 10 caracteres.",
  errorTituloMax:      "El título alcanzó el máximo de 100 caracteres.",
  errorDescripcionCorta: "La descripción debe tener más de 20 caracteres.",
  errorDescripcionMax: "La descripción alcanzó el máximo de 400 caracteres.",
  hintCostoManoObra:   "Ingresa 0 si no aplica, o un monto de al menos ₡1000.",
  errorCrearTicket:    "No se pudo crear el ticket. Verifica la conexión e intenta de nuevo.",
  errorEditarTicket:   (id) => `No se pudo editar el ticket #${id}. Verifica la conexión e intenta de nuevo.`,
  errorEliminarTicket: (id) => `No se pudo eliminar el ticket #${id}. Verifica la conexión e intenta de nuevo.`,
  
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

// ─── Alertas y notificaciones dinámicas ────────────────────────────────────────
export const ALERTAS_NOTIFICACIONES = {
  exitoCrearTicket:    (id) => `Ticket ${id} creado con éxito.`,
  exitoEditarTicket:   (id) => `Ticket ${id} modificado correctamente.`,
  exitoEliminarTicket: (id) => `El ticket ${id} ha sido eliminado correctamente del sistema.`,
  alertaStockInsumo:   (nombre, stockMax) => `No hay más stock disponible para "${nombre}". (Stock máximo en inventario: ${stockMax})`,
};

// ─── Mensajes de error de carga y conexión ─────────────────────────────────────
export const MENSAJES_ERROR_CARGA = {
  errorCargarTicket:   "No se pudo cargar el ticket. Verifica la conexión e intenta de nuevo.",
  errorEliminarTicket: "No se pudo eliminar el ticket. Verifica la conexión e intenta de nuevo.",
  ticketNoEncontrado:  "Ticket no encontrado.",
};

// ─── Textos de la pantalla de Detalle ─────────────────────────────────────────
export const TEXTOS_DETALLE = {
  tituloGeneral:        "IDENTIFICACIÓN Y GENERAL",
  tituloEquipo:         "DETALLES DEL EQUIPO",
  tituloTareas:         "TAREAS ASIGNADAS",
  tituloCostos:         "COSTOS DEL TICKET",
  subtituloProductos:   "Productos utilizados",
  sinProductos:         "Ninguno",
  sinTareas:            "Ninguna tarea asignada.",
  labelManoObra:        "Costo de Mano de Obra:",
  labelCostoTotal:      "Costo Total:",
  labelTipoPersonal:    "Tipo de Personal Asignado",
  modalEliminarTitulo:  "ticket de mantenimiento",
  modalEliminarConfirm: "Sí, eliminar",
  modalEliminarCancel:  "Cancelar",
  btnRegresarLista:     "Regresar a lista",
  badgeRealizada:       "Realizada",
  badgePendiente:       "Pendiente",
  catPreventivo:        "Preventivo",
  catCorrectivo:        "Correctivo",
  labelTrabajadorExterno: "Trabajador Externo",
  labelTrabajadorInterno: "Trabajador Interno",
  labelCategoriaPrefix:   "Categoría: ",
  labelDuracionEstimada:  (hrs) => `Duración estimada: ${hrs} hrs`,
  labelProductoFallback:  (id) => `Producto ${id}`,
  labelTicketHeader:      (id) => `TICKET #${id}`,
};

// ─── Mensajes internos de la capa de servicio ────────────────────────────────
export const MENSAJES_SERVICIOS = {
  itemInvalido:          "adaptBackendTicket: item inválido",
  respuestaNoArreglo:    "obtenerTickets: la respuesta del servidor no es un arreglo",
  idInvalido:            (id) => `obtenerTicketPorId: ID inválido recibido: "${id}"`,
  ticketNoEncontradoId:  (id) => `obtenerTicketPorId: ticket con ID "${id}" no encontrado`,
  equipoObligatorio:     "buildPayload: equipoId es obligatorio",
  tituloObligatorio:     "buildPayload: titulo es obligatorio",
  sinIdActualizar:       "actualizarTicket: no se puede determinar el ID del ticket",
  idInvalidoEliminar:    "eliminarTicket: ID inválido",
};
