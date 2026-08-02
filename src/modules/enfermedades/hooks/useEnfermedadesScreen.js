/**
 * ============================================================
 * HOOK DE PANTALLA DE ENFERMEDADES
 * ============================================================
 *
 * Centraliza la logica del formulario, carga de opciones,
 * validaciones y registro de enfermedades.
 */

import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useError } from "../../../shared/context/ErrorContext";
import { fincaService } from "../../finca/services/finca.service";
import { estanqueService } from "../../estanques/services/estanque.service";

import useEnfermedades from "./useEnfermedades";

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");

  return `${dia}/${mes}/${fecha.getFullYear()}`;
}

function convertirFechaParaBackend(fecha) {
  if (!fecha || fecha.includes("-")) return fecha || "";

  const [dia, mes, anio] = fecha.split("/");
  return dia && mes && anio ? `${anio}-${mes}-${dia}` : fecha;
}

function primeraMayuscula(texto) {
  return texto
    ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
    : "";
}

function obtenerIdFinca(finca) {
  return Number(
    finca.id ??
    finca.fincaId ??
    finca.idFinca ??
    finca.finca_id
  );
}

function obtenerIdEstanque(estanque) {
  return Number(
    estanque.id ??
    estanque.estanqueId ??
    estanque.idEstanque ??
    estanque.estanque_id
  );
}

function obtenerFincaIdEstanque(estanque) {
  return Number(
    estanque.idFinca ??
    estanque.fincaId ??
    estanque.finca_id ??
    estanque.finca?.id
  );
}

function normalizarCatalogo(catalogo) {
  if (!Array.isArray(catalogo)) return [];

  return catalogo
    .map(function (item) {
      if (typeof item === "string") {
        return {
          label: primeraMayuscula(item),
          value: item,
        };
      }

      const value =
        item.value ??
        item.valor ??
        item.codigo ??
        item.nombre ??
        "";

      const label =
        item.label ??
        item.nombre ??
        primeraMayuscula(String(value));

      return {
        label: String(label),
        value: String(value),
      };
    })
    .filter(function (item) {
      return item.value !== "";
    });
}

export default function useEnfermedadesScreen() {
  const { width } = useWindowDimensions();
  const { mostrarError } = useError();

  const {
    catalogoEnfermedades,
    catalogoSeveridades,
    loading: loadingEnfermedades,
    guardarEnfermedad: guardarEnfermedadBackend,
  } = useEnfermedades();

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);

  const [finca, setFinca] = useState("");
  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState(obtenerFechaActual());
  const [enfermedad, setEnfermedad] = useState("");
  const [severidad, setSeveridad] = useState("");
  const [mortalidad, setMortalidad] = useState("");
  const [reporte, setReporte] = useState("");

  const [cargandoOpciones, setCargandoOpciones] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");

  useEffect(function () {
    async function cargarOpciones() {
      try {
        setCargandoOpciones(true);

        const [fincasData, estanquesData] = await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
        ]);

        setFincas(Array.isArray(fincasData) ? fincasData : []);
        setEstanques(Array.isArray(estanquesData) ? estanquesData : []);
      } catch (error) {
        console.error("Error al cargar fincas y estanques", error);
        mostrarError(error);
      } finally {
        setCargandoOpciones(false);
      }
    }

    cargarOpciones();
  }, []);

  const opcionesFincas = useMemo(function () {
    return fincas
      .map(function (item) {
        const id = obtenerIdFinca(item);
        const label =
          item.nombreFinca ??
          item.nombre_finca ??
          item.nombre ??
          item.codigoCBO ??
          `Finca ${id}`;

        return {
          label,
          value: String(id),
        };
      })
      .filter(function (item) {
        return Number(item.value) > 0;
      });
  }, [fincas]);

  const opcionesEstanques = useMemo(function () {
    if (!finca) return [];

    return estanques
      .filter(function (item) {
        return obtenerFincaIdEstanque(item) === Number(finca);
      })
      .map(function (item) {
        const id = obtenerIdEstanque(item);
        const label = item.codigo ?? item.nombre ?? `Estanque ${id}`;

        return {
          label,
          value: String(id),
        };
      })
      .filter(function (item) {
        return Number(item.value) > 0;
      });
  }, [finca, estanques]);

  const opcionesEnfermedades = useMemo(function () {
    return normalizarCatalogo(catalogoEnfermedades);
  }, [catalogoEnfermedades]);

  const opcionesSeveridades = useMemo(function () {
    return normalizarCatalogo(catalogoSeveridades);
  }, [catalogoSeveridades]);

  const esTablet = width >= 768;

  const gridStyle = useMemo(function () {
    return {
      width: "100%",
      flexDirection: esTablet ? "row" : "column",
      flexWrap: esTablet ? "wrap" : "nowrap",
      gap: 12,
    };
  }, [esTablet]);

  const itemStyle = useMemo(function () {
    return {
      width: esTablet ? "48.5%" : "100%",
    };
  }, [esTablet]);

  const itemFullStyle = useMemo(function () {
    return {
      width: "100%",
    };
  }, []);

  const placeholderFinca = cargandoOpciones
    ? "Cargando fincas..."
    : opcionesFincas.length > 0
      ? "Seleccione una finca"
      : "No se encuentran opciones o valores";

  const placeholderEstanque = !finca
    ? "Seleccione primero una finca"
    : opcionesEstanques.length > 0
      ? "Seleccione un estanque"
      : "No se encuentran opciones o valores";

  const placeholderEnfermedad = opcionesEnfermedades.length > 0
    ? "Seleccione una enfermedad"
    : "No se encuentran opciones o valores";

  const placeholderSeveridad = opcionesSeveridades.length > 0
    ? "Seleccione la severidad"
    : "No se encuentran opciones o valores";

  const errorFinca = submitted && finca === "";
  const errorEstanque = submitted && estanque === "";
  const errorFechaReporte = submitted && fechaReporte.trim() === "";
  const errorEnfermedad = submitted && enfermedad === "";
  const errorSeveridad = submitted && severidad === "";
  const errorReporte = submitted && reporte.trim() === "";

  function limpiarMensaje() {
    setMensaje("");
    setTipoMensaje("info");
  }

  function cambiarFinca(value) {
    setFinca(String(value));
    setEstanque("");
    limpiarMensaje();
  }

  function cambiarEstanque(value) {
    setEstanque(String(value));
    limpiarMensaje();
  }

  function cambiarFechaReporte(value) {
    setFechaReporte(value);
    limpiarMensaje();
  }

  function cambiarEnfermedad(value) {
    setEnfermedad(String(value));
    limpiarMensaje();
  }

  function cambiarSeveridad(value) {
    setSeveridad(String(value));
    limpiarMensaje();
  }

  function cambiarMortalidad(value) {
    setMortalidad(String(value));
    limpiarMensaje();
  }

  function cambiarReporte(value) {
    setReporte(value);
    limpiarMensaje();
  }

  function validarFormulario() {
    const mortalidadNumero = Number(mortalidad);

    return Boolean(
      finca &&
      estanque &&
      fechaReporte &&
      enfermedad &&
      severidad &&
      reporte.trim() &&
      !Number.isNaN(mortalidadNumero) &&
      mortalidadNumero >= 0
    );
  }

  function limpiarFormulario() {
    setFinca("");
    setEstanque("");
    setFechaReporte(obtenerFechaActual());
    setEnfermedad("");
    setSeveridad("");
    setMortalidad("");
    setReporte("");
    setSubmitted(false);
  }

  async function guardarEnfermedad() {
    setSubmitted(true);
    setMensaje("");

    if (!validarFormulario()) {
      setTipoMensaje("danger");
      setMensaje("Rellene los datos requeridos correctamente.");
      return;
    }

    const enfermedadDTO = {
      fincaId: Number(finca),
      estanqueId: Number(estanque),
      fechaReporte: convertirFechaParaBackend(fechaReporte),
      enfermedad,
      severidad,
      mortalidadRegistrada: Number(mortalidad),
      reporte: reporte.trim(),
    };

    const nuevaEnfermedad =
      await guardarEnfermedadBackend(enfermedadDTO);

    if (!nuevaEnfermedad) return;

    setTipoMensaje("success");
    setMensaje("Enfermedad registrada correctamente.");
    limpiarFormulario();
  }

  return {
    finca,
    estanque,
    fechaReporte,
    responsable: "",
    enfermedad,
    severidad,
    mortalidad,
    reporte,

    opcionesFincas,
    opcionesEstanques,
    opcionesEnfermedades,
    opcionesSeveridades,

    placeholderFinca,
    placeholderEstanque,
    placeholderEnfermedad,
    placeholderSeveridad,

    gridStyle,
    itemStyle,
    itemFullStyle,

    errorFinca,
    errorEstanque,
    errorFechaReporte,
    errorEnfermedad,
    errorSeveridad,
    errorReporte,

    mensaje,
    tipoMensaje,
    loading: loadingEnfermedades || cargandoOpciones,

    cambiarFinca,
    cambiarEstanque,
    cambiarFechaReporte,
    cambiarEnfermedad,
    cambiarSeveridad,
    cambiarMortalidad,
    cambiarReporte,
    guardarEnfermedad,
  };
}