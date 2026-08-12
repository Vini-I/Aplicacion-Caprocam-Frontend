/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: DashboardService.js
Autor: Gerald Andres Alfaro Solorzano
Fecha: 30/07/2026
Modulo: Dashboard
Descripcion:
Centraliza las peticiones HTTP utilizadas por el Dashboard.
//////////////////////////////////////////////////////////
*/

import api from "../../../api/api.js";

const RUTAS = {
  fincas: "/fincas",
  estanques: "/estanques",
  alimentaciones: "/alimentaciones",
  siembras: "/siembras",
  inventario: "/inventario",
  equipos: "/equipos",
  enfermedades: "/enfermedades",
  resumenEnfermedades: "/enfermedades/resumen",
  parasitologias: "/parasitologias",
  resumenParasitologias: "/parasitologias/resumen",
  fisicoQuimicos: "/lecturasFisicoQuimicas",
};

function construirErrorHttp(error, mensajeGenerico) {
  const status = error?.response?.status;
  const mensaje =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;

  if (status === 500) {
    return new Error(mensajeGenerico);
  }

  if (status) {
    const err = new Error(mensaje || mensajeGenerico);
    err.status = status;
    return err;
  }

  return new Error(mensajeGenerico);
}

function obtenerContenido(response) {
  return response?.data?.data !== undefined ? response.data.data : response?.data ?? null;
}

function obtenerLista(response) {
  const contenido = obtenerContenido(response);
  return Array.isArray(contenido) ? contenido : [];
}

function obtenerObjeto(response) {
  const contenido = obtenerContenido(response);
  return contenido && typeof contenido === "object" && !Array.isArray(contenido) ? contenido : {};
}

async function getFincas() {
  try {
    const response = await api.get(RUTAS.fincas);
    return obtenerLista(response);
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener fincas");
  }
}

async function getEstanques() {
  try {
    const response = await api.get(RUTAS.estanques);
    return obtenerLista(response);
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener estanques");
  }
}

async function getAlimentaciones() {
  try {
    const response = await api.get(RUTAS.alimentaciones);
    return obtenerLista(response);
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener alimentaciones");
  }
}

async function getSiembras() {
  try {
    const response = await api.get(RUTAS.siembras);
    return obtenerLista(response);
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener siembras");
  }
}

async function getInventario() {
  try {
    const response = await api.get(RUTAS.inventario);
    return obtenerLista(response);
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener inventario");
  }
}

async function getEquipos() {
  try {
    const response = await api.get(RUTAS.equipos);
    return obtenerLista(response);
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener equipos");
  }
}

async function getEnfermedades() {
  try {
    const response = await api.get(RUTAS.enfermedades);
    return obtenerLista(response);
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener enfermedades");
  }
}

async function getResumenEnfermedades() {
  try {
    const response = await api.get(RUTAS.resumenEnfermedades);
    return obtenerObjeto(response);
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener el resumen de enfermedades");
  }
}

async function getParasitologias() {
  try {
    const response = await api.get(RUTAS.parasitologias);
    return obtenerLista(response);
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener parasitologías");
  }
}

async function getResumenParasitologias() {
  try {
    const response = await api.get(RUTAS.resumenParasitologias);
    return obtenerObjeto(response);
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener el resumen de parasitologías");
  }
}

async function getFisicoQuimicos() {
  try {
    const response = await api.get(RUTAS.fisicoQuimicos);
    return obtenerLista(response);
  } catch (error) {
    throw construirErrorHttp(
      error,
      "Error al obtener lecturas físico-químicas"
    );
  }
}

export default {
  getFincas,
  getEstanques,
  getAlimentaciones,
  getSiembras,
  getInventario,
  getEquipos,
  getEnfermedades,
  getResumenEnfermedades,
  getParasitologias,
  getResumenParasitologias,
  getFisicoQuimicos,
};