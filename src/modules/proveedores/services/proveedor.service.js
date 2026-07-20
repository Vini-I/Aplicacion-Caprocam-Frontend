import api from "../../../api/api";

/**
 * ============================================================
 * SERVICIO DE PROVEEDORES
 * ============================================================
 *
 * Conecta el módulo de proveedores con el backend real
 * (routes/proveedor.route.js). Reemplaza la fuente de datos mock
 * (ProveedorData.js).
 *
 * El backend responde siempre con { success, message, data }, y el
 * proveedor viene en camelCase con nombreEmpresa / correoElectronico
 * (ver dtos/proveedor.dto.js del backend). mapProveedor() lo adapta
 * a la forma que ya usan las screens del módulo (nombre, correo,
 * iniciales).
 */

// Catálogo de tipos de producto (debe calzar con el ENUM del backend)
export const tiposProducto = [
  { label: "Alimento", value: "alimento" },
  { label: "Antibiótico", value: "antibiotico" },
  { label: "Fertilizante", value: "fertilizante" },
  { label: "Probióticos", value: "probioticos" },
  { label: "Equipos", value: "equipos" },
  { label: "Otros", value: "otros" },
];

export function getTipoProductoLabel(value) {
  const tipo = tiposProducto.find((t) => t.value === value);
  return tipo ? tipo.label : value;
}

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
 * correoElectronico, ...) a la forma que usan las screens
 * (nombre, correo, iniciales).
 */
export function mapProveedor(proveedor) {
  if (!proveedor) return null;

  return {
    id: proveedor.id,
    uuid: proveedor.uuid,
    nombre: proveedor.nombre,
    iniciales: generarIniciales(proveedor.nombre),
    tipoProducto: proveedor.tipoProducto,
    telefono: proveedor.telefono,
    correo: proveedor.correo,
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
    console.error("Error al obtener proveedores:", error); //Mientras se prueba todo unicamente

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
    console.error("Error al obtener proveedor:", error); //Mientras se prueba todo unicamente

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
    console.error("Error al crear proveedor:", error.response?.data || error.message); //Mientras se prueba todo unicamente

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
    console.error("Error al actualizar proveedor:", error.response?.data || error.message); //Mientras se prueba todo unicamente

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
    console.error("Error al eliminar proveedor:", error.response?.data || error.message); //Mientras se prueba todo unicamente

    throw error;
  }
};