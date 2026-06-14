// src/modules/colaboradores/services/colaboradoresService.js
/**
 * Servicio con operaciones CRUD y estadísticas para colaboradores.
 * Actualmente usa datos mock, pero puede reemplazarse por llamadas a API.
 */

// Datos mock de colaboradores
// src/modules/colaboradores/services/colaboradoresService.js
// Agrega externalOwnerId a los colaboradores existentes
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

// Datos mock de estadísticas (alimentación, estanques, siembras) 
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

// Simula retardo de red
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const colaboradoresService = {
  // Obtener todos los colaboradores (con filtro opcional por fincaId y rol)
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

  // Obtener un colaborador por ID
  async getColaboradorById(id) {
    await delay(300);
    const colaborador = colaboradoresMock.find((c) => c.id === id);
    if (!colaborador) throw new Error("Colaborador no encontrado");
    return { ...colaborador };
  },

  // Crear nuevo colaborador
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

  // Actualizar colaborador existente
  async updateColaborador(id, data) {
    await delay(500);
    const index = colaboradoresMock.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Colaborador no encontrado");
    colaboradoresMock[index] = { ...colaboradoresMock[index], ...data };
    return { ...colaboradoresMock[index] };
  },

  // Eliminar (desactivar) colaborador
// src/modules/colaboradores/services/colaboradoresService.js
// Reemplaza el método deleteColaborador:

async deleteColaborador(id) {
  await delay(500);
  const index = colaboradoresMock.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Colaborador no encontrado");
  // Eliminar completamente del array
  colaboradoresMock.splice(index, 1);
  return true;
},


  // Obtener estadísticas de un colaborador
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

  // Agrega este método al servicio
async getTrabajadoresByOwner(ownerId) {
  await delay(300);
  return colaboradoresMock.filter((c) => c.externalOwnerId === ownerId && c.rol === "external_worker" && c.activo);
},
};