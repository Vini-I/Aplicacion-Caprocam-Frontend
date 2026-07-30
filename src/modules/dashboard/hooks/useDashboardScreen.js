/**
 * ============================================================
 * HOOK: useDashboardScreen
 * ============================================================
 *
 * Descripcion:
 * Maneja el estado, la carga de datos, las alertas y la
 * navegacion del Dashboard general.
 *
 * Todos los modulos operativos se cargan desde backend.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import {
  adaptarAlimentacionesDashboard,
  adaptarEnfermedadesDashboard,
  adaptarEquiposDashboard,
  adaptarInventarioDashboard,
  adaptarParasitologiasDashboard,
  adaptarSiembrasDashboard,
  cargarAlimentacionesDashboard,
  cargarEnfermedadesDashboard,
  cargarEquiposDashboard,
  cargarFincasYEstanquesDashboard,
  cargarInventarioDashboard,
  cargarParasitologiasDashboard,
  cargarResumenEnfermedadesDashboard,
  cargarResumenParasitologiasDashboard,
  cargarSiembrasDashboard,
} from "../services/DashboardApiService";

import {
  construirAlertasOperativas,
  descartarAlerta,
  filtrarAlertasDescartadas,
  obtenerAlertasDescartadas,
} from "../../alertas/services/AlertasServices";

import {
  construirFincasDashboard,
  obtenerAlimentacionSemanal,
  obtenerMortalidadTotal,
  obtenerResumenEnfermedadesVacio,
  obtenerResumenParasitologiaVacio,
  obtenerTotalCasosSanitarios,
  obtenerUltimosRegistros,
} from "../services/DashboardService";

/*
============================================================
FUNCIONES INTERNAS
============================================================
*/

function obtenerDetalleError(error) {
  let detalle = "Error desconocido.";

  if (
    error !== undefined &&
    error !== null
  ) {
    if (
      error.message !== undefined &&
      error.message !== null
    ) {
      detalle = error.message;
    }

    if (
      error.response !== undefined &&
      error.response !== null &&
      error.response.data !== undefined &&
      error.response.data !== null
    ) {
      detalle = error.response.data;
    }
  }

  return detalle;
}

function obtenerListaSegura(valor) {
  if (Array.isArray(valor) === true) {
    return valor;
  }

  return [];
}

/*
============================================================
HOOK PRINCIPAL
============================================================
*/

export default function useDashboardScreen() {
  const router = useRouter();
  const dimensiones = useWindowDimensions();

  /*
  ==========================================================
  ESTADO DE INTERFAZ
  ==========================================================
  */

  const [
    selectedCard,
    setSelectedCard,
  ] = useState(null);

  const [
    alertasDescartadas,
    setAlertasDescartadas,
  ] = useState([]);

  const [
    alertasAbiertas,
    setAlertasAbiertas,
  ] = useState({
    critica: true,
    advertencia: true,
    info: false,
  });

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    errorCarga,
    setErrorCarga,
  ] = useState("");

  /*
  ==========================================================
  ESTADO DE DATOS CRUDOS
  ==========================================================
  */

  const [
    fincasData,
    setFincasData,
  ] = useState([]);

  const [
    estanquesData,
    setEstanquesData,
  ] = useState([]);

  const [
    alimentacionesData,
    setAlimentacionesData,
  ] = useState([]);

  const [
    siembrasData,
    setSiembrasData,
  ] = useState([]);

  const [
    inventarioData,
    setInventarioData,
  ] = useState([]);

  const [
    equiposRaw,
    setEquiposRaw,
  ] = useState([]);

  const [
    enfermedadesRaw,
    setEnfermedadesRaw,
  ] = useState([]);

  const [
    parasitologiasRaw,
    setParasitologiasRaw,
  ] = useState([]);

  const [
    resumenEnfermedades,
    setResumenEnfermedades,
  ] = useState(
    obtenerResumenEnfermedadesVacio(),
  );

  const [
    resumenParasitologia,
    setResumenParasitologia,
  ] = useState(
    obtenerResumenParasitologiaVacio(),
  );

  /*
  ==========================================================
  DATOS ADAPTADOS
  ==========================================================
  */

  const alimentacionesSeguras = useMemo(
    function () {
      return adaptarAlimentacionesDashboard(
        alimentacionesData,
        fincasData,
        estanquesData,
      );
    },
    [
      alimentacionesData,
      fincasData,
      estanquesData,
    ],
  );

  const siembrasSeguras = useMemo(
    function () {
      return adaptarSiembrasDashboard(
        siembrasData,
        fincasData,
        estanquesData,
      );
    },
    [
      siembrasData,
      fincasData,
      estanquesData,
    ],
  );

  const productosInventario = useMemo(
    function () {
      return adaptarInventarioDashboard(
        inventarioData,
      );
    },
    [
      inventarioData,
    ],
  );

  const equiposData = useMemo(
    function () {
      return adaptarEquiposDashboard(
        equiposRaw,
        fincasData,
        estanquesData,
      );
    },
    [
      equiposRaw,
      fincasData,
      estanquesData,
    ],
  );

  const registrosEnfermedades = useMemo(
    function () {
      return adaptarEnfermedadesDashboard(
        enfermedadesRaw,
        fincasData,
        estanquesData,
      );
    },
    [
      enfermedadesRaw,
      fincasData,
      estanquesData,
    ],
  );

  const registrosParasitologia = useMemo(
    function () {
      return adaptarParasitologiasDashboard(
        parasitologiasRaw,
        fincasData,
        estanquesData,
      );
    },
    [
      parasitologiasRaw,
      fincasData,
      estanquesData,
    ],
  );

  /*
  ==========================================================
  DATOS CALCULADOS
  ==========================================================
  */

  const fincasDashboard = useMemo(
    function () {
      return construirFincasDashboard(
        fincasData,
        estanquesData,
      );
    },
    [
      fincasData,
      estanquesData,
    ],
  );

  const alimentacionSemanal = useMemo(
    function () {
      return obtenerAlimentacionSemanal(
        alimentacionesSeguras,
      );
    },
    [
      alimentacionesSeguras,
    ],
  );

  const totalCasosSanitarios = useMemo(
    function () {
      return obtenerTotalCasosSanitarios(
        resumenEnfermedades,
        resumenParasitologia,
      );
    },
    [
      resumenEnfermedades,
      resumenParasitologia,
    ],
  );

  const totalMortalidad = useMemo(
    function () {
      return obtenerMortalidadTotal(
        resumenEnfermedades,
      );
    },
    [
      resumenEnfermedades,
    ],
  );

  const alertasBase = useMemo(
    function () {
      return construirAlertasOperativas({
        productosInventario:
          productosInventario,
        siembras:
          siembrasSeguras,
        alimentaciones:
          alimentacionesSeguras,
        estanques:
          estanquesData,
        equipos:
          equiposData,
        registrosEnfermedades:
          registrosEnfermedades,
        registrosParasitologia:
          registrosParasitologia,
      });
    },
    [
      productosInventario,
      siembrasSeguras,
      alimentacionesSeguras,
      estanquesData,
      equiposData,
      registrosEnfermedades,
      registrosParasitologia,
    ],
  );

  const alertasDashboard = useMemo(
    function () {
      const alertasFiltradas =
        filtrarAlertasDescartadas(
          alertasBase,
          alertasDescartadas,
        );

      return alertasFiltradas.slice(
        0,
        10,
      );
    },
    [
      alertasBase,
      alertasDescartadas,
    ],
  );

  const ultimosRegistros = useMemo(
    function () {
      return obtenerUltimosRegistros(
        alimentacionesSeguras,
        siembrasSeguras,
        registrosEnfermedades,
        registrosParasitologia,
      );
    },
    [
      alimentacionesSeguras,
      siembrasSeguras,
      registrosEnfermedades,
      registrosParasitologia,
    ],
  );

  let isTablet = false;

  if (dimensiones.width >= 720) {
    isTablet = true;
  }

  /*
  ==========================================================
  MANEJO DE CARDS
  ==========================================================
  */

  const manejarSeleccionCard = useCallback(
    function (cardId) {
      setSelectedCard(
        function (actual) {
          if (actual === cardId) {
            return null;
          }

          return cardId;
        },
      );
    },
    [],
  );

  /*
  ==========================================================
  NAVEGACION
  ==========================================================
  */

  const irAMareas = useCallback(
    function () {
      router.push(
        "/mareas/",
      );
    },
    [
      router,
    ],
  );

  const irAAlertas = useCallback(
    function () {
      router.push(
        "/alertas",
      );
    },
    [
      router,
    ],
  );

  /*
  ==========================================================
  MANEJO DE ALERTAS
  ==========================================================
  */

  const alternarAlertas = useCallback(
    function (tipo) {
      setAlertasAbiertas(
        function (actual) {
          return {
            ...actual,
            [tipo]: !actual[tipo],
          };
        },
      );
    },
    [],
  );

  const descartarAlertaDashboard = useCallback(
    async function (id) {
      try {
        const ids = await descartarAlerta(id);

        setAlertasDescartadas(
          obtenerListaSegura(ids),
        );
      } catch (error) {
        console.error(
          "Error descartando alerta:",
          obtenerDetalleError(error),
        );
      }
    },
    [],
  );

  /*
  ==========================================================
  CARGA DE DATOS
  ==========================================================
  */

  useEffect(
    function () {
      let componenteActivo = true;

      async function cargarFincasYEstanques() {
        try {
          const datos =
            await cargarFincasYEstanquesDashboard();

          if (componenteActivo === false) {
            return;
          }

          setFincasData(
            obtenerListaSegura(
              datos.fincas,
            ),
          );

          setEstanquesData(
            obtenerListaSegura(
              datos.estanques,
            ),
          );

          console.log(
            "Fincas reales:",
            datos.fincas,
          );

          console.log(
            "Estanques reales:",
            datos.estanques,
          );
        } catch (error) {
          if (componenteActivo === false) {
            return;
          }

          setErrorCarga(
            "No fue posible cargar fincas y estanques.",
          );

          console.error(
            "Error cargando fincas y estanques:",
            obtenerDetalleError(error),
          );
        }
      }

      async function cargarAlimentaciones() {
        try {
          const datos =
            await cargarAlimentacionesDashboard();

          if (componenteActivo === false) {
            return;
          }

          setAlimentacionesData(
            obtenerListaSegura(datos),
          );

          console.log(
            "Alimentaciones reales:",
            datos,
          );
        } catch (error) {
          console.error(
            "Error cargando alimentaciones:",
            obtenerDetalleError(error),
          );
        }
      }

      async function cargarSiembras() {
        try {
          const datos =
            await cargarSiembrasDashboard();

          if (componenteActivo === false) {
            return;
          }

          setSiembrasData(
            obtenerListaSegura(datos),
          );

          console.log(
            "Siembras reales:",
            datos,
          );
        } catch (error) {
          console.error(
            "Error cargando siembras:",
            obtenerDetalleError(error),
          );
        }
      }

      async function cargarInventario() {
        try {
          const datos =
            await cargarInventarioDashboard();

          if (componenteActivo === false) {
            return;
          }

          setInventarioData(
            obtenerListaSegura(datos),
          );

          console.log(
            "Inventario real:",
            datos,
          );
        } catch (error) {
          console.error(
            "Error cargando inventario:",
            obtenerDetalleError(error),
          );
        }
      }

      async function cargarEquipos() {
        try {
          const datos =
            await cargarEquiposDashboard();

          if (componenteActivo === false) {
            return;
          }

          setEquiposRaw(
            obtenerListaSegura(datos),
          );

          console.log(
            "Equipos reales:",
            datos,
          );
        } catch (error) {
          console.error(
            "Error cargando equipos:",
            obtenerDetalleError(error),
          );
        }
      }

      async function cargarEnfermedades() {
        try {
          const datos =
            await cargarEnfermedadesDashboard();

          const resumen =
            await cargarResumenEnfermedadesDashboard();

          if (componenteActivo === false) {
            return;
          }

          setEnfermedadesRaw(
            obtenerListaSegura(datos),
          );

          setResumenEnfermedades(
            resumen,
          );

          console.log(
            "Enfermedades reales:",
            datos,
          );

          console.log(
            "Resumen enfermedades:",
            resumen,
          );
        } catch (error) {
          console.error(
            "Error cargando enfermedades:",
            obtenerDetalleError(error),
          );
        }
      }

      async function cargarParasitologias() {
        try {
          const datos =
            await cargarParasitologiasDashboard();

          const resumen =
            await cargarResumenParasitologiasDashboard();

          if (componenteActivo === false) {
            return;
          }

          setParasitologiasRaw(
            obtenerListaSegura(datos),
          );

          setResumenParasitologia(
            resumen,
          );

          console.log(
            "Parasitologias reales:",
            datos,
          );

          console.log(
            "Resumen parasitologias:",
            resumen,
          );
        } catch (error) {
          console.error(
            "Error cargando parasitologias:",
            obtenerDetalleError(error),
          );
        }
      }

      async function cargarDescartadas() {
        try {
          const datos =
            await obtenerAlertasDescartadas();

          if (componenteActivo === false) {
            return;
          }

          setAlertasDescartadas(
            obtenerListaSegura(datos),
          );
        } catch (error) {
          console.error(
            "Error cargando alertas descartadas:",
            obtenerDetalleError(error),
          );
        }
      }

      async function iniciarCarga() {
        setCargando(true);
        setErrorCarga("");

        await Promise.allSettled([
          cargarFincasYEstanques(),
          cargarAlimentaciones(),
          cargarSiembras(),
          cargarInventario(),
          cargarEquipos(),
          cargarEnfermedades(),
          cargarParasitologias(),
          cargarDescartadas(),
        ]);

        if (componenteActivo === true) {
          setCargando(false);
        }
      }

      iniciarCarga();

      return function () {
        componenteActivo = false;
      };
    },
    [],
  );

  /*
  ==========================================================
  RETORNO
  ==========================================================
  */

  return {
    selectedCard: selectedCard,
    alertasAbiertas: alertasAbiertas,
    alertasDescartadas:
      alertasDescartadas,
    cargando: cargando,
    errorCarga: errorCarga,

    fincasData: fincasData,
    fincasDashboard: fincasDashboard,
    estanquesData: estanquesData,

    alimentaciones:
      alimentacionesSeguras,
    alimentacionSemanal:
      alimentacionSemanal,

    siembrasData: siembrasSeguras,
    productosInventario:
      productosInventario,
    equiposData: equiposData,

    registrosEnfermedades:
      registrosEnfermedades,
    registrosParasitologia:
      registrosParasitologia,

    resumenEnfermedades:
      resumenEnfermedades,
    resumenParasitologia:
      resumenParasitologia,

    totalCasosSanitarios:
      totalCasosSanitarios,
    totalMortalidad:
      totalMortalidad,

    alertasDashboard:
      alertasDashboard,
    ultimosRegistros:
      ultimosRegistros,

    isTablet: isTablet,

    manejarSeleccionCard:
      manejarSeleccionCard,
    irAMareas: irAMareas,
    irAAlertas: irAAlertas,
    alternarAlertas:
      alternarAlertas,
    descartarAlertaDashboard:
      descartarAlertaDashboard,
  };
}