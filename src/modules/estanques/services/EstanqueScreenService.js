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
import {
  obtenerCodigoAireadorDefault,
  obtenerEstanqueAireador,
  obtenerOpcionesAireadores,
  obtenerTieneAireadoresInicial,
} from "./AireadoresEstanqueService";

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

export const ESPECIES = [
  {
    label: "Litopenaeus vannamei - Camaron blanco",
    value: "litopenaeus_vannamei",
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

export const METODOS_ALIMENTACION = [
  {
    label: "Manual",
    value: "manual",
  },
  {
    label: "Automatico",
    value: "automatico",
  },
  {
    label: "Manual y automatico",
    value: "manual_automatico",
  },
];

export const OPCIONES_AIREADORES = [
  {
    label: "Si",
    value: "si",
  },
  {
    label: "No",
    value: "no",
  },
];

export const OPCIONES_ALIMENTADOR = [
  {
    label: "Si",
    value: "si",
  },
  {
    label: "No",
    value: "no",
  },
];

export const AIREADORES_EXISTENTES = obtenerOpcionesAireadores();

export const ESTADOS_ESTANQUE = [
  {
    label: "Activo",
    value: "activo",
  },
  {
    label: "En preparacion",
    value: "preparacion",
  },
  {
    label: "Mantenimiento",
    value: "mantenimiento",
  },
  {
    label: "Engorde",
    value: "engorde",
  },
  {
    label: "Cosechado",
    value: "cosechado",
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

export function obtenerCambioAireadores(valor, codigoAireadorActual) {
  let numeroAireadores = "0";
  let codigoAireador = "";

  if (valor === "si") {
    numeroAireadores = "1";
    codigoAireador = codigoAireadorActual;

    if (codigoAireador === "") {
      codigoAireador = obtenerCodigoAireadorDefault();
    }
  }

  return {
    numeroAireadores: numeroAireadores,
    codigoAireador: codigoAireador,
  };
}

export function validarFormularioEstanque(datos) {
  let resultado = {
    valido: true,
    tipoMensaje: "info",
    mensaje: "Rellene los datos requeridos.",
  };

  if (datos.codigo === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && datos.tipoEstanque === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && datos.largo === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && datos.ancho === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && datos.profundidad === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && datos.fechaSiembra === "") {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (resultado.valido === true && Number(datos.densidadSiembra) <= 0) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  if (
    resultado.valido === true &&
    datos.tieneAireadores === "si" &&
    datos.codigoAireador === ""
  ) {
    resultado = {
      valido: false,
      tipoMensaje: "danger",
      mensaje: "Rellene los datos requeridos.",
    };
  }

  return resultado;
}

export function construirNuevoEstanque(datos) {
  return {
    id: String(Date.now()),
    finca: "Finca La Reina",
    codigo: datos.codigo,
    estado: datos.estado,
    tipoEstanque: datos.tipoEstanque,
    largo: datos.largo,
    ancho: datos.ancho,
    profundidad: datos.profundidad,
    fuenteAgua: datos.fuenteAgua,
    especie: datos.especie,
    fechaSiembra: datos.fechaSiembra,
    fechaInicioEngorde: datos.fechaInicioEngorde,
    fechaMantenimiento: datos.fechaMantenimiento,
    densidadSiembra: datos.densidadSiembra,
    precria: datos.precria,
    metodoAlimentacion: datos.metodoAlimentacion,
    proveedorAlimento: datos.proveedorAlimento,
    numeroAireadores: datos.numeroAireadores,
    tieneAireadores: datos.tieneAireadores,
    codigoAireador: datos.codigoAireador,
    estanqueAireador: obtenerEstanqueAireador(
      datos.tieneAireadores,
      datos.codigo,
      "Finca La Reina",
    ),
    tieneAlimentadorAutomatico: datos.tieneAlimentadorAutomatico,
  };
}

export function construirEstanqueEditado(datos, params) {
  return {
    id: obtenerParametro(params.id, String(Date.now())),
    finca: obtenerParametro(params.finca, "Finca La Reina"),
    codigo: datos.codigo,
    estado: datos.estado,
    tipoEstanque: datos.tipoEstanque,
    largo: datos.largo,
    ancho: datos.ancho,
    profundidad: datos.profundidad,
    fuenteAgua: datos.fuenteAgua,
    especie: datos.especie,
    fechaSiembra: datos.fechaSiembra,
    fechaInicioEngorde: datos.fechaInicioEngorde,
    fechaMantenimiento: datos.fechaMantenimiento,
    densidadSiembra: datos.densidadSiembra,
    precria: datos.precria,
    metodoAlimentacion: datos.metodoAlimentacion,
    proveedorAlimento: datos.proveedorAlimento,
    numeroAireadores: datos.numeroAireadores,
    tieneAireadores: datos.tieneAireadores,
    codigoAireador: datos.codigoAireador,
    estanqueAireador: obtenerEstanqueAireador(
      datos.tieneAireadores,
      datos.codigo,
      obtenerParametro(params.finca, "Finca La Reina"),
    ),
    tieneAlimentadorAutomatico: datos.tieneAlimentadorAutomatico,
  };
}

export function construirEstanqueDetalle(estanqueEncontrado, params) {
  const numeroAireadores = obtenerValor(
    estanqueEncontrado,
    params,
    "numeroAireadores",
    "0",
  );

  const tieneAireadores = obtenerTieneAireadoresInicial(
    obtenerValor(estanqueEncontrado, params, "tieneAireadores", ""),
    numeroAireadores,
  );

  return {
    id: obtenerValor(estanqueEncontrado, params, "id", ""),
    finca: obtenerValor(estanqueEncontrado, params, "finca", "Finca La Reina"),
    codigo: obtenerValor(estanqueEncontrado, params, "codigo", ""),
    estado: obtenerValor(estanqueEncontrado, params, "estado", "Activo"),
    tipoEstanque: obtenerValor(
      estanqueEncontrado,
      params,
      "tipoEstanque",
      "No registrado",
    ),
    largo: obtenerValor(estanqueEncontrado, params, "largo", "0"),
    ancho: obtenerValor(estanqueEncontrado, params, "ancho", "0"),
    profundidad: obtenerValor(
      estanqueEncontrado,
      params,
      "profundidad",
      "0",
    ),
    fuenteAgua: obtenerValor(
      estanqueEncontrado,
      params,
      "fuenteAgua",
      "No registrado",
    ),
    especie: obtenerValor(
      estanqueEncontrado,
      params,
      "especie",
      "litopenaeus_vannamei",
    ),
    fechaSiembra: obtenerValor(
      estanqueEncontrado,
      params,
      "fechaSiembra",
      "No registrada",
    ),
    fechaInicioEngorde: obtenerValor(
      estanqueEncontrado,
      params,
      "fechaInicioEngorde",
      "No registrada",
    ),
    fechaMantenimiento: obtenerValor(
      estanqueEncontrado,
      params,
      "fechaMantenimiento",
      "No registrada",
    ),
    densidadSiembra: obtenerValor(
      estanqueEncontrado,
      params,
      "densidadSiembra",
      "0",
    ),
    precria: obtenerValor(
      estanqueEncontrado,
      params,
      "precria",
      "No registrado",
    ),
    metodoAlimentacion: obtenerValor(
      estanqueEncontrado,
      params,
      "metodoAlimentacion",
      "No registrado",
    ),
    proveedorAlimento: obtenerValor(
      estanqueEncontrado,
      params,
      "proveedorAlimento",
      "No registrado",
    ),
    numeroAireadores: numeroAireadores,
    tieneAireadores: tieneAireadores,
    codigoAireador: obtenerValor(
      estanqueEncontrado,
      params,
      "codigoAireador",
      "No asignado",
    ),
    estanqueAireador: obtenerValor(
      estanqueEncontrado,
      params,
      "estanqueAireador",
      "No asignado",
    ),
    tieneAlimentadorAutomatico: obtenerValor(
      estanqueEncontrado,
      params,
      "tieneAlimentadorAutomatico",
      "No registrado",
    ),
  };
}

export function obtenerValoresInicialesEditar(params) {
  return {
    codigo: obtenerParametro(params.codigo, "EST-01"),
    estado: obtenerParametro(params.estado, "activo"),
    tipoEstanque: obtenerParametro(params.tipoEstanque, ""),
    largo: obtenerParametro(params.largo, ""),
    ancho: obtenerParametro(params.ancho, ""),
    profundidad: obtenerParametro(params.profundidad, ""),
    fuenteAgua: obtenerParametro(params.fuenteAgua, ""),
    especie: obtenerParametro(params.especie, "litopenaeus_vannamei"),
    fechaSiembra: obtenerParametro(params.fechaSiembra, getCurrentDate()),
    fechaInicioEngorde: obtenerParametro(
      params.fechaInicioEngorde,
      getCurrentDate(),
    ),
    fechaMantenimiento: obtenerParametro(
      params.fechaMantenimiento,
      getCurrentDate(),
    ),
    densidadSiembra: obtenerParametro(params.densidadSiembra, "12"),
    precria: obtenerParametro(params.precria, ""),
    metodoAlimentacion: obtenerParametro(params.metodoAlimentacion, ""),
    proveedorAlimento: obtenerParametro(params.proveedorAlimento, "Biomar"),
    numeroAireadores: obtenerParametro(params.numeroAireadores, "0"),
    tieneAireadores: obtenerParametro(params.tieneAireadores, "no"),
    codigoAireador: obtenerParametro(params.codigoAireador, ""),
    tieneAlimentadorAutomatico: obtenerParametro(
      params.tieneAlimentadorAutomatico,
      "",
    ),
  };
}

export function obtenerValorInfo(value) {
  let valorFinal = value;

  if (value === "" || value === undefined || value === null) {
    valorFinal = "No registrado";
  }

  return valorFinal;
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
