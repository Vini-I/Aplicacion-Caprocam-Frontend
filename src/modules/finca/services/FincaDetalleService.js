/**
 * ============================================================
 * SERVICE: FINCA DETALLE
 * ============================================================
 *
 * Funciones auxiliares para FincaDetalleScreen.
 */

import { estanques } from "../screens/EstanqueData";

export function obtenerDatoFinca(finca, campoNuevo, campoAnterior, respaldo) {
  let valor = respaldo;

  if (finca && finca[campoNuevo] !== undefined && finca[campoNuevo] !== null) {
    valor = finca[campoNuevo];
  }

  if (
    (valor === undefined || valor === null || valor === "") &&
    finca &&
    finca[campoAnterior] !== undefined &&
    finca[campoAnterior] !== null
  ) {
    valor = finca[campoAnterior];
  }

  if (valor === undefined || valor === null || valor === "") {
    valor = respaldo;
  }

  return valor;
}

export function buscarFincaPorId(fincas, id) {
  let fincaEncontrada = null;

  fincas.forEach(function (finca) {
    if (String(finca.id) === String(id)) {
      fincaEncontrada = finca;
    }

    if (String(finca.codigoCBO) === String(id)) {
      fincaEncontrada = finca;
    }

    if (String(finca.codigoInterno) === String(id)) {
      fincaEncontrada = finca;
    }
  });

  return fincaEncontrada;
}

export function obtenerEstanquesFinca(finca) {
  const resultado = [];

  if (!finca) {
    return resultado;
  }

  const nombreFinca = obtenerDatoFinca(finca, "nombreFinca", "nombre", "");

  estanques.forEach(function (estanque) {
    if (estanque.finca === nombreFinca) {
      resultado.push(estanque);
    }
  });

  return resultado;
}

export function eliminarEstanqueLocal(codigoEstanque) {
  let eliminado = false;

  for (let index = 0; index < estanques.length; index++) {
    if (estanques[index].codigo === codigoEstanque) {
      estanques.splice(index, 1);
      eliminado = true;
      break;
    }
  }

  return eliminado;
}

export function detenerEvento(event) {
  if (event && typeof event.stopPropagation === "function") {
    event.stopPropagation();
  }
}
