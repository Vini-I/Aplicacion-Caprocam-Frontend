/**
 * ============================================================
 * FUENTE DE DATOS DE PROVEEDORES
 * ============================================================
 *
 * Fuente de datos mock del módulo de proveedores (no hay backend
 * conectado todavía).
 *
 * FUNCIONALIDAD:
 * 1. Provee `proveedoresMock`, usado por listado/detalle/edición.
 * 2. Provee `tiposProducto`, catálogo label/value para el Select de
 *    tipo de producto.
 * 3. Provee `getProveedoresByCategoria`, que filtra proveedoresMock por
 *    una categoría de inventario, mapeando categoría -> tipoProducto.
 *
 * IMPORTANTE:
 * - `tiposProducto.value` usa el mismo texto capitalizado que
 *   `proveedoresMock.tipoProducto` (ej. "Alimento"), para que el Select
 *   pueda preseleccionar correctamente el tipo de un proveedor
 *   existente (EditarProveedorScreen).
 * - No usar valores en minúscula aquí sin también migrar
 *   proveedoresMock, o el Select de edición dejará de reconocer el
 *   tipo actual del proveedor.
 */
export const proveedoresMock = [
  {
    id: 1,
    nombre: "Biomar",
    iniciales: "BI",
    tipoProducto: "Alimento",
    telefono: "+50622001100",
    correo: "ventas@biomar.cr",
    direccion: "San José, Costa Rica",
    notas: "Proveedor de alimentos para peces",
  },
  
  {
    id: 2,
    nombre: "Farivet",
    iniciales: "FV",
    tipoProducto: "Antibióticos",
    telefono: "+50622458800",
    correo: "info@farivet.com",
    direccion: "Alajuela, Costa Rica",
    notas: "Proveedor de antibióticos para camarones y peces",
  },

  {
    id: 3,
    nombre: "Trisan",
    iniciales: "TR",
    tipoProducto: "Fertilizantes",
    telefono: "+50622903300",
    correo: "clientes@trisan.co.cr",
    direccion: "Cartago, Costa Rica",
    notas: "Proveedor de fertilizantes orgánicos",
  },
];

export const tiposProducto = [
  { label: "Alimento", value: "Alimento" },
  { label: "Antibióticos", value: "Antibióticos" },
  { label: "Fertilizantes", value: "Fertilizantes" },
  { label: "Probióticos", value: "Probióticos" },
  { label: "Equipos", value: "Equipos" },
];

const CATEGORIA_A_TIPO = {
  "Alimentación": "Alimento",
  "Tratamiento":  "Antibióticos",
  "Químico":      "Fertilizantes",
  "Fertilizante": "Fertilizantes",
  "Antibiótico":  "Antibióticos",
  "Probiótico":   "Probióticos",
};

export function getProveedoresByCategoria(categoria) {
  if (!categoria) return proveedoresMock;

  const tipo = CATEGORIA_A_TIPO[categoria];
  if (!tipo) return proveedoresMock;

  return proveedoresMock.filter((p) => p.tipoProducto === tipo);
}