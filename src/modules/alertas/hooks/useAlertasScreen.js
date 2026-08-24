/**
 * ============================================================
 * HOOK: USE ALERTAS SCREEN
 * ============================================================
 *
 * Descripcion:
 * Centraliza la carga de datos, estado de los dropdowns,
 * descarte de alertas y navegacion de AlertasScreen.
 */

import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { obtenerSiembras } from "../../siembra/services/SiembraService.js";
import useAlimentacion from "../../alimentacion/hooks/useAlimentacion.js";
import { getProductosInventario } from "../../inventarios/services/InventarioService.js";
import { EQUIPOS_MOCK } from "../../mantEquipo/services/mantEquipoService.js";
import { getLecturas } from "../../mantAgua/services/FisicoQuimicaServices.js";
import enfermedadesService from "../../enfermedades/services/EnfermedadesService.js";
import parasitologiaService from "../../parasitologia/services/ParasitologiaService.js";

import {
  agruparAlertasPorTipo,
  construirAlertasOperativas,
  descartarAlerta,
  filtrarAlertasDescartadas,
  obtenerAlertasDescartadas,
} from "../services/AlertasServices.js";

import { obtenerEstadoInicialDropdowns } from "../services/AlertasScreenService.js";

export default function useAlertasScreen() {
  const router = useRouter();
  const { alimentaciones, recargar } = useAlimentacion();

  const [abiertos, setAbiertos] = useState(obtenerEstadoInicialDropdowns());
  const [descartadas, setDescartadas] = useState([]);
  const [productosInventario, setProductosInventario] = useState([]);
  const [registrosEnfermedades, setRegistrosEnfermedades] = useState([]);
  const [registrosParasitologia, setRegistrosParasitologia] = useState([]);
  const [registrosFisicoQuimicos, setRegistrosFisicoQuimicos] = useState([]);

  useEffect(function () {
    let activo = true;

    async function cargarDatos() {
      let ids = [];
      let productos = [];
      let enfermedades = [];
      let parasitos = [];
      let fisicoQuimicos = [];

      try {
        ids = await obtenerAlertasDescartadas();
      } catch (error) {
        ids = [];
      }

      try {
        productos = await getProductosInventario();
      } catch (error) {
        productos = [];
      }

      try {
        enfermedades = await enfermedadesService.getAll();
      } catch (error) {
        enfermedades = [];
      }

      try {
        parasitos = await parasitologiaService.getAll();
      } catch (error) {
        parasitos = [];
      }

      try {
        fisicoQuimicos = await getLecturas();
      } catch (error) {
        fisicoQuimicos = [];
      }

      if (activo === true) {
        setDescartadas(Array.isArray(ids) ? ids : []);
        setProductosInventario(Array.isArray(productos) ? productos : []);
        setRegistrosEnfermedades(Array.isArray(enfermedades) ? enfermedades : []);
        setRegistrosParasitologia(Array.isArray(parasitos) ? parasitos : []);
        setRegistrosFisicoQuimicos(Array.isArray(fisicoQuimicos) ? fisicoQuimicos : []);
      }
    }

    recargar();
    cargarDatos();

    return function () {
      activo = false;
    };
  }, [recargar]);

  const alertasBase = construirAlertasOperativas({
    productosInventario,
    siembras: obtenerSiembras(),
    alimentaciones,
    equipos: EQUIPOS_MOCK,
    registrosEnfermedades,
    registrosParasitologia,
    registrosFisicoQuimicos,
  });

  const alertas = filtrarAlertasDescartadas(alertasBase, descartadas);
  const grupos = agruparAlertasPorTipo(alertas);

  function cambiarDropdown(tipo) {
    setAbiertos(function (actual) {
      return {
        ...actual,
        [tipo]: !actual[tipo],
      };
    });
  }

  async function descartar(id) {
    const ids = await descartarAlerta(id);
    setDescartadas(Array.isArray(ids) ? ids : []);
  }

  function irAAlerta(alerta) {
    if (!alerta?.modulo) return;

    if (alerta.modulo === "enfermedades") {
      router.push(
        alerta.registroId
          ? {
              pathname: "/registros/EditarEnfermedad",
              params: { id: alerta.registroId },
            }
          : "/registros/Enfermedades",
      );
      return;
    }

    if (alerta.modulo === "parasitologia") {
      router.push(
        alerta.registroId
          ? {
              pathname: "/registros/EditarParasitologia",
              params: { id: alerta.registroId },
            }
          : "/registros/Parasitologia",
      );
      return;
    }

    if (alerta.modulo === "fisicoQuimica") {
      router.push(
        alerta.registroId
          ? {
              pathname: "/registros/EditarFisicoQuimica",
              params: { id: alerta.registroId },
            }
          : "/registros/FisicoQuimica",
      );
      return;
    }

    if (alerta.modulo === "estanques") {
      router.push(
        alerta.registroId
          ? {
              pathname: "/finca/detalleEstanque",
              params: { id: alerta.registroId },
            }
          : "/finca",
      );
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
  }

  return {
    abiertos,
    grupos,
    cambiarDropdown,
    descartar,
    irAAlerta,
  };
}