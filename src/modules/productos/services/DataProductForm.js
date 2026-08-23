/**
 * ============================================================
 * SERVICE: DATAPRODUCTFORM
 * ============================================================
 * Módulo: Productos
 *
 * Datos estáticos que usan los formularios de producto
 * (AgregarProducto.jsx y EditarProducto.jsx).
 *
 * FUNCIONALIDAD:
 * 1. CATEGORIAS: opciones para el Select de categoría del producto.
 * 2. UNIDADES: opciones para el Select de unidad de medida.
 * 3. initialForm: estado inicial vacío del formulario, usado al crear
 *    un producto nuevo (y para resetear el form si params.productoParam
 *    no llega o es inválido).
 *
 * IMPORTANTE:
 * - Las categorías "Alimentación" y "Tratamiento" son las que habilitan
 *   el campo "Fecha de caducidad" en useAgregarProducto.js / useEditarProducto.js.
 * - unidad arranca en "kg" por defecto en initialForm.
 * ============================================================
*/


// ─────────────────────────────────────────────
// Opciones de selects
// ─────────────────────────────────────────────
export const CATEGORIAS = [
  { label: "Alimentación", value: "Alimentación" },
  { label: "Tratamiento", value: "Tratamiento" },
  { label: "Químico", value: "Químico" },
  { label: "Mantenimiento", value: "Mantenimiento" },
  { label: "Equipos", value: "Equipos" },
];

export const UNIDADES = [
  { label: "kg", value: "kg" },
  { label: "g", value: "g" },
  { label: "litros", value: "litros" },
  { label: "mL", value: "mL" },
  { label: "unidades", value: "unidades" },
];

// ─────────────────────────────────────────────
// Estado inicial limpio
// ─────────────────────────────────────────────
export const initialForm = {
  codigo: "",   
  nombre: "",
  categoria: "",
  proveedor: "",
  cantidad: "",
  unidad: "kg",
  stockMinimo: "",
  precioUnidad: "",
  entryDate: "",
  expirationDate: "",
};

// ─────────────────────────────────────────────
// Fecha de hoy en formato ISO (YYYY-MM-DD), en hora LOCAL
// Se usa para validar fecha de ingreso (no futura) y fecha de
// caducidad (debe ser posterior a hoy). Ambos hooks
// (useAgregarProducto / useEditarProducto) 
// ─────────────────────────────────────────────
export function obtenerFechaHoyISO() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ─────────────────────────────────────────────
// DateInput de AgregarProducto.jsx / EditarProducto.jsx devuelve la fecha en formato
// ─────────────────────────────────────────────
export function convertirDDMMYYYYaISO(fechaDDMMYYYY) {
  if (!fechaDDMMYYYY) return "";
  const partes = String(fechaDDMMYYYY).split("/");
  if (partes.length !== 3) return "";
  const [dia, mes, anio] = partes;
  if (!dia || !mes || !anio) return "";
  return `${anio.padStart(4, "0")}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}
