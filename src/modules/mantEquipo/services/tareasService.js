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
    productos: [                     // <-- nuevo
      { productoId: 1, cantidad: 2 },
      { productoId: 3, cantidad: 1 },
    ],
  },
    {
    id: "T001",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    estado: "no_iniciada",           // <-- nuevo
    productos: [                     // <-- nuevo
      { productoId: 1, cantidad: 2 },
      { productoId: 3, cantidad: 1 },
    ],
  },
    {
    id: "T001",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    estado: "no_iniciada",           // <-- nuevo
    productos: [                     // <-- nuevo
      { productoId: 1, cantidad: 2 },
      { productoId: 3, cantidad: 1 },
    ],
  },
    {
    id: "T001",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    estado: "no_iniciada",           // <-- nuevo
    productos: [                     // <-- nuevo
      { productoId: 1, cantidad: 2 },
      { productoId: 3, cantidad: 1 },
    ],
  },
    {
    id: "T001",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    estado: "no_iniciada",           // <-- nuevo
    productos: [                     // <-- nuevo
      { productoId: 1, cantidad: 2 },
      { productoId: 3, cantidad: 1 },
    ],
  },
    {
    id: "T001",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    estado: "no_iniciada",           // <-- nuevo
    productos: [                     // <-- nuevo
      { productoId: 1, cantidad: 2 },
      { productoId: 3, cantidad: 1 },
    ],
  },
    {
    id: "T001",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    estado: "no_iniciada",           // <-- nuevo
    productos: [                     // <-- nuevo
      { productoId: 1, cantidad: 2 },
      { productoId: 3, cantidad: 1 },
    ],
  },
    {
    id: "T001",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    estado: "no_iniciada",           // <-- nuevo
    productos: [                     // <-- nuevo
      { productoId: 1, cantidad: 2 },
      { productoId: 3, cantidad: 1 },
    ],
  },
    {
    id: "T001",
    nombre: "Cambio de aceite y filtros",
    descripcion: "Realizar cambio de aceite y filtros de los motores de bombeo.",
    categoria: "preventivo",
    duracionEstimada: 2.5,
    estado: "no_iniciada",           // <-- nuevo
    productos: [                     // <-- nuevo
      { productoId: 1, cantidad: 2 },
      { productoId: 3, cantidad: 1 },
    ],
  },
];

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