/**
 * CONSTANTES: tareasMensajes
 * Ruta: src/modules/mantEquipo/constants/tareasMensajes.js
 *
 * Centraliza todos los textos visibles al usuario del módulo de tareas.
 * Facilita la futura internacionalización (i18n) sin tocar los componentes.
 */

/** Textos de la pantalla principal (toolbar, tabla vacía). */
export const TEXTOS_PANTALLA = {
  titulo:           "Gestión de Tareas",
  sinTareas:        "No se encontraron tareas.",
  placeholderBuscar: "Buscar tarea por nombre, descripción o categoría…",
  btnAgregarTarea:  "Agregar Tarea",
};

/** Cabeceras de la tabla de tareas. */
export const HEADERS_TABLA = [
  "ID",
  "Nombre",
  "Descripción",
  "Categoría",
  "Duración estimada (hrs)",
  "Acciones",
];

/** Opciones de categoría para el formulario. */
export const OPCIONES_CATEGORIA = [
  { label: "Preventivo", value: "preventivo" },
  { label: "Correctivo", value: "correctivo" },
  { label: "Predictivo", value: "predictivo" },
  { label: "Emergencia", value: "emergencia" },
];

/** Textos del modal para crear o editar una tarea. */
export const TEXTOS_MODAL_TAREA = {
  tituloCrear:   "Crear nueva tarea",
  tituloEditar:  "Editar tarea",
  labelNombre:   "Nombre de la tarea *",
  placeholderNombre: "Ej. Cambio de aceite",
  labelDescripcion: "Descripción *",
  placeholderDesc:   "Describe la tarea en detalle",
  labelCategoria: "Categoría *",
  labelDuracion:  "Duración estimada (horas) *",
  placeholderDuracion: "Ej. 2.5",
  btnCancelar:   "Cancelar",
  btnGuardar:    "Guardar",
};

/** Mensajes de validación del formulario. */
export const ERRORES_FORM = {
  nombre:      "El nombre es requerido",
  descripcion: "La descripción es requerida",
  categoria:   "Debe seleccionar una categoría",
  duracion:    "Debe ingresar una duración válida (mayor a 0)",
};