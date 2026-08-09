/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: useDashboard.js
Autor: Gerald Andres Alfaro Solorzano
Fecha: 30/07/2026
Modulo: Dashboard
Descripcion:
Centraliza la carga y el estado de los datos utilizados
por el Dashboard.
//////////////////////////////////////////////////////////
*/

import { useCallback, useState } from "react";

import { useError } from "../../../shared/context/ErrorContext";
import DashboardService from "../services/DashboardService";
import { adaptarDatosDashboard } from "../utils/DashboardAdapter";
import {
  obtenerResumenEnfermedadesVacio,
  obtenerResumenParasitologiasVacio,
} from "../utils/DashboardUtils";

function crearDatosIniciales() {
  return {
    fincas: [],
    estanques: [],
    alimentaciones: [],
    siembras: [],
    inventario: [],
    equipos: [],
    enfermedades: [],
    resumenEnfermedades: obtenerResumenEnfermedadesVacio(),
    parasitologias: [],
    resumenParasitologias: obtenerResumenParasitologiasVacio(),
    fisicoQuimicos: [],
  };
}

const PETICIONES_DASHBOARD = [
  {
    clave: "fincas",
    cargar: DashboardService.getFincas,
    respaldo: [],
  },
  {
    clave: "estanques",
    cargar: DashboardService.getEstanques,
    respaldo: [],
  },
  {
    clave: "alimentaciones",
    cargar: DashboardService.getAlimentaciones,
    respaldo: [],
  },
  {
    clave: "siembras",
    cargar: DashboardService.getSiembras,
    respaldo: [],
  },
  {
    clave: "inventario",
    cargar: DashboardService.getInventario,
    respaldo: [],
    mostrarError: false,
  },
  {
    clave: "equipos",
    cargar: DashboardService.getEquipos,
    respaldo: [],
  },
  {
    clave: "enfermedades",
    cargar: DashboardService.getEnfermedades,
    respaldo: [],
  },
  {
    clave: "resumenEnfermedades",
    cargar: DashboardService.getResumenEnfermedades,
    respaldo: {},
  },
  {
    clave: "parasitologias",
    cargar: DashboardService.getParasitologias,
    respaldo: [],
  },
  {
    clave: "resumenParasitologias",
    cargar: DashboardService.getResumenParasitologias,
    respaldo: {},
  },
  {
    clave: "fisicoQuimicos",
    cargar: DashboardService.getFisicoQuimicos,
    respaldo: [],
  },
];

export default function useDashboard() {
  const { mostrarError } = useError();

  const [datos, setDatos] = useState(crearDatosIniciales);
  const [loading, setLoading] = useState(false);

  const cargarDatos = useCallback(async function () {
    try {
      setLoading(true);

      const resultados = await Promise.allSettled(
        PETICIONES_DASHBOARD.map(function (peticion) {
          return peticion.cargar();
        }),
      );

      const datosBackend = {};
      let primerError = null;

      PETICIONES_DASHBOARD.forEach(function (peticion, index) {
        const resultado = resultados[index];

        datosBackend[peticion.clave] = resultado.status === "fulfilled" ? resultado.value : peticion.respaldo;
        if (
          primerError === null &&
          resultado.status === "rejected" &&
          peticion.mostrarError !== false
        ) {
          primerError = resultado.reason;
        }
      });

      setDatos(adaptarDatosDashboard(datosBackend));

      if (primerError !== null) {
        mostrarError(primerError);
      }

      return primerError === null;
    } catch (error) {
      mostrarError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [mostrarError]);

  return {
    ...datos,
    loading,
    recargar: cargarDatos,
  };
}