import api from "../../../api/api";

/**
 * ============================================================
 * SERVICIO DE PROVEEDORES
 * ============================================================
 *
 * Conecta el módulo de Proveedores con el backend real
 * (routes/proveedor.route.js).
 *
 * FUNCIONALIDAD:
 * 1. CRUD contra /proveedores (listar, obtener, crear, actualizar,
 *    eliminar).
 * 2. mapProveedor() adapta la respuesta del backend (camelCase:
 *    nombreEmpresa, correoElectronico) a la forma que usan las
 *    screens (nombre, correo, iniciales).
 * 3. tiposProducto es el catálogo único del módulo; el value debe
 *    ser igual al ENUM tipoProductos del backend.
 *
 * IMPORTANTE:
 * El backend responde siempre como { success, message, data }.
 */

// Catálogo único de tipos de producto (value = ENUM tipoProductos del backend).
export const tiposProducto = [
  { label: "Alimento", value: "Alimento" },
  { label: "Antibiótico", value: "Antibiotico" },
  { label: "Fertilizante", value: "Fertilizante" },
  { label: "Probióticos", value: "Probioticos" },
  { label: "Equipos", value: "Equipos" },
  { label: "Otros", value: "Otros" },
];

// Label legible a partir del value del backend.
export function getTipoProductoLabel(value) {
  const tipo = tiposProducto.find((t) => t.value === value);
  return tipo ? tipo.label : value;
}

// Solo los values, derivados de tiposProducto.
export function getTiposProductoValues() {
  return tiposProducto.map((t) => t.value);
}

// Iniciales (máx. 2 letras) para el avatar de la card.
function generarIniciales(nombre) {
  return (nombre || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Adapta el proveedor que devuelve el backend (nombreEmpresa,
 * correoElectronico) a la forma que usan las screens
 * (nombre, correo, iniciales).
 */
export function mapProveedor(proveedor) {
  if (!proveedor) return null;

  const nombre = proveedor.nombreEmpresa;
  const correo = proveedor.correoElectronico;

  return {
    id: proveedor.id,
    uuid: proveedor.uuid,
    nombre,
    iniciales: generarIniciales(nombre),
    tipoProducto: proveedor.tipoProducto,
    telefono: proveedor.telefono,
    correo,
    direccion: proveedor.direccion,
    notas: proveedor.notas,
    activo: proveedor.activo,
    fechaCreacion: proveedor.fechaCreacion,
    fechaActualizacion: proveedor.fechaActualizacion,
  };
}

/*
OBTENER TODOS LOS PROVEEDORES
*/
export const getProveedores = async () => {
  try {
    const response = await api.get("/proveedores");

    return response.data.data.map(mapProveedor);
  } catch (error) {
    console.error("Error al obtener proveedores:", error); 

    throw error;
  }
};

/*
OBTENER UN PROVEEDOR POR ID
*/
export const getProveedorById = async (id) => {
  try {
    const response = await api.get(`/proveedores/${id}`);

    return mapProveedor(response.data.data);
  } catch (error) {
    console.error("Error al obtener proveedor:", error); 

    throw error;
  }
};

/*
CREAR UN PROVEEDOR
*/
export const createProveedor = async (proveedorDTO) => {
  try {
    const response = await api.post("/proveedores", proveedorDTO);

    return mapProveedor(response.data.data);
  } catch (error) {
    console.error("Error al crear proveedor:", error.response?.data || error.message); 

    throw error;
  }
};

/*
ACTUALIZAR UN PROVEEDOR
*/
export const updateProveedor = async (id, proveedorDTO) => {
  try {
    const response = await api.put(`/proveedores/${id}`, proveedorDTO);

    return mapProveedor(response.data.data);
  } catch (error) {
    console.error("Error al actualizar proveedor:", error.response?.data || error.message); 

    throw error;
  }
};

/*
ELIMINAR (DESACTIVAR) UN PROVEEDOR
*/
export const eliminarProveedor = async (id) => {
  try {
    const response = await api.delete(`/proveedores/${id}`);

    return mapProveedor(response.data.data);
  } catch (error) {
    console.error("Error al eliminar proveedor:", error.response?.data || error.message); 

    throw error;
  }
};