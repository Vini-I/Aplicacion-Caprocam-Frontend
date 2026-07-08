// modules/inventarios/services/inventarioService.js

/**
 * ============================================================
 * SERVICE: InventarioService
 * ============================================================
 *
 * Responsabilidad:
 * Store en memoria para el módulo de inventarios. Sirve como capa de
 * datos mientras no hay backend. Expone funciones para leer, agregar,
 * actualizar y eliminar productos del inventario.
 *
 * Datos:
 * Cada producto: { id, codigo, nombre, categoria, cantidad, unidad,
 * stockMinimo, proveedor, precioUnidad, fechaCaducidad }.
 * fechaCaducidad ya existe como dato real del producto (se define y
 * se guarda desde el módulo de Productos); aquí solo se refleja para
 * que el filtro de "Fecha de caducidad" de FilterButton.jsx pueda
 * usarlo. Formato dd/mm/aaaa, igual al que entrega el DateInput
 * compartido.
 *
 * Validaciones:
 * No aplica validación de campos aquí (se realiza en el formulario que
 * consume este servicio). El id se autogenera de forma incremental.
 *
 * Navegación:
 * No aplica, es una capa de datos sin UI.
 *
 * Dependencias:
 * Ninguna. Es consumido por hooks/useInventario.js.
 */

let productos = [
  {
    id: 1,
    codigo: "ALI-001",
    nombre: "Alimento Biomar 35%",
    categoria: "Alimentación",
    cantidad: 250,
    unidad: "kg",
    stockMinimo: 50,
    proveedor: "Biomar",
    precioUnidad: 1450,
    fechaCaducidad: "15/09/2026",
  },
  {
    id: 2,
    codigo: "ALI-002",
    nombre: "Melaza de caña",
    categoria: "Alimentación",
    cantidad: 30,
    unidad: "litros",
    stockMinimo: 50,
    proveedor: "Trisan",
    precioUnidad: 320,
    fechaCaducidad: "02/08/2026",
  },
  {
    id: 3,
    codigo: "TRA-001",
    nombre: "Cal agrícola",
    categoria: "Tratamiento",
    cantidad: 120,
    unidad: "kg",
    stockMinimo: 40,
    proveedor: "Farivet",
    precioUnidad: 850,
    fechaCaducidad: "20/12/2026",
  },
  {
    id: 4,
    codigo: "TRA-002",
    nombre: "Probiótico EM-1",
    categoria: "Tratamiento",
    cantidad: 15,
    unidad: "litros",
    stockMinimo: 20,
    proveedor: "Farivet",
    precioUnidad: 4200,
    fechaCaducidad: "10/07/2026",
  },
  {
    id: 5,
    codigo: "QUI-001",
    nombre: "Oxígeno granulado",
    categoria: "Químico",
    cantidad: 80,
    unidad: "kg",
    stockMinimo: 30,
    proveedor: "Trisan",
    precioUnidad: 2100,
    fechaCaducidad: "05/11/2026",
  },
  {
    id: 6,
    codigo: "ALI-003",
    nombre: "Sal mineral",
    categoria: "Alimentación",
    cantidad: 200,
    unidad: "kg",
    stockMinimo: 60,
    proveedor: "Trisan",
    precioUnidad: 560,
    fechaCaducidad: "28/02/2027",
  },
  {
    id: 7,
    codigo: "FER-001",
    nombre: "Fertilizante NPK",
    categoria: "Fertilizante",
    cantidad: 10,
    unidad: "kg",
    stockMinimo: 25,
    proveedor: "Farivet",
    precioUnidad: 1750,
    fechaCaducidad: "18/07/2026",
  },
  {
    id: 8,
    codigo: "QUI-002",
    nombre: "Yodo povidona",
    categoria: "Químico",
    cantidad: 5,
    unidad: "litros",
    stockMinimo: 10,
    proveedor: "Trisan",
    precioUnidad: 3900,
    fechaCaducidad: "30/07/2026",
  },
];

/** Retorna una copia del array para evitar mutaciones externas. */
export function getProductosInventario() {
  return [...productos];
}

/**
 * Agrega un nuevo producto al store.
 * Asigna un id numérico autoincremental.
 * Se agrega al inicio del arreglo para que el producto recién
 * creado aparezca primero en el listado de Inventarios.
 */
export function addProducto(producto) {
  const nuevoId = productos.length > 0
    ? Math.max(...productos.map((p) => p.id)) + 1
    : 1;

  const nuevo = { ...producto, id: nuevoId };
  productos = [nuevo, ...productos];
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

/**
 * Obtiene un producto por id.
 */
export function getProductoById(id) {
  return productos.find((p) => String(p.id) === String(id));
}

/**
 * Elimina un producto por id.
 */
export function deleteProducto(id) {
  productos = productos.filter((p) => p.id !== parseInt(id));
}