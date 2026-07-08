/**
 * ============================================================
 * CONSTANTES ALIMENTACIONOPCIONES
 * ============================================================
 *
 * Centraliza las opciones fijas de los selects del formulario de
 * Alimentación (Finca, Estanque, Método, Presentación, Proveedor,
 * Tipo) y las horas del selector de Hora, para que los
 * componentes de sección del formulario no las redefinan cada
 * uno por su cuenta.
 *
 * Ejemplo:
 * import { FINCAS, ESTANQUES } from '../constants/alimentacionOpciones';
 */

export const HORAS = ["7:00 AM", "3:00 PM"];

export const ESTANQUES = [
  { label: "A01", value: "A01" },
  { label: "A02", value: "A02" },
  { label: "B01", value: "B01" },
  { label: "B02", value: "B02" },
  { label: "B03", value: "B03" },
  { label: "E01", value: "E01" },
  { label: "E02", value: "E02" },
  { label: "V01", value: "V01" },
  { label: "V02", value: "V02" },
];

export const FINCAS = [
  { label: "Finca La Reina", value: "laReina" },
  { label: "Finca La Esperanza", value: "laEsperanza" },
  { label: "Finca La Villa", value: "laVilla" },
  { label: "Finca El Paraíso", value: "elParaiso" },
];

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
