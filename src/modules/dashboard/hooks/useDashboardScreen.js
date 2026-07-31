/**
 * ============================================================
 * HOOK: DASHBOARD SCREEN
 * ============================================================
 *
 * Centraliza carga de datos, seleccion de cards, alertas y
 * navegacion del DashboardScreen.
 */

import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { fincas as fincasModulo } from "../../finca/screens/FincaData";
import { estanques as estanquesModulo } from "../../mantCrecimiento/services/EstanqueData";
import { obtenerSiembras } from "../../siembra/services/SiembraService";
import useAlimentacion from "../../alimentacion/hooks/useAlimentacion";
import { getProductosInventario } from "../../inventarios/services/InventarioService";
import { EQUIPOS_MOCK } from "../../mantEquipo/services/mantEquipoService";
import enfermedadesService from "../../enfermedades/services/EnfermedadesService";
import parasitologiaService from "../../parasitologia/services/ParasitologiaService";
import {
  construirAlertasOperativas,
  descartarAlerta,
  filtrarAlertasDescartadas,
  obtenerAlertasDescartadas,
} from "../../alertas/services/AlertasServices.js";
import {
  construirFincasDashboard,
  obtenerAlimentacionSemanal,
  obtenerMortalidadTotal,
  obtenerResumenEnfermedadesVacio,
  obtenerResumenParasitologiaVacio,
  obtenerTotalCasosSanitarios,
  obtenerUltimosRegistros,
} from "../services/DashboardService";

export default function useDashboardScreen() {
  const router = useRouter();
  const dimensiones = useWindowDimensions();

  const [selectedCard, setSelectedCard] = useState(null);
  const [alertasDescartadas, setAlertasDescartadas] = useState([]);
  const [alertasAbiertas, setAlertasAbiertas] = useState({
    critica: true,
    advertencia: true,
    info: false,
  });
  const [fincasData, setFincasData] = useState([]);
  const [estanquesData, setEstanquesData] = useState([]);
  const [siembrasData, setSiembrasData] = useState([]);
  const [productosInventario, setProductosInventario] = useState([]);
  const [equiposData, setEquiposData] = useState([]);
  const [registrosEnfermedades, setRegistrosEnfermedades] = useState([]);
  const [registrosParasitologia, setRegistrosParasitologia] = useState([]);
  const [resumenEnfermedades, setResumenEnfermedades] = useState(
    obtenerResumenEnfermedadesVacio(),
  );
  const [resumenParasitologia, setResumenParasitologia] = useState(
    obtenerResumenParasitologiaVacio(),
  );

  const { alimentaciones, recargar } = useAlimentacion();

  let isTablet = false;

  if (dimensiones.width >= 720) {
    isTablet = true;
  }

  const fincasDashboard = construirFincasDashboard(fincasData, estanquesData);
  const alimentacionSemanal = obtenerAlimentacionSemanal(alimentaciones);

  const totalCasosSanitarios = obtenerTotalCasosSanitarios(
    resumenEnfermedades,
    resumenParasitologia,
  );

  const totalMortalidad = obtenerMortalidadTotal(resumenEnfermedades);

  const alertasBase = construirAlertasOperativas({
    productosInventario: productosInventario,
    siembras: siembrasData,
    alimentaciones: alimentaciones,
    estanques: estanquesData,
    equipos: equiposData,
    registrosEnfermedades: registrosEnfermedades,
    registrosParasitologia: registrosParasitologia,
  });

  const alertasDashboard = filtrarAlertasDescartadas(
    alertasBase,
    alertasDescartadas,
  ).slice(0, 10);

  const ultimosRegistros = obtenerUltimosRegistros(
    alimentaciones,
    siembrasData,
    registrosEnfermedades,
    registrosParasitologia,
  );

  function manejarSeleccionCard(cardId) {
    if (selectedCard === cardId) {
      setSelectedCard(null);
    }

    if (selectedCard !== cardId) {
      setSelectedCard(cardId);
    }
  }

  function irAMareas() {
    router.push("/mareas/");
  }

  function irAAlertas() {
    router.push("/alertas");
  }

  function alternarAlertas(tipo) {
    setAlertasAbiertas(function (actual) {
      return {
        ...actual,
        [tipo]: !actual[tipo],
      };
    });
  }

  async function descartarAlertaDashboard(id) {
    const ids = await descartarAlerta(id);
    setAlertasDescartadas(ids);
  }

  useEffect(function () {
    let activo = true;
    let intervalo = null;

    async function cargarDatos() {
      const enfermedades = await enfermedadesService.getAll();
      const resumenEnfermedad = await enfermedadesService.getResumenDashboard();

      const parasitos = await parasitologiaService.getAll();
      const resumenParasitos = await parasitologiaService.getResumenDashboard();

      if (activo === true) {
        setFincasData([...fincasModulo]);
        setEstanquesData([...estanquesModulo]);
        setSiembrasData(obtenerSiembras());
        setProductosInventario(getProductosInventario());
        setEquiposData([...EQUIPOS_MOCK]);
        setRegistrosEnfermedades(enfermedades);
        setResumenEnfermedades(resumenEnfermedad);
        setRegistrosParasitologia(parasitos);
        setResumenParasitologia(resumenParasitos);
      }
    }

    async function cargarDescartadas() {
      const ids = await obtenerAlertasDescartadas();

      if (activo === true) {
        setAlertasDescartadas(ids);
      }
    }

    recargar();
    cargarDatos();
    cargarDescartadas();

    intervalo = setInterval(function () {
      recargar();
      cargarDatos();
    }, 5000);

    return function () {
      activo = false;

      if (intervalo !== null) {
        clearInterval(intervalo);
      }
    };
  }, []);

  return {
    selectedCard,
    alertasAbiertas,
    fincasDashboard,
    estanquesData,
    registrosEnfermedades,
    registrosParasitologia,
    resumenEnfermedades,
    resumenParasitologia,
    alimentacionSemanal,
    totalCasosSanitarios,
    totalMortalidad,
    alertasDashboard,
    ultimosRegistros,
    isTablet,
    manejarSeleccionCard,
    irAMareas,
    irAAlertas,
    alternarAlertas,
    descartarAlertaDashboard,
  };
}
