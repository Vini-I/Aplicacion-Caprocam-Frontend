/**
 * ============================================================
 * SERVICIO: equiposService
 * ============================================================
 *
 * Servicio con operaciones CRUD para equipos.
 * Actualmente usa datos mock, pero puede reemplazarse por llamadas a API.
 *
 * Funciones:
 * - getEquipos(filtros) -> Promise<Array>
 * - getEquipoById(id) -> Promise<Object>
 * - createEquipo(data) -> Promise<Object>
 * - updateEquipo(id, data) -> Promise<Object>
 * - deleteEquipo(id) -> Promise<boolean>
 * - toggleEquipoEstado(id) -> Promise<Object>
 * - getEquiposProximosMantenimiento() -> Promise<Array>
 *
 * Ejemplo:
 * const equipos = await equiposService.getEquipos({ tipo: 'aireacion' });
 * ============================================================
 */

// ============================================================
// IMPORTS
// ============================================================
// (no hay dependencias externas)

// ============================================================
// CONSTANTES
// ============================================================

// Tipos de equipo con sus códigos de prefijo
export const TIPOS_EQUIPO = [
  { label: "Aireación", value: "aireacion", prefijo: "20" },
  { label: "Bombeo", value: "bombeo", prefijo: "10" },
  { label: "Alimentación", value: "alimentacion", prefijo: "30" },
  { label: "Monitoreo", value: "monitoreo", prefijo: "40" },
  { label: "Mantenimiento", value: "mantenimiento", prefijo: "50" },
  { label: "Otro", value: "otro", prefijo: "99" },
];

// Subcategorías por tipo
export const SUBCATEGORIAS = {
  aireacion: [
    { label: "Aireador de paletas", value: "paletas" },
    { label: "Aireador de disco", value: "disco" },
    { label: "Aireador de fondo", value: "fondo" },
  ],
  bombeo: [
    { label: "Motor Diesel", value: "diesel" },
    { label: "Motor Gasolina", value: "gasolina" },
    { label: "Motor Eléctrico", value: "electrico" },
  ],
  alimentacion: [
    { label: "Alimentador automático", value: "automatico" },
    { label: "Alimentador manual", value: "manual" },
  ],
  monitoreo: [
    { label: "Sensor de pH", value: "ph" },
    { label: "Sensor de oxígeno", value: "oxigeno" },
    { label: "Sensor de temperatura", value: "temperatura" },
  ],
  mantenimiento: [
    { label: "Herramienta eléctrica", value: "electrica" },
    { label: "Herramienta manual", value: "manual" },
  ],
  otro: [
    { label: "Otro equipo", value: "otro" },
  ],
};

// Estanques disponibles para asociar
// Cada objeto debe tener { label, value } para que el Select funcione
const ESTANQUES_DISPONIBLES = [
  { id: "A01", label: "A01 - Estanque A01", finca: "Finca La Esperanza" },
  { id: "A02", label: "A02 - Estanque A02", finca: "Finca La Esperanza" },
  { id: "B01", label: "B01 - Estanque B01", finca: "Finca El Paraíso" },
  { id: "B02", label: "B02 - Estanque B02", finca: "Finca El Paraíso" },
  { id: "P-01", label: "P-01 - Estanque P-01", finca: "Finca Camarón de Occidente" },
  { id: "E-02", label: "E-02 - Estanque E-02", finca: "Finca Camarón del Sur" },
];

// ============================================================
// DATOS MOCK
// ============================================================

let equiposMock = [
  {
    id: "eq-001",
    codigo: "20-001",
    nombre: "Aireador MAKITA",
    descripcion: "Aireador de paletas para oxigenación del estanque principal",
    tipo: "aireacion",
    subcategoria: "paletas",
    marca: "Makita",
    modelo: "MX-2000",
    serie: "9-0050",
    fechaInstalacion: "2022-03-15",
    funcionEquipo: "Oxigenación del estanque principal",
    ubicacion: "Estanque A01",
    estanqueId: "A01",
    estado: "activo", // activo, inactivo, mantenimiento
    encendido: false,
    horasUso: 1247,
    horasMantenimiento: 500,
    ultimoMantenimiento: "2025-01-10",
    registrosEncendido: [
      { inicio: "2025-03-10T08:00:00", fin: "2025-03-10T18:00:00", horas: 10 },
      { inicio: "2025-03-11T08:00:00", fin: "2025-03-11T18:00:00", horas: 10 },
    ],
  },
  {
    id: "eq-002",
    codigo: "10-001",
    nombre: "Bomba FT Industrial",
    descripcion: "Bomba de agua para circulación en estanque 2",
    tipo: "bombeo",
    subcategoria: "diesel",
    marca: "FT Industrial",
    modelo: "FT-3000",
    serie: "9-0024",
    fechaInstalacion: "2021-07-20",
    funcionEquipo: "Bombeo y circulación estanque 2",
    ubicacion: "Estanque A02",
    estanqueId: "A02",
    estado: "activo",
    encendido: true,
    horasUso: 2134,
    horasMantenimiento: 1000,
    ultimoMantenimiento: "2024-11-05",
    registrosEncendido: [
      { inicio: "2025-03-10T06:00:00", fin: "2025-03-10T08:00:00", horas: 2 },
      { inicio: "2025-03-10T12:00:00", fin: "2025-03-10T13:00:00", horas: 1 },
      { inicio: "2025-03-11T06:00:00", fin: "2025-03-11T08:00:00", horas: 2 },
    ],
  },
  {
    id: "eq-003",
    codigo: "20-002",
    nombre: "Aireador Secundario",
    descripcion: "Aireador de disco para estanque 3",
    tipo: "aireacion",
    subcategoria: "disco",
    marca: "Makita",
    modelo: "MX-1500",
    serie: "9-0052",
    fechaInstalacion: "2023-01-10",
    funcionEquipo: "Aireación secundaria estanque 3",
    ubicacion: "Estanque B01",
    estanqueId: "B01",
    estado: "activo",
    encendido: false,
    horasUso: 876,
    horasMantenimiento: 500,
    ultimoMantenimiento: "2024-12-20",
    registrosEncendido: [
      { inicio: "2025-03-09T08:00:00", fin: "2025-03-09T18:00:00", horas: 10 },
      { inicio: "2025-03-10T08:00:00", fin: "2025-03-10T18:00:00", horas: 10 },
    ],
  },
  {
    id: "eq-004",
    codigo: "40-001",
    nombre: "Sensor ERA BLUE",
    descripcion: "Sensor de monitoreo de parámetros del agua",
    tipo: "monitoreo",
    subcategoria: "ph",
    marca: "Erablue",
    modelo: "EB-5000",
    serie: "9-0015",
    fechaInstalacion: "2022-11-05",
    funcionEquipo: "Monitoreo de parámetros del agua",
    ubicacion: "Estanque P-01",
    estanqueId: "P-01",
    estado: "activo",
    encendido: true,
    horasUso: 567,
    horasMantenimiento: 1000,
    ultimoMantenimiento: "2025-02-01",
    registrosEncendido: [
      { inicio: "2025-03-01T00:00:00", fin: null, horas: 0 },
    ],
  },
  {
    id: "eq-005",
    codigo: "30-001",
    nombre: "Alimentador CRAFTSMAN",
    descripcion: "Sistema automático de alimentación para estanque 5",
    tipo: "alimentacion",
    subcategoria: "automatico",
    marca: "Craftsman",
    modelo: "CM-2000",
    serie: "9-0013",
    fechaInstalacion: "2021-09-22",
    funcionEquipo: "Sistema automático de alimentación",
    ubicacion: "Estanque E-02",
    estanqueId: "E-02",
    estado: "activo",
    encendido: false,
    horasUso: 432,
    horasMantenimiento: 500,
    ultimoMantenimiento: "2025-01-15",
    registrosEncendido: [
      { inicio: "2025-03-10T07:00:00", fin: "2025-03-10T07:30:00", horas: 0.5 },
      { inicio: "2025-03-10T15:00:00", fin: "2025-03-10T15:30:00", horas: 0.5 },
    ],
  },
  {
    id: "eq-006",
    codigo: "10-002",
    nombre: "Motor Westinghouse",
    descripcion: "Motor de bombeo principal para estanque 6",
    tipo: "bombeo",
    subcategoria: "electrico",
    marca: "Westinghouse",
    modelo: "WH-4000",
    serie: "9-0003",
    fechaInstalacion: "2019-04-30",
    funcionEquipo: "Motor de bombeo principal",
    ubicacion: "Estanque B02",
    estanqueId: "B02",
    estado: "mantenimiento",
    encendido: false,
    horasUso: 3210,
    horasMantenimiento: 1000,
    ultimoMantenimiento: "2024-03-10",
    registrosEncendido: [
      { inicio: "2024-03-08T06:00:00", fin: "2024-03-08T08:00:00", horas: 2 },
    ],
  },
];

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Genera un código único para el equipo basado en tipo y cantidad existente
 */
function generarCodigoEquipo(tipo) {
  const tipoObj = TIPOS_EQUIPO.find(t => t.value === tipo);
  if (!tipoObj) return "99-001";
  
  const prefijo = tipoObj.prefijo;
  const existentes = equiposMock.filter(e => e.codigo.startsWith(prefijo));
  const numero = existentes.length + 1;
  return `${prefijo}-${String(numero).padStart(3, '0')}`;
}

/**
 * Calcula las horas totales de uso desde los registros de encendido
 */
function calcularHorasUso(registros) {
  let total = 0;
  registros.forEach(reg => {
    if (reg.horas) {
      total += reg.horas;
    }
  });
  return parseFloat(total.toFixed(2));
}

/**
 * Verifica si un equipo necesita mantenimiento (horas de uso >= horasMantenimiento)
 */
function necesitaMantenimiento(equipo) {
  return equipo.horasUso >= equipo.horasMantenimiento;
}

/**
 * Calcula las horas restantes para mantenimiento
 */
function horasRestantesMantenimiento(equipo) {
  const restantes = equipo.horasMantenimiento - equipo.horasUso;
  return restantes > 0 ? parseFloat(restantes.toFixed(2)) : 0;
}

/**
 * Obtiene el estanque asociado a un equipo
 */
function getEstanqueById(estanqueId) {
  return ESTANQUES_DISPONIBLES.find(e => e.id === estanqueId) || null;
}

// ============================================================
// EXPORTACIÓN DE FUNCIONES
// ============================================================

export const equiposService = {
  /**
   * Obtiene todos los equipos con filtros opcionales
   */
  async getEquipos(filtros = {}) {
    await delay(500);
    let resultados = [...equiposMock];
    
    if (filtros.tipo) {
      resultados = resultados.filter(e => e.tipo === filtros.tipo);
    }
    if (filtros.subcategoria) {
      resultados = resultados.filter(e => e.subcategoria === filtros.subcategoria);
    }
    if (filtros.estado) {
      resultados = resultados.filter(e => e.estado === filtros.estado);
    }
    if (filtros.estanqueId) {
      resultados = resultados.filter(e => e.estanqueId === filtros.estanqueId);
    }
    if (filtros.encendido !== undefined) {
      resultados = resultados.filter(e => e.encendido === filtros.encendido);
    }
    if (filtros.busqueda) {
      const q = filtros.busqueda.toLowerCase();
      resultados = resultados.filter(e =>
        e.nombre.toLowerCase().includes(q) ||
        e.descripcion.toLowerCase().includes(q) ||
        e.codigo.toLowerCase().includes(q) ||
        e.marca.toLowerCase().includes(q) ||
        e.modelo.toLowerCase().includes(q)
      );
    }
    
    // Ordenar por nombre
    resultados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    return resultados;
  },

  /**
   * Obtiene un equipo por su ID
   */
  async getEquipoById(id) {
    await delay(300);
    const equipo = equiposMock.find(e => e.id === id);
    if (!equipo) throw new Error("Equipo no encontrado");
    return { ...equipo };
  },

  /**
   * Crea un nuevo equipo
   */
  async createEquipo(data) {
    await delay(500);
    const newId = `eq-${String(Date.now()).slice(-6)}`;
    const codigo = data.codigo || generarCodigoEquipo(data.tipo);
    
    const nuevoEquipo = {
      id: newId,
      codigo: codigo,
      nombre: data.nombre.trim(),
      descripcion: data.descripcion ? data.descripcion.trim() : "",
      tipo: data.tipo,
      subcategoria: data.subcategoria || "",
      marca: data.marca || "",
      modelo: data.modelo || "",
      serie: data.serie || "",
      fechaInstalacion: data.fechaInstalacion || new Date().toISOString().split('T')[0],
      funcionEquipo: data.funcionEquipo || "",
      ubicacion: data.ubicacion || "",
      estanqueId: data.estanqueId || "",
      estado: data.estado || "activo",
      encendido: false,
      horasUso: 0,
      horasMantenimiento: data.horasMantenimiento || 500,
      ultimoMantenimiento: data.ultimoMantenimiento || data.fechaInstalacion || new Date().toISOString().split('T')[0],
      registrosEncendido: [],
    };
    
    equiposMock.push(nuevoEquipo);
    return { ...nuevoEquipo };
  },

  /**
   * Actualiza un equipo existente
   */
  async updateEquipo(id, data) {
    await delay(500);
    const index = equiposMock.findIndex(e => e.id === id);
    if (index === -1) throw new Error("Equipo no encontrado");
    
    // No permitir actualizar el código
    const { codigo, ...datosActualizables } = data;
    
    equiposMock[index] = {
      ...equiposMock[index],
      ...datosActualizables,
    };
    
    return { ...equiposMock[index] };
  },

  /**
   * Elimina un equipo
   */
  async deleteEquipo(id) {
    await delay(500);
    const index = equiposMock.findIndex(e => e.id === id);
    if (index === -1) throw new Error("Equipo no encontrado");
    equiposMock.splice(index, 1);
    return true;
  },

  /**
   * Cambia el estado de encendido/apagado de un equipo
   */
  async toggleEquipoEstado(id) {
    await delay(300);
    const index = equiposMock.findIndex(e => e.id === id);
    if (index === -1) throw new Error("Equipo no encontrado");
    
    const equipo = equiposMock[index];
    const ahora = new Date().toISOString();
    
    if (equipo.encendido) {
      // Apagar: registrar el fin del encendido
      const ultimoRegistro = equipo.registrosEncendido[equipo.registrosEncendido.length - 1];
      if (ultimoRegistro && !ultimoRegistro.fin) {
        ultimoRegistro.fin = ahora;
        const inicio = new Date(ultimoRegistro.inicio);
        const fin = new Date(ahora);
        ultimoRegistro.horas = parseFloat(((fin - inicio) / 3600000).toFixed(2));
        equipo.horasUso += ultimoRegistro.horas;
        equipo.horasUso = parseFloat(equipo.horasUso.toFixed(2));
      }
      equipo.encendido = false;
    } else {
      // Encender: agregar nuevo registro
      equipo.registrosEncendido.push({
        inicio: ahora,
        fin: null,
        horas: 0,
      });
      equipo.encendido = true;
    }
    
    equiposMock[index] = equipo;
    return { ...equipo };
  },

  /**
   * Obtiene los equipos que están próximos a necesitar mantenimiento
   */
  async getEquiposProximosMantenimiento(umbral = 100) {
    await delay(300);
    const equipos = equiposMock.filter(e => e.estado === "activo");
    const proximos = equipos.filter(e => {
      const restantes = horasRestantesMantenimiento(e);
      return restantes > 0 && restantes <= umbral;
    });
    
    proximos.sort((a, b) => horasRestantesMantenimiento(a) - horasRestantesMantenimiento(b));
    return proximos;
  },

  /**
   * Obtiene estadísticas generales de equipos
   */
  async getEstadisticasEquipos() {
    await delay(300);
    const total = equiposMock.length;
    const activos = equiposMock.filter(e => e.estado === "activo").length;
    const mantenimiento = equiposMock.filter(e => e.estado === "mantenimiento").length;
    const encendidos = equiposMock.filter(e => e.encendido).length;
    const proximosMantenimiento = equiposMock.filter(e => {
      if (e.estado !== "activo") return false;
      return horasRestantesMantenimiento(e) <= 100 && horasRestantesMantenimiento(e) > 0;
    }).length;
    
    return {
      total,
      activos,
      mantenimiento,
      encendidos,
      proximosMantenimiento,
    };
  },

  /**
   * Obtiene los tipos de equipo disponibles
   */
  getTiposEquipo() {
    return TIPOS_EQUIPO;
  },

  /**
   * Obtiene las subcategorías para un tipo de equipo
   */
  getSubcategorias(tipo) {
    return SUBCATEGORIAS[tipo] || SUBCATEGORIAS.otro;
  },

  /**
   * Obtiene la lista de estanques disponibles para asociar
   * Devuelve un array de objetos con { label, value } para que funcione con el componente Select
   */
  getEstanquesDisponibles() {
    return ESTANQUES_DISPONIBLES.map(e => ({
      label: e.label,
      value: e.id,
    }));
  },

  /**
   * Obtiene el código de un equipo (read-only)
   */
  getCodigoEquipo(id) {
    const equipo = equiposMock.find(e => e.id === id);
    return equipo ? equipo.codigo : null;
  },

  /**
   * Formatea las horas de uso para mostrar
   */
  formatearHoras(horas) {
    if (horas < 1) {
      return `${Math.round(horas * 60)} min`;
    }
    return `${Math.round(horas)} h`;
  },
};

// Exportar funciones auxiliares para uso en componentes
export {
  necesitaMantenimiento,
  horasRestantesMantenimiento,
  getEstanqueById,
  calcularHorasUso,
};