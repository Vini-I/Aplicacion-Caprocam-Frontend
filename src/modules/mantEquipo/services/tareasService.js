/**
 * ============================================================
 * SERVICIO: tareasService
 * ============================================================
 *
 * Datos y funciones mock para la gestión de tareas.
 * TODO backend: reemplazar TAREAS_MOCK y las funciones exportadas
 * por llamadas reales al API REST.
 *
 * Funciones:
 * - obtenerTareas() -> Promise<Array>
 * - obtenerTareaPorId(id) -> Promise<Object>
 * - crearTarea(tarea) -> Promise<Object>
 * - actualizarTarea(id, datosActualizados) -> Promise<Object>
 * - eliminarTarea(id) -> Promise<boolean>
 *
 * Ejemplo:
 * const tareas = await tareasService.obtenerTareas();
 */

// ============================================================
// DATOS MOCK
// ============================================================
let TAREAS_MOCK = [
  {
    id: "T001",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    estado: "no_iniciada",           // <-- nuevo
productos: [
  { productoId: 1, nombre: "Alimento Biomar 35%", cantidad: 2 },
  { productoId: 3, nombre: "Cal agrícola", cantidad: 1 },
    ],
  },
  {
    id: "T002",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    estado: "no_iniciada",           // <-- nuevo
productos: [
  { productoId: 1, nombre: "Alimento Biomar 35%", cantidad: 2 },
  { productoId: 3, nombre: "Cal agrícola", cantidad: 1 },
    ],
  },
    {
    id: "T003",
    nombre: "Nuevo de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    estado: "en_ejecucion",           // <-- nuevo
productos: [
  { productoId: 1, nombre: "Alimento Biomar 35%", cantidad: 2 },
  { productoId: 3, nombre: "Cal agrícola", cantidad: 1 },
    ],
  },
  {
    id: "T005",
    nombre: "Reparación de bomba de agua",
    descripcion: "Diagnóstico y reparación de la bomba de agua principal.",
    categoria: "emergencia",
    duracionEstimada: 6.0,
  },
];

/**
 * TAREAS_DEMO: Vista sincronizada de TAREAS_MOCK con los campos
 * value (= id) y label (= nombre) para uso en selectores y búsquedas.
 * Importar desde aquí en todo el módulo en lugar de mantEquipoMensajes.
 */
export const TAREAS_DEMO = TAREAS_MOCK.map((t) => ({
  ...t,
  value: t.id,
  label: t.nombre,
}));

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================
// EXPORTACIÓN DE FUNCIONES
// ============================================================
export const obtenerTareas = async () => {
  await delay(300);
  return [...TAREAS_MOCK];
};

export const obtenerTareaPorId = async (id) => {
  await delay(200);
  const tarea = TAREAS_MOCK.find((t) => t.id === id);
  if (!tarea) throw new Error("Tarea no encontrada");
  return { ...tarea };
};

export const crearTarea = async (tarea) => {
  await delay(500);
  const nuevaTarea = {
    id: `T${String(TAREAS_MOCK.length + 1).padStart(3, "0")}`,
    ...tarea,
  };
  TAREAS_MOCK = [...TAREAS_MOCK, nuevaTarea];
  return { ...nuevaTarea };
};

export const actualizarTarea = async (id, datosActualizados) => {
  await delay(500);
  const index = TAREAS_MOCK.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Tarea no encontrada");
  TAREAS_MOCK[index] = { ...TAREAS_MOCK[index], ...datosActualizados };
  return { ...TAREAS_MOCK[index] };
};

export const eliminarTarea = async (id) => {
  await delay(500);
  const index = TAREAS_MOCK.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Tarea no encontrada");
  TAREAS_MOCK = TAREAS_MOCK.filter((t) => t.id !== id);
  return true;
};