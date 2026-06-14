// modules/inventarios/services/inventarioService.js

/**
 * Store en memoria para el módulo de inventarios.
 * Sirve como capa de datos mientras no hay backend.
 * Exporta funciones para leer, agregar y editar productos.
 */

let productos = [
  {
    id: 1,
    nombre: "Alimento Biomar 35%",
    categoria: "Alimentación",
    cantidad: 250,
    unidad: "kg",
    stockMinimo: 50,
    proveedor: "Biomar",
    precioUnidad: 1450,
  },
  {
    id: 2,
    nombre: "Melaza de caña",
    categoria: "Alimentación",
    cantidad: 30,
    unidad: "litros",
    stockMinimo: 50,
    proveedor: "Trisan",
    precioUnidad: 320,
  },
  {
    id: 3,
    nombre: "Cal agrícola",
    categoria: "Tratamiento",
    cantidad: 120,
    unidad: "kg",
    stockMinimo: 40,
    proveedor: "AgroTica",
    precioUnidad: 850,
  },
  {
    id: 4,
    nombre: "Probiótico EM-1",
    categoria: "Tratamiento",
    cantidad: 15,
    unidad: "litros",
    stockMinimo: 20,
    proveedor: "BioAgro CR",
    precioUnidad: 4200,
  },
  {
    id: 5,
    nombre: "Oxígeno granulado",
    categoria: "Químico",
    cantidad: 80,
    unidad: "kg",
    stockMinimo: 30,
    proveedor: "AquaChem",
    precioUnidad: 2100,
  },
  {
    id: 6,
    nombre: "Sal mineral",
    categoria: "Alimentación",
    cantidad: 200,
    unidad: "kg",
    stockMinimo: 60,
    proveedor: "Trisan",
    precioUnidad: 560,
  },
  {
    id: 7,
    nombre: "Fertilizante NPK",
    categoria: "Tratamiento",
    cantidad: 10,
    unidad: "kg",
    stockMinimo: 25,
    proveedor: "AgroTica",
    precioUnidad: 1750,
  },
  {
    id: 8,
    nombre: "Yodo povidona",
    categoria: "Químico",
    cantidad: 5,
    unidad: "litros",
    stockMinimo: 10,
    proveedor: "MediVet CR",
    precioUnidad: 3900,
  },
];

/** Retorna una copia del array para evitar mutaciones externas. */
export function getProductosInventario() {
  return [...productos];
}

/**
 * Agrega un nuevo producto al store.
 * Asigna un id numérico autoincremental.
 */
export function addProducto(producto) {
  const nuevoId = productos.length > 0
    ? Math.max(...productos.map((p) => p.id)) + 1
    : 1;

  const nuevo = { ...producto, id: nuevoId };
  productos = [...productos, nuevo];
  return nuevo;
}

/**
 * Actualiza un producto existente por id.
 * Si no encuentra el id, no hace nada.
 */
export function updateProducto(productoActualizado) {
  productos = productos.map((p) =>
    p.id === productoActualizado.id ? { ...p, ...productoActualizado } : p
  );
}