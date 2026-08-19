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
  "Acciones",
];

export const OPCIONES_CATEGORIA = [
  { label: "Preventivo", value: "preventivo" },
  { label: "Correctivo", value: "correctivo" },
  { label: "Predictivo", value: "predictivo" },
  // Emergencia removida por decisión de producto
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

