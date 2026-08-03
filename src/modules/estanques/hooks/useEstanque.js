/**
 * ============================================================
 * SERVICE: ESTANQUES SCREEN
 * ============================================================
 *
 * Funciones auxiliares de NuevoEstanque, EditarEstanque y
 * DetalleEstanque. Centraliza opciones, validaciones y mapeos.
 */

import { getCurrentDate } from "../../../shared/utils/dateUtils";

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
  const errores = {};

  if (!datos.codigo || String(datos.codigo).trim() === "") {
    errores.codigo = "Código del estanque es requerido. Ej: EST-01";
  }

  if (!datos.tipoEstanque || String(datos.tipoEstanque).trim() === "") {
    errores.tipoEstanque = "Seleccione el tipo de estanque.";
  }

  if (!datos.estado || String(datos.estado).trim() === "") {
    errores.estado = "Seleccione el estado del estanque.";
  }

  const validarNumero = (valor, nombre, ejemplo) => {
    if (valor === "" || valor === undefined || valor === null) {
      return `${nombre} es requerido. Ej: ${ejemplo}`;
    }
    const num = Number(String(valor).replace(/,/g, "."));
    if (isNaN(num) || num <= 0) {
      return `${nombre} debe ser un número mayor que 0. Ej: ${ejemplo}`;
    }
    return null;
  };

  const errLargo = validarNumero(datos.largo, "Largo (m)", "100");
  if (errLargo) errores.largo = errLargo;

  const errAncho = validarNumero(datos.ancho, "Ancho (m)", "80");
  if (errAncho) errores.ancho = errAncho;

  const errProf = validarNumero(datos.profundidad, "Profundidad (m)", "0.80");
  if (errProf) errores.profundidad = errProf;

  if (!datos.fuenteAgua || String(datos.fuenteAgua).trim() === "") {
    errores.fuenteAgua = "Seleccione la fuente de agua.";
  }

  if (!datos.fechaMantenimiento || String(datos.fechaMantenimiento).trim() === "") {
    errores.fechaMantenimiento = "Fecha de último mantenimiento es requerida.";
  }

  if (datos.precria === undefined || datos.precria === null || String(datos.precria).trim() === "") {
    errores.precria = "Indique si utiliza precría.";
  }

  const keys = Object.keys(errores);
  if (keys.length > 0) {
    return {
      valido: false,
      tipoMensaje: "danger",
      mensaje: errores[keys[0]] || "Rellene los datos requeridos.",
      errores,
    };
  }

  return {
    valido: true,
    tipoMensaje: "success",
    mensaje: "",
    errores: {},
  };
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