/**
 * ============================================================
 * SERVICE: ESTANQUES SCREEN
 * ============================================================
 *
 * Funciones auxiliares de NuevoEstanque, EditarEstanque y
 * DetalleEstanque. Centraliza opciones, validaciones y mapeos.
 */

import { getCurrentDate } from "../../../shared/utils/dateUtils";
import { estanques } from "../../finca/screens/EstanqueData";

export const TIPOS_ESTANQUE = [
  {
    label: "Estanque de tierra semiintensivo",
    value: "tierra_semiintensivo",
  },
  {
    label: "Estanque reservorio",
    value: "reservorio",
  },
  {
    label: "Estanque con geomembrana",
    value: "geomembrana",
  },
  {
    label: "Estanque superintensivo",
    value: "superintensivo",
  },
];

export const FUENTES_AGUA = [
  {
    label: "Estero",
    value: "estero",
  },
  {
    label: "Golfo",
    value: "golfo",
  },
  {
    label: "Reservorio",
    value: "reservorio",
  },
];

export const OPCIONES_PRECRIA = [
  {
    label: "Si, usa precria",
    value: "si",
  },
  {
    label: "No, siembra directa",
    value: "no",
  },
];

export const ESTADOS_ESTANQUE = [
  {
    label: "Activo",
    value: "Activo",
  },
  {
    label: "En preparacion",
    value: "En preparacion",
  },
  {
    label: "Mantenimiento",
    value: "Mantenimiento",
  },
  {
    label: "Engorde",
    value: "Engorde",
  },
  {
    label: "Cosechado",
    value: "Cosechado",
  },
];

export function obtenerParametro(valor, respaldo) {
  let resultado = respaldo;

  if (valor !== undefined && valor !== null && valor !== "") {
    resultado = String(valor);
  }

  return resultado;
}

export function obtenerValor(estanque, params, campo, respaldo) {
  let resultado = respaldo;

  if (
    estanque &&
    estanque[campo] !== undefined &&
    estanque[campo] !== null &&
    estanque[campo] !== ""
  ) {
    resultado = String(estanque[campo]);
  }

  if (
    params[campo] !== undefined &&
    params[campo] !== null &&
    params[campo] !== ""
  ) {
    resultado = String(params[campo]);
  }

  return resultado;
}

export function validarFormularioEstanque(datos) {
  const camposObligatorios = [
    "codigo",
    "tipoEstanque",
    "estado",
    "largo",
    "ancho",
    "profundidad",
    "fuenteAgua",
    "fechaMantenimiento",
    "precria",
  ];

  for (const campo of camposObligatorios) {
    const valor = datos[campo];

    if (valor === "" || valor === undefined || valor === null) {
      return {
        valido: false,
        tipoMensaje: "danger",
        mensaje: "Rellene los datos requeridos.",
      };
    }
  }

  return {
    valido: true,
    tipoMensaje: "info",
    mensaje: "Rellene los datos requeridos.",
  };
}

export function eliminarEstanqueLocal(codigo) {
  let eliminado = false;

  for (let index = 0; index < estanques.length; index++) {
    if (estanques[index].codigo === codigo) {
      estanques.splice(index, 1);
      eliminado = true;
      break;
    }
  }

  return eliminado;
}

export function obtenerOpcionesEstanqueSeleccionado(codigoEstanque, fincaNombre) {
  const opciones = [];

  if (codigoEstanque !== "") {
    opciones.push({
      label: codigoEstanque + " - " + fincaNombre,
      value: codigoEstanque,
    });
  }

  return opciones;
}

export function obtenerTextoSiNo(valor) {
  let texto = "No";
  const normalizado = String(valor || "").trim().toLowerCase();

  if (normalizado === "si" || normalizado === "true" || normalizado === "1") {
    texto = "Si";
  }

  return texto;
}

export function normalizarNumeroDecimal(valor) {
  let valorLimpio = String(valor ?? "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");
  const partes = valorLimpio.split(".");
  let entero = partes[0] ?? "";
  let decimal = partes.length > 1 ? partes.slice(1).join("") : null;
  entero = entero.slice(0, 10);
  if (decimal !== null) {
    decimal = decimal.slice(0, 2);
    return `${entero}.${decimal}`;
  }
  return entero;
}