/**
 * ============================================================
 * SERVICE: AIREADORES PARA ESTANQUES
 * ============================================================
 *
 * Centraliza los datos necesarios para asignar aireadores
 * existentes a un estanque.
 *
 * Actualmente usa los equipos mock del modulo de mantenimiento
 * de equipo. Cuando exista backend, este archivo se puede cambiar
 * por una llamada al endpoint real de equipos/aireadores.
 */

import { EQUIPOS_MOCK } from "../../mantEquipo/services/mantEquipoService.js";

function esAireador(equipo) {
  let resultado = false;

  if (equipo.tipo === "Aireación") {
    resultado = true;
  }

  if (equipo.tipo === "aireacion") {
    resultado = true;
  }

  return resultado;
}

export function obtenerOpcionesAireadores() {
  const opciones = [];

  for (let index = 0; index < EQUIPOS_MOCK.length; index++) {
    const equipo = EQUIPOS_MOCK[index];

    if (esAireador(equipo) === true) {
      opciones.push({
        label: `${equipo.serie} - ${equipo.nombre}`,
        value: equipo.serie,
      });
    }
  }

  return opciones;
}

export function obtenerCodigoAireadorDefault() {
  const opciones = obtenerOpcionesAireadores();
  let codigo = "";

  if (opciones.length > 0) {
    codigo = opciones[0].value;
  }

  return codigo;
}

export function obtenerTieneAireadoresInicial(valor, numeroAireadores) {
  let resultado = "no";

  if (valor === "si") {
    resultado = "si";
  }

  if (valor === "no") {
    resultado = "no";
  }

  if (
    (valor === undefined || valor === null || valor === "") &&
    Number(numeroAireadores) > 0
  ) {
    resultado = "si";
  }

  return resultado;
}

export function obtenerCodigoAireadorInicial(valor, tieneAireadores) {
  let codigo = "";

  if (valor !== undefined && valor !== null && valor !== "") {
    codigo = String(valor);
  }

  if (codigo === "" && tieneAireadores === "si") {
    codigo = obtenerCodigoAireadorDefault();
  }

  return codigo;
}

export function obtenerDescripcionEstanqueSeleccionado(codigoEstanque, finca) {
  let descripcion = "";

  if (
    codigoEstanque !== undefined &&
    codigoEstanque !== null &&
    codigoEstanque !== ""
  ) {
    descripcion = `${codigoEstanque} - ${finca}`;
  }

  return descripcion;
}

export function obtenerEstanqueAireador(
  tieneAireadores,
  codigoEstanque,
  finca,
) {
  let descripcion = "";

  if (tieneAireadores === "si") {
    descripcion = obtenerDescripcionEstanqueSeleccionado(codigoEstanque, finca);
  }

  return descripcion;
}

export function obtenerOpcionesEstanqueSeleccionado(codigoEstanque, finca) {
  const opciones = [];
  const descripcion = obtenerDescripcionEstanqueSeleccionado(
    codigoEstanque,
    finca,
  );

  if (descripcion !== "") {
    opciones.push({
      label: descripcion,
      value: codigoEstanque,
    });
  }

  return opciones;
}

export function obtenerTextoSiNo(valor) {
  let texto = "No";

  if (valor === "si") {
    texto = "Si";
  }

  return texto;
}
