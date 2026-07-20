/**
 * ============================================================
 * DTO DE PROVEEDOR (FRONTEND -> BACKEND)
 * ============================================================
 *
 * El backend (proveedor.controller.js / proveedor.dto.js) valida el
 * body buscando específicamente las llaves: nombre, tipoProducto,
 * telefono, correo, direccion, notas. Este DTO arma ese payload y
 * normaliza el teléfono al formato estricto que exige el backend
 * (+506 XXXX-XXXX), ya que el formulario acepta variantes más
 * flexibles (con o sin +506, con o sin guión).
 */

// Tipos de producto que maneja el módulo de proveedores.
// El backend soporta también "larva" en su ENUM, pero ese valor no se
// usa en este módulo (solo aplica a otras partes del sistema).
export const TIPOS_PRODUCTO_BACKEND = Object.freeze({
  ALIMENTO: "alimento",
  ANTIBIOTICO: "antibiotico",
  FERTILIZANTE: "fertilizante",
  PROBIOTICOS: "probioticos",
  EQUIPOS: "equipos",
  OTROS: "otros",
});

/**
 * Normaliza un teléfono ingresado en el formulario al formato
 * estricto que exige el backend: "+506 XXXX-XXXX".
 * Si no se logran extraer 8 dígitos, retorna el valor tal cual llegó
 * (para que la validación del backend informe el error real).
 */
export function normalizarTelefonoParaBackend(telefono) {
  const limpio = (telefono || "").replace(/[^\d]/g, "");
  const soloNumero = limpio.startsWith("506") ? limpio.slice(3) : limpio;

  if (soloNumero.length !== 8) return telefono || "";

  return `+506 ${soloNumero.slice(0, 4)}-${soloNumero.slice(4)}`;
}

export class ProveedorDTO {
  constructor({
    
    nombre, 
    tipoProducto, 
    telefono, 
    correo, 
    direccion, 
    notas 

  }) {
    
    this.grupoDatos = 1; // Temporal hasta implementar Grupo de Datos

    this.nombre = (nombre || "").trim();
    this.tipoProducto = tipoProducto;
    this.telefono = normalizarTelefonoParaBackend(telefono);
    this.correo = (correo || "").trim();
    this.direccion = (direccion || "").trim();
    this.notas = notas ? notas.trim() : "";
  }
}