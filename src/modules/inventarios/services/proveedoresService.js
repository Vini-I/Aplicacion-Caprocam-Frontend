// modules/inventarios/services/proveedoresService.js

/**
 * Store en memoria para el módulo de proveedores.
 * Sirve como capa de datos mientras no hay backend.
 * Exporta funciones para leer, agregar y editar proveedores.
 *
 * Patrón idéntico al de inventarioService.js.
 */

export const TIPOS_PRODUCTO = [
  { label: "Alimento", value: "alimento" },
  { label: "Antibióticos", value: "antibioticos" },
  { label: "Fertilizantes", value: "fertilizantes" },
  { label: "Probióticos", value: "probioticos" },
  { label: "Equipos", value: "equipos" },
];

let proveedores = [
  {
    id: 1,
    nombre: "Biomar",
    iniciales: "BI",
    tipoProducto: "alimento",
    telefono: "+506 2200-1100",
    correo: "ventas@biomar.cr",
    direccion: "San José, Costa Rica",
    notas: "",
  },
  {
    id: 2,
    nombre: "Farivet",
    iniciales: "FV",
    tipoProducto: "antibioticos",
    telefono: "+506 2245-8800",
    correo: "info@farivet.com",
    direccion: "Alajuela, Costa Rica",
    notas: "",
  },
  {
    id: 3,
    nombre: "Trisan",
    iniciales: "TR",
    tipoProducto: "fertilizantes",
    telefono: "+506 2290-3300",
    correo: "clientes@trisan.co.cr",
    direccion: "Cartago, Costa Rica",
    notas: "",
  },
];

/** Retorna una copia del array para evitar mutaciones externas. */
export function getProveedores() {
  return [...proveedores];
}

/** Busca un proveedor por id. Devuelve el objeto o undefined si no existe. */
export function getProveedorById(id) {
  return proveedores.find((p) => String(p.id) === String(id));
}

/**
 * Agrega un nuevo proveedor al store.
 * Calcula las iniciales automáticamente a partir del nombre.
 * Asigna un id numérico autoincremental.
 */
export function addProveedor(proveedor) {
  const nuevoId =
    proveedores.length > 0
      ? Math.max(...proveedores.map((p) => p.id)) + 1
      : 1;

  const iniciales = proveedor.nombre
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const nuevo = { ...proveedor, id: nuevoId, iniciales };
  proveedores = [...proveedores, nuevo];
  return nuevo;
}

/**
 * Actualiza un proveedor existente por id.
 * Recalcula las iniciales si el nombre cambió.
 * Si no encuentra el id, no hace nada.
 */
export function updateProveedor(proveedorActualizado) {
  proveedores = proveedores.map((p) => {
    if (p.id !== proveedorActualizado.id) return p;

    const nombre = proveedorActualizado.nombre ?? p.nombre;
    const iniciales = nombre
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");

    return { ...p, ...proveedorActualizado, iniciales };
  });
}

// Mapeo entre categoría de producto y tipoProducto del proveedor
const CATEGORIA_A_TIPO = {
  "Alimentación": "alimento",
  "Antibiótico": "antibioticos",
  "Fertilizante": "fertilizantes",
  "Probiótico": "probioticos",
  "Tratamiento": "alimento",   // Biomar y Trisan manejan tratamientos
  "Químico": "fertilizantes", // Trisan maneja químicos
};

/**
 * Retorna los proveedores que corresponden a una categoría de producto.
 * Si la categoría no tiene mapeo o no hay match, devuelve todos.
 */
export function getProveedoresByCategoria(categoria) {
  const tipo = CATEGORIA_A_TIPO[categoria];
  if (!tipo) return [...proveedores];
  const filtrados = proveedores.filter((p) => p.tipoProducto === tipo);
  return filtrados.length > 0 ? filtrados : [...proveedores];
}

/**
 * Elimina un proveedor por id.
 */
export function deleteProveedor(id) {
  proveedores = proveedores.filter((p) => p.id !== parseInt(id));
}