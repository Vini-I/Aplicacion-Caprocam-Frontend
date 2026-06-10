/**
 * ============================================================
 * WORKER SERVICE
 * ============================================================
 *
 * Este servicio maneja la logica para obtener datos de
 * trabajadores/colaboradores.
 *
 * ESTRUCTURA:
 * - Actualmente usa datos MOCK (falsos) locales
 * - Cuando tengas un backend, reemplaza el contenido con
 *   llamadas a tu API usando fetch() o axios
 *
 * El patrón es: siempre exportar las mismas funciones
 * para que el resto de la app no sepa si los datos vienen
 * de datos mock o de una API real.
 *
 * ============================================================
 * FLUJO FUTURO CON API
 * ============================================================
 *
 * En lugar de retornar datos directamente, haríamos:
 *
 * export const getWorkers = async () => {
 *   try {
 *     const response = await fetch('https://tuapi.com/workers');
 *     const data = await response.json();
 *     return data;
 *   } catch (error) {
 *     throw error;
 *   }
 * };
 *
 * ============================================================
 */

/**
 * DATOS MOCK - Trabajadores de ejemplo
 *
 * Estructura esperada:
 * {
 *   id: string                    - Identificador único
 *   initials: string              - Iniciales del nombre (para avatar)
 *   name: string                  - Nombre completo
 *   role: string                  - Puesto/rol del trabajador
 * }
 */
const MOCK_WORKERS = [
  {
    id: '1',
    initials: 'MV',
    name: 'Marco Vazques',
    role: 'Supervisor de estanques',
  },
  {
    id: '2',
    initials: 'RC',
    name: 'Rodolfo Chaves',
    role: 'Operaria de alimentación',
  },
  {
    id: '3',
    initials: 'LR',
    name: 'Leandro Rojas',
    role: 'Técnico de calidad',
  },
  {
    id: '4',
    initials: 'GA',
    name: 'Gloriana Alfaro',
    role: 'Operaria de estanques',
  },
  {
    id: '5',
    initials: 'DM',
    name: 'Dennis Marchena',
    role: 'Operaria de estanques',
  },
];

/**
 * getWorkers()
 *
 * Retorna la lista de trabajadores disponibles.
 *
 * Ahora: Retorna datos mock (simulados)
 * Futuro: Haría una llamada a tu API backend
 *
 * @returns {Promise<Array>} Lista de trabajadores
 *
 * Ejemplo de uso:
 * const workers = await getWorkers();
 * console.log(workers);
 * // [
 * //   { id: '1', name: 'Carlos Mendoza', ... },
 * //   { id: '2', name: 'Rosa Jiménez', ... },
 * // ]
 */
export const getWorkers = async () => {
  // Simulamos una pequeña demora de red (como si fuera una API real)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_WORKERS);
    }, 500); // 500ms de demora simulated
  });
};

/**
 * getWorkerById(id)
 *
 * Obtiene un trabajador específico por su ID.
 *
 * @param {string} id - El ID del trabajador a buscar
 * @returns {Promise<Object|null>} El trabajador o null si no existe
 *
 * Ejemplo de uso:
 * const worker = await getWorkerById('1');
 * console.log(worker.name); // "Carlos Mendoza"
 */
export const getWorkerById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const worker = MOCK_WORKERS.find((w) => w.id === id);
      resolve(worker || null);
    }, 300);
  });
};
