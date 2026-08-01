/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: useDashboardScreen.js
Autor: Gerald Andres Alfaro Solorzano
Fecha: 30/07/2026
Modulo: Dashboard
Descripcion:
Centraliza la logica de interfaz, calculos, alertas,
navegacion y actualizacion automatica del Dashboard.
//////////////////////////////////////////////////////////
*/

import { useCallback, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { useError } from "../../../shared/context/ErrorContext";
import { construirAlertasOperativas, descartarAlerta, filtrarAlertasDescartadas, obtenerAlertasDescartadas } from "../../alertas/services/AlertasServices";

import useDashboard from "./useDashboard";
import { construirFincasDashboard, obtenerAlimentacionSemanal, obtenerMortalidadTotal, obtenerTotalCasosSanitarios, obtenerUltimosRegistros } from "../utils/DashboardUtils";

const ALERTAS_ABIERTAS_INICIALES = {
  critica: true,
  advertencia: true,
  info: false,
};

export default function useDashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { mostrarError } = useError();

  const {
    fincas,
    estanques,
    alimentaciones,
    siembras,
    inventario,
    equipos,
    enfermedades,
    resumenEnfermedades,
    parasitologias,
    resumenParasitologias,
    fisicoQuimicos,
    loading,
    recargar,
  } = useDashboard();

  const [selectedCard, setSelectedCard] = useState(null);
  const [alertasAbiertas, setAlertasAbiertas] = useState(ALERTAS_ABIERTAS_INICIALES);
  const [alertasDescartadas, setAlertasDescartadas] = useState([]);

  const fincasDashboard = useMemo(function () {
    return construirFincasDashboard(fincas, estanques);
  }, [fincas, estanques]);

  const alimentacionSemanal = useMemo(function () {
    return obtenerAlimentacionSemanal(alimentaciones);
  }, [alimentaciones]);

  const totalCasosSanitarios = useMemo(function () {
    return obtenerTotalCasosSanitarios(resumenEnfermedades, resumenParasitologias);
  }, [resumenEnfermedades, resumenParasitologias]);

  const totalMortalidad = useMemo(function () {
    return obtenerMortalidadTotal(resumenEnfermedades);
  }, [resumenEnfermedades]);

  const alertasBase = useMemo(function () {
    return construirAlertasOperativas({
      productosInventario: inventario,
      siembras,
      alimentaciones,
      estanques,
      equipos,
      registrosEnfermedades: enfermedades,
      registrosParasitologia: parasitologias,
      registrosFisicoQuimicos: fisicoQuimicos,
    });
  }, [inventario, siembras, alimentaciones, estanques, equipos, enfermedades, parasitologias, fisicoQuimicos]);

  const alertasDashboard = useMemo(function () {
    return filtrarAlertasDescartadas(alertasBase, alertasDescartadas).slice(0, 10);
  }, [alertasBase, alertasDescartadas]);

  const ultimosRegistros = useMemo(function () {
    return obtenerUltimosRegistros(alimentaciones, siembras, enfermedades, parasitologias, fisicoQuimicos);
  }, [alimentaciones, siembras, enfermedades, parasitologias, fisicoQuimicos]);

  const cargarAlertasDescartadas = useCallback(async function () {
    try {
      const ids = await obtenerAlertasDescartadas();
      setAlertasDescartadas(Array.isArray(ids) ? ids : []);
    } catch (error) {
      mostrarError(error);
    }
  }, [mostrarError]);

  useFocusEffect(
    useCallback(function () {
      recargar();
      cargarAlertasDescartadas();
    }, [recargar, cargarAlertasDescartadas]),
  );

  const manejarSeleccionCard = useCallback(function (cardId) {
    setSelectedCard(function (cardActual) {
      return cardActual === cardId ? null : cardId;
    });
  }, []);

  const alternarAlertas = useCallback(function (tipo) {
    setAlertasAbiertas(function (estadoActual) {
      return {
        ...estadoActual,
        [tipo]: !estadoActual[tipo],
      };
    });
  }, []);

  const descartarAlertaDashboard = useCallback(async function (id) {
    try {
      const ids = await descartarAlerta(id);
      setAlertasDescartadas(Array.isArray(ids) ? ids : []);
    } catch (error) {
      mostrarError(error);
    }
  }, [mostrarError]);

  const irAAlertas = useCallback(function () {
    router.push("/alertas");
  }, [router]);

  return {
    selectedCard,
    alertasAbiertas,
    alertasDescartadas,
    cargando: loading,
    isTablet: width >= 720,

    fincasData: fincas,
    fincasDashboard,
    estanquesData: estanques,

    alimentaciones,
    alimentacionSemanal,
    siembrasData: siembras,
    productosInventario: inventario,
    equiposData: equipos,

    registrosEnfermedades: enfermedades,
    resumenEnfermedades,
    registrosParasitologia: parasitologias,
    resumenParasitologia: resumenParasitologias,
    registrosFisicoQuimicos: fisicoQuimicos,

    totalCasosSanitarios,
    totalMortalidad,
    alertasDashboard,
    ultimosRegistros,

    recargar,
    manejarSeleccionCard,
    alternarAlertas,
    descartarAlertaDashboard,
    irAAlertas,
  };
}