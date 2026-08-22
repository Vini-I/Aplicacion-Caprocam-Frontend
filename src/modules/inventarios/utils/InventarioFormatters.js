/**
 * InventarioFormatters.js
 * Formatters de presentación del módulo de Inventarios.
 *
 * FUNCIONALIDAD:
 * - Resuelve el ícono correspondiente a una categoría de producto.
 * - Pluraliza unidades de medida en español según la cantidad.
 * - Da formato de moneda (₡) al precio por unidad.
 * - Da formato al texto de fecha de caducidad, con fallback cuando
 *   no hay fecha registrada.
 *
 * REGLAS IMPORTANTES:
 * - Sin JSX, sin estado: solo funciones puras de formateo,
 *   consumidas directamente por el screen (InventarioScreen).
 *
 * @dependencies - theme/icons (ICONS)
 * @validations - N/A
 * @navigation - N/A
 */

import { ICONS } from "../../../theme/icons";

const iconoPorCategoria = [
  { match: ["alimentación", "alimentacion"], icon: ICONS.food },
  { match: ["tratamiento"], icon: ICONS.treatment },
  { match: ["químico", "quimico"], icon: ICONS.chemicalContainer },
  { match: ["fertilizante"], icon: ICONS.fertilizer },
  { match: ["antibiótico", "antibiotico"], icon: ICONS.microscope },
  { match: ["probiótico", "probiotico"], icon: ICONS.microscope },
  { match: ["mantenimiento"], icon: ICONS.tools },
];

export function getIconForCategory(categoria) {
  const cat = (categoria || "").toLowerCase();
  const encontrado = iconoPorCategoria.find(({ match }) =>
    match.some((palabra) => cat.includes(palabra)),
  );
  return encontrado ? encontrado.icon : ICONS.box;
}

const unidadesInvariables = ["kg", "g", "mg", "ml", "l", "cc"];

const vocales = "aeiouáéíóú";
const acentos = { á: "a", é: "e", í: "i", ó: "o", ú: "u" };

function pluralizarPalabra(palabra) {
  if (!palabra || palabra.toLowerCase().endsWith("s")) return palabra;

  const ultima = palabra.charAt(palabra.length - 1).toLowerCase();
  if (vocales.includes(ultima)) {
    return `${palabra}s`;
  }

  const penultima = palabra.charAt(palabra.length - 2).toLowerCase();
  if (acentos[penultima]) {
    return `${palabra.slice(0, -2)}${acentos[penultima]}${ultima}es`;
  }
  return `${palabra}es`;
}

export function getPluralizedUnit(cantidad, unidad) {
  if (Number(cantidad) <= 1 || !unidad) return unidad;

  const [primeraPalabra, ...resto] = unidad.trim().split(" ");

  if (unidadesInvariables.includes(primeraPalabra.toLowerCase())) {
    return unidad;
  }

  const palabraPlural = pluralizarPalabra(primeraPalabra);
  return resto.length ? `${palabraPlural} ${resto.join(" ")}` : palabraPlural;
}

export function formatearPrecioUnidad(precioUnidad) {
  return precioUnidad != null && precioUnidad !== ""
    ? `₡${Number(precioUnidad).toLocaleString("es-CR")}`
    : "₡0";
}

export function formatearFechaCaducidad(fechaCaducidad) {
  return fechaCaducidad != null &&
    fechaCaducidad.toString().trim() !== "" &&
    fechaCaducidad !== "-"
    ? fechaCaducidad
    : "Sin Fecha de Caducidad";
}
