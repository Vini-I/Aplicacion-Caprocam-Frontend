/**
 * ============================================================
 * CONSTANTES: tareasMensajes
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos / Tareas
 *
 * RESPONSABILIDAD:
 * - Centralizar los textos visibles al usuario, opciones de categoría y mensajes del catálogo de tareas.
 *
 * @dependencies - Ninguna
 * @validations  - Estándar de claves y etiquetas de categoría/estado.
 * @navigation   - Ninguna
 */

// ============================================================
// EXPORTACIÓN DE CONSTANTES
// ============================================================
export const TEXTOS_PANTALLA = {
  titulo: "Gestión de Tareas",
  sinTareas: "No se encontraron tareas.",
  placeholderBuscar: "Buscar tarea por nombre, descripción o categoría…",
  btnAgregarTarea: "Agregar Tarea",
};

export const HEADERS_TABLA = [
  "ID",
  "Nombre",
  "Descripción",
  "Categoría",
  "Duración estimada (hrs)",
  "Estado",        // <-- añadido
  "Acciones",
];

export const OPCIONES_CATEGORIA = [
  { label: "Preventivo", value: "preventivo" },
  { label: "Correctivo", value: "correctivo" },
  { label: "Predictivo", value: "predictivo" },
  { label: "Emergencia", value: "emergencia" },
];

export const TEXTOS_MODAL_TAREA = {
  tituloCrear: "Crear nueva tarea",
  tituloEditar: "Editar tarea",
  labelNombre: "Nombre de la tarea",
  placeholderNombre: "Ej. Cambio de aceite",
  labelDescripcion: "Descripción",
  placeholderDesc: "Describe la tarea en detalle",
  labelCategoria: "Categoría",
  labelDuracion: "Duración estimada (horas)",
  placeholderDuracion: "Ej. 2.5",
  btnCancelar: "Cancelar",
  btnGuardar: "Guardar",
};

export const ERRORES_FORM = {
  nombre: "El nombre es requerido",
  descripcion: "La descripción es requerida",
  categoria: "Debe seleccionar una categoría",
  duracion: "Debe ingresar una duración válida (mayor a 0)",
};

export const OPCIONES_ESTADO = [
  { label: "No iniciada", value: "no_iniciada" },
  { label: "En ejecución", value: "en_ejecucion" },
  { label: "Finalizada", value: "finalizada" },
];

export const TEXTOS_MODAL_PRODUCTO = {
  titulo: "Agregar producto",
  labelProducto: "Producto *",
  placeholderProducto: "Seleccione un producto",
  labelCantidad: "Cantidad *",
  placeholderCantidad: "Ej: 2",
  btnAgregar: "Agregar",
  btnCancelar: "Cancelar",
  sinProductos: "No hay productos agregados.",
  errorCantidad: "La cantidad debe ser mayor a 0",
  errorProducto: "Debe seleccionar un producto",
};
