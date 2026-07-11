/**
 * ============================================================
 * SERVICIO: colaboradoresService
 * ============================================================
 *
 * Servicio con operaciones CRUD y estadísticas para colaboradores.
 * Actualmente usa datos mock, pero puede reemplazarse por llamadas a API.
 *
 * Funciones:
 * - getColaboradores(filtros) -> Promise<Array>
 * - getColaboradorById(id) -> Promise<Object>
 * - createColaborador(data) -> Promise<Object>
 * - updateColaborador(id, data) -> Promise<Object>
 * - deleteColaborador(id) -> Promise<boolean>
 * - getEstadisticasColaborador(colaboradorId) -> Promise<Object>
 * - getTrabajadoresByOwner(ownerId) -> Promise<Array>
 *
 * Ejemplo:
 * const colaboradores = await colaboradoresService.getColaboradores({ rol: 'external_worker' });
 */

// ============================================================
// IMPORTS
// ============================================================
// (no hay dependencias externas)

// ============================================================
// DATOS MOCK
// ============================================================
let colaboradoresMock = [
  {
    id: "1",
    nombre: "Carlos Rodríguez",
    cedula: "123456789",
    telefono: "88881111",
    email: "carlos@camprocam.com",
    rol: "camprocam_worker",
    fincaId: "finca1",
    activo: true,
    externalOwnerId: null,
  },
  {
    id: "2",
    nombre: "María Fernández",
    cedula: "987654321",
    telefono: "88882222",
    email: "maria@camprocam.com",
    rol: "camprocam_worker",
    fincaId: "finca2",
    activo: true,
    externalOwnerId: null,
  },
    {
    id: "4",
    nombre: "María Fernández",
    cedula: "987654321",
    telefono: "88882222",
    email: "maria@camprocam.com",
    rol: "camprocam_worker",
    fincaId: "finca2",
    activo: true,
    externalOwnerId: null,
  },
    {
    id: "5",
    nombre: "María Fernández",
    cedula: "987654321",
    telefono: "88882222",
    email: "maria@camprocam.com",
    rol: "camprocam_worker",
    fincaId: "finca2",
    activo: true,
    externalOwnerId: null,
  },
  {
    id: "3",
    nombre: "Dueño Externo S.A.",
    cedula: "301234567",
    telefono: "88883333",
    email: "dueno@fincaexterna.com",
    rol: "external_owner",
    fincaId: "finca3",
    activo: true,
    externalOwnerId: null,
  },
  {
    id: "4",
    nombre: "Juan Pérez",
    cedula: "112233445",
    telefono: "88884444",
    email: "juan@fincaexterna.com",
    rol: "external_worker",
    fincaId: "finca3",
    activo: true,
    externalOwnerId: "3",
  },
  {
    id: "5",
    nombre: "Ana Solano",
    cedula: "556677889",
    telefono: "88885555",
    email: "ana@fincaexterna.com",
    rol: "external_worker",
    fincaId: "finca3",
    activo: true,
    externalOwnerId: "3",
  },
];

const estadisticasMock = {
  "1": {
    alimentaciones: 24,
    estanquesCreados: 3,
    siembrasRegistradas: 5,
    ultimaActividad: "2025-03-15",
  },
  "2": {
    alimentaciones: 12,
    estanquesCreados: 1,
    siembrasRegistradas: 2,
    ultimaActividad: "2025-03-14",
  },
  "4": {
    alimentaciones: 8,
    estanquesCreados: 0,
    siembrasRegistradas: 1,
    ultimaActividad: "2025-03-16",
  },
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================
// EXPORTACIÓN DE FUNCIONES
// ============================================================
export const colaboradoresService = {
  async getColaboradores(filtros = {}) {
    await delay(500);
    let resultados = [...colaboradoresMock];
    if (filtros.fincaId) {
      resultados = resultados.filter((c) => c.fincaId === filtros.fincaId);
    }
    if (filtros.rol) {
      resultados = resultados.filter((c) => c.rol === filtros.rol);
    }
    if (filtros.activo !== undefined) {
      resultados = resultados.filter((c) => c.activo === filtros.activo);
    }
    return resultados;
  },

  async getColaboradorById(id) {
    await delay(300);
    const colaborador = colaboradoresMock.find((c) => c.id === id);
    if (!colaborador) throw new Error("Colaborador no encontrado");
    return { ...colaborador };
  },

  async createColaborador(data) {
    await delay(500);
    const newId = String(Date.now());
    const nuevoColaborador = {
      id: newId,
      ...data,
      activo: true,
    };
    colaboradoresMock.push(nuevoColaborador);
    return { ...nuevoColaborador };
  },

  async updateColaborador(id, data) {
    await delay(500);
    const index = colaboradoresMock.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Colaborador no encontrado");
    colaboradoresMock[index] = { ...colaboradoresMock[index], ...data };
    return { ...colaboradoresMock[index] };
  },

  async deleteColaborador(id) {
    await delay(500);
    const index = colaboradoresMock.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Colaborador no encontrado");
    colaboradoresMock.splice(index, 1);
    return true;
  },

  async getEstadisticasColaborador(colaboradorId) {
    await delay(400);
    const stats = estadisticasMock[colaboradorId] || {
      alimentaciones: 0,
      estanquesCreados: 0,
      siembrasRegistradas: 0,
      ultimaActividad: null,
    };
    return stats;
  },

  async getTrabajadoresByOwner(ownerId) {
    await delay(300);
    return colaboradoresMock.filter(
      (c) => c.externalOwnerId === ownerId && c.rol === "external_worker" && c.activo
    );
  },
};