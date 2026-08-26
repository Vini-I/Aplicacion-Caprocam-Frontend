/**
 * InventarioCalculos.js
 * Lógica de negocio (cálculos) del módulo de Inventarios.
 *
 * FUNCIONALIDAD:
 * - Determina si un producto tiene stock bajo comparando la cantidad
 *   actual contra el stock mínimo configurado.
 * - Ordena los productos con los más recientes primero (id
 *   descendente), para que un producto recién agregado aparezca de
 *   primero en el listado.
 *
 * REGLAS IMPORTANTES:
 * - Sin JSX, sin estado: solo funciones puras reutilizables por el
 *   hook (useInventario) y por el screen (tarjetas de producto).
 * - El orden por id descendente asume id autoincremental en el
 *   backend (a mayor id, más reciente el registro).
 *
 * @dependencies - N/A
 * @validations - N/A
 * @navigation - N/A
 */

export function esStockBajo(producto) {
  return Number(producto?.cantidad) < Number(producto?.stockMinimo);
}

export function ordenarPorMasReciente(productos) {
  return [...productos].sort((a, b) => Number(b.id) - Number(a.id));
}
