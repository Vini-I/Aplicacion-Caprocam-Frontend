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

import api from "../../../api/api";

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

async function consultarLista(ruta) {
  const response = await api.get(ruta);
  return obtenerLista(response);
}

async function consultarObjeto(ruta) {
  const response = await api.get(ruta);
  return obtenerObjeto(response);
}

async function getFincas() {
  return consultarLista(RUTAS.fincas);
}

async function getEstanques() {
  return consultarLista(RUTAS.estanques);
}

async function getAlimentaciones() {
  return consultarLista(RUTAS.alimentaciones);
}

async function getSiembras() {
  return consultarLista(RUTAS.siembras);
}

async function getInventario() {
  return consultarLista(RUTAS.inventario);
}

async function getEquipos() {
  return consultarLista(RUTAS.equipos);
}

async function getEnfermedades() {
  return consultarLista(RUTAS.enfermedades);
}

async function getResumenEnfermedades() {
  return consultarObjeto(RUTAS.resumenEnfermedades);
}

async function getParasitologias() {
  return consultarLista(RUTAS.parasitologias);
}

async function getResumenParasitologias() {
  return consultarObjeto(RUTAS.resumenParasitologias);
}

async function getFisicoQuimicos() {
  return consultarLista(RUTAS.fisicoQuimicos);
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