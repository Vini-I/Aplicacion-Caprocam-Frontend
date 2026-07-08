/**
 * SERVICE: tareasService
 * Ruta: src/modules/mantEquipo/services/tareasService.js
 *
 * Datos y funciones mock para la gestión de tareas.
 * TODO backend: reemplazar TAREAS_MOCK y las funciones exportadas por llamadas reales al API REST.
 */

/** Datos mock de tareas. */
let TAREAS_MOCK = [
  {
    id: "T001",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
  },
  {
    id: "T002",
    nombre: "Limpieza de intercambiadores de calor",
    descripcion: "Limpieza profunda de los intercambiadores de calor de los sistemas de refrigeración.",
    categoria: "correctivo",
    duracionEstimada: 4.0,
  },
  {
    id: "T003",
    nombre: "Calibración de sensores de pH",
    descripcion: "Calibración de los sensores de pH en los estanques de cultivo.",
    categoria: "predictivo",
    duracionEstimada: 1.0,
  },
  {
    id: "T004",
    nombre: "Revisión de sistema de alimentación automática",
    descripcion: "Inspección y ajuste de los alimentadores automáticos.",
    categoria: "preventivo",
    duracionEstimada: 3.0,
  },
  {
    id: "T005",
    nombre: "Reparación de bomba de agua",
    descripcion: "Diagnóstico y reparación de la bomba de agua principal.",
    categoria: "emergencia",
    duracionEstimada: 6.0,
  },
];

/** Simula un retardo de red. */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Obtiene todas las tareas.
 * @returns {Promise<Array>} Lista de tareas.
 */
export const obtenerTareas = async () => {
  await delay(300);
  return [...TAREAS_MOCK];
};

/**
 * Obtiene una tarea por su ID.
 * @param {string} id - ID de la tarea.
 * @returns {Promise<Object>} Tarea encontrada.
 * @throws {Error} Si no se encuentra la tarea.
 */
export const obtenerTareaPorId = async (id) => {
  await delay(200);
  const tarea = TAREAS_MOCK.find((t) => t.id === id);
  if (!tarea) throw new Error("Tarea no encontrada");
  return { ...tarea };
};

/**
 * Crea una nueva tarea.
 * @param {Object} tarea - Datos de la tarea (nombre, descripcion, categoria, duracionEstimada).
 * @returns {Promise<Object>} Tarea creada con ID asignado.
 */
export const crearTarea = async (tarea) => {
  await delay(500);
  const nuevaTarea = {
    id: `T${String(TAREAS_MOCK.length + 1).padStart(3, "0")}`,
    ...tarea,
  };
  TAREAS_MOCK = [...TAREAS_MOCK, nuevaTarea];
  return { ...nuevaTarea };
};

/**
 * Actualiza una tarea existente.
 * @param {string} id - ID de la tarea a actualizar.
 * @param {Object} datosActualizados - Campos a modificar.
 * @returns {Promise<Object>} Tarea actualizada.
 * @throws {Error} Si no se encuentra la tarea.
 */
export const actualizarTarea = async (id, datosActualizados) => {
  await delay(500);
  const index = TAREAS_MOCK.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Tarea no encontrada");
  TAREAS_MOCK[index] = { ...TAREAS_MOCK[index], ...datosActualizados };
  return { ...TAREAS_MOCK[index] };
};

/**
 * Elimina una tarea por su ID.
 * @param {string} id - ID de la tarea a eliminar.
 * @returns {Promise<boolean>} true si se eliminó correctamente.
 * @throws {Error} Si no se encuentra la tarea.
 */
export const eliminarTarea = async (id) => {
  await delay(500);
  const index = TAREAS_MOCK.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Tarea no encontrada");
  TAREAS_MOCK = TAREAS_MOCK.filter((t) => t.id !== id);
  return true;
};