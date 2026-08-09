

/**
 * ============================================================
 * LOOKUP DE PROVEEDORES (uso interno del módulo Productos)
 * ============================================================
 * Este archivo vive DENTRO de productos/services porque el
 * formulario y el detalle de producto necesitan leer proveedores
 * (para el select y para mostrar el nombre), pero el módulo
 * Proveedores como tal no es responsabilidad de este equipo. Solo
 * se usa GET, nunca se crea/edita/borra un proveedor desde acá.
 *
 * El shape de la respuesta es idéntico al de /productos:
 * { success, message, data }, así que se lee igual.
 *
 * ============================================================
 */

import api from "../../../api/api";

function mapProveedor(apiProveedor) {
  if (!apiProveedor) return null;
  return {
    id: apiProveedor.id,
    nombre: apiProveedor.nombreEmpresa,
    tipoProducto: apiProveedor.tipoProducto ?? "",
  };
}

export async function getProveedores() {
  try {
    const response = await api.get("/proveedores");
    return (response.data.data || []).map(mapProveedor);
  } catch (error) {
    throw error;
  }
}

export async function getProveedorPorId(id) {
  try {
    const response = await api.get(`/proveedores/${id}`);
    return mapProveedor(response.data.data);
  } catch (error) {
    throw error;
  }
}

// Quita tildes y pasa a minúsculas, para comparar "Alimentación" con
// "alimento", "Antibiótico" con "antibiotico", etc.
function normalizar(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Filtra proveedores cuyo tipoProducto "se parece" a la categoría de
// producto elegida (best effort). Si no hay ninguna coincidencia,
// devuelve la lista completa para no dejar el select vacío por un
// simple desacuerdo de nombres entre back y front.
export function filtrarProveedoresPorCategoria(proveedores, categoria) {
  const categoriaNorm = normalizar(categoria).slice(0, 5); // ej. "alime", "antib"
  const filtrados = proveedores.filter((p) =>
    normalizar(p.tipoProducto).includes(categoriaNorm) ||
    categoriaNorm.includes(normalizar(p.tipoProducto).slice(0, 5))
  );
  return filtrados.length > 0 ? filtrados : proveedores;
}
