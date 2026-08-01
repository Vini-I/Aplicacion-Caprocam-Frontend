/**
 * ============================================================
 * CONSTANTES ALIMENTACIONOPCIONES
 * ============================================================
 *
 * Centraliza las opciones fijas de los selects del formulario de
 * Alimentación (Método, Presentación, Proveedor, Tipo) y las
 * horas del selector de Hora, para que los componentes de sección
 * del formulario no las redefinan cada uno por su cuenta.
 *
 * Finca y Estanque NO viven aquí: se cargan en vivo desde el
 * backend vía src/shared/hooks/useCatalogos.js (value = id
 * numérico real), no como listas fijas.
 *
 * Ejemplo:
 * import { METODOS, PRESENTACION } from '../constants/alimentacionOpciones';
 */

export const HORAS = ["7:00 AM", "3:00 PM"];

export const METODOS = [
  { label: "Plato", value: "Plato" },
  { label: "Boleo", value: "Boleo" },
];

export const PRESENTACION = [
  { label: "En polvo", value: "Polvo" },
  { label: "Granulado", value: "Granulado" },
];

export const PROVEEDORES = [
  { label: "Biomar", value: "Biomar" },
  { label: "Otro", value: "Otro" },
];

export const TIPOS = [
  { label: "Balanceado iniciador 35%", value: "Balanceado iniciador 35%" },
  { label: "Balanceado engorde 38%", value: "Balanceado engorde 38%" },
  { label: "Balanceado premium 40%", value: "Balanceado premium 40%" },
  { label: "Antibiótico", value: "Antibiótico" },
];
