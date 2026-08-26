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

import { useCallback, useMemo, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { useError } from "../../../shared/context/ErrorContext.js";
import {
  construirAlertasOperativas,
  descartarAlerta,
  filtrarAlertasDescartadas,
  obtenerAlertasDescartadas,
} from "../../alertas/services/AlertasServices.js";

import useDashboard from "./useDashboard.js";
import {
  construirFincasDashboard,
  obtenerAlimentacionSemanal,
  obtenerTotalCasosSanitarios,
  obtenerUltimosRegistros,
} from "../utils/DashboardUtils.js";

const ALERTAS_ABIERTAS_INICIALES = {
  critica: true,
  advertencia: true,
  info: false,
};

export default function useDashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { mostrarError } = useError();
  const mostrarErrorRef = useRef(mostrarError);
  mostrarErrorRef.current = mostrarError;

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
  const [alertasAbiertas, setAlertasAbiertas] = useState(
    ALERTAS_ABIERTAS_INICIALES,
  );
  const [alertasDescartadas, setAlertasDescartadas] = useState([]);

  const fincasDashboard = useMemo(
    function () {
      return construirFincasDashboard(fincas, estanques);
    },
    [fincas, estanques],
  );

  const alimentacionSemanal = useMemo(
    function () {
      return obtenerAlimentacionSemanal(alimentaciones);
    },
    [alimentaciones],
  );

  const totalCasosSanitarios = useMemo(
    function () {
      return obtenerTotalCasosSanitarios(
        resumenEnfermedades,
        resumenParasitologias,
      );
    },
    [resumenEnfermedades, resumenParasitologias],
  );

  const alertasBase = useMemo(
    function () {
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
    },
    [
      inventario,
      siembras,
      alimentaciones,
      estanques,
      equipos,
      enfermedades,
      parasitologias,
      fisicoQuimicos,
    ],
  );

  const alertasDashboard = useMemo(
    function () {
      return filtrarAlertasDescartadas(alertasBase, alertasDescartadas).slice(
        0,
        10,
      );
    },
    [alertasBase, alertasDescartadas],
  );

  const ultimosRegistros = useMemo(
    function () {
      return obtenerUltimosRegistros(
        alimentaciones,
        siembras,
        enfermedades,
        parasitologias,
        fisicoQuimicos,
      );
    },
    [alimentaciones, siembras, enfermedades, parasitologias, fisicoQuimicos],
  );

  const cargarAlertasDescartadas = useCallback(async function () {
    try {
      const ids = await obtenerAlertasDescartadas();
      setAlertasDescartadas(Array.isArray(ids) ? ids : []);
    } catch (error) {
      mostrarErrorRef.current(error);
    }
  }, []);

  useFocusEffect(
    useCallback(
      function () {
        recargar();
        cargarAlertasDescartadas();
      },
      [recargar, cargarAlertasDescartadas],
    ),
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

  const descartarAlertaDashboard = useCallback(
    async function (id) {
      try {
        const ids = await descartarAlerta(id);
        setAlertasDescartadas(Array.isArray(ids) ? ids : []);
      } catch (error) {
        mostrarError(error);
      }
    },
    [mostrarError],
  );

  const irAFinca = useCallback(
    function (finca) {
      if (!finca?.id) return;

      router.push({
        pathname: "/finca/detalle",
        params: {
          id: finca.id,
        },
      });
    },
    [router],
  );

  const irAEstanque = useCallback(
    function (estanque) {
      if (!estanque?.id) return;

      router.push({
        pathname: "/finca/detalleEstanque",
        params: {
          id: estanque.id,
          fincaNombre:
            estanque.fincaNombre ?? estanque.finca ?? "Finca asociada",
        },
      });
    },
    [router],
  );

  const irACasoSanitario = useCallback(
    function (caso) {
      if (!caso?.registroId) return;

      if (caso.tipo === "parasitologia") {
        router.push({
          pathname: "/registros/EditarParasitologia",
          params: {
            id: caso.registroId,
          },
        });
        return;
      }

      if (caso.tipo === "enfermedad") {
        router.push({
          pathname: "/registros/EditarEnfermedad",
          params: {
            id: caso.registroId,
          },
        });
      }
    },
    [router],
  );

  const irAAlerta = useCallback(
    function (alerta) {
      if (!alerta?.modulo) return;

      if (alerta.modulo === "enfermedades") {
        if (alerta.registroId) {
          router.push({
            pathname: "/registros/EditarEnfermedad",
            params: {
              id: alerta.registroId,
            },
          });
          return;
        }

        router.push("/registros/Enfermedades");
        return;
      }

      if (alerta.modulo === "parasitologia") {
        if (alerta.registroId) {
          router.push({
            pathname: "/registros/EditarParasitologia",
            params: {
              id: alerta.registroId,
            },
          });
          return;
        }

        router.push("/registros/Parasitologia");
        return;
      }

      if (alerta.modulo === "fisicoQuimica") {
        if (alerta.registroId) {
          router.push({
            pathname: "/registros/EditarFisicoQuimica",
            params: {
              id: alerta.registroId,
            },
          });
          return;
        }

        router.push("/registros/FisicoQuimica");
        return;
      }

      if (alerta.modulo === "estanques") {
        if (alerta.registroId) {
          router.push({
            pathname: "/finca/detalleEstanque",
            params: {
              id: alerta.registroId,
            },
          });
          return;
        }

        router.push("/finca");
        return;
      }

      if (alerta.modulo === "siembra") {
        router.push("/siembra");
        return;
      }

      if (alerta.modulo === "alimentacion") {
        router.push("/registros/Alimentacion");
        return;
      }

      if (alerta.modulo === "inventario") {
        router.push("/inventarios");
        return;
      }

      if (alerta.modulo === "equipos") {
        router.push("/equipos");
      }
    },
    [router],
  );

  const irAAlertas = useCallback(
    function () {
      router.push("/alertas");
    },
    [router],
  );

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
    alertasDashboard,
    ultimosRegistros,

    recargar,
    manejarSeleccionCard,
    alternarAlertas,
    descartarAlertaDashboard,

    irAFinca,
    irAEstanque,
    irACasoSanitario,
    irAAlerta,
    irAAlertas,
  };
}
