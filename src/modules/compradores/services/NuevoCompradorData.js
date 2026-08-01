/**
 * ============================================================
 * SERVICE: NUEVOCOMPRADORDATA
 * ============================================================
 * Módulo: Compradores
 *
 * Datos estáticos para el formulario de alta de comprador.
 *
 * FUNCIONALIDAD:
 * 1. TIPOS_PRODUCTO: opciones para el Select de tipo de producto
 *    en NuevoCompradorScreen.jsx.
 *
 * IMPORTANTE:
 * - Esta lista es prácticamente idéntica a tiposProducto en
 *   CompradorData.js (mismos labels/values). Están duplicadas en
 *   dos archivos del mismo módulo; conviene unificarlas en una
 *   sola fuente para no tener que actualizar dos lugares si
 *   cambia un tipo de producto.
 * ============================================================
 */

export const TIPOS_PRODUCTO = [
  { label: "Alimento", value: "alimento" },
  { label: "Antibióticos", value: "antibioticos" },
  { label: "Fertilizantes", value: "fertilizantes" },
  { label: "Probióticos", value: "probioticos" },
  { label: "Equipos", value: "equipos" },
];