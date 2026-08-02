/**
 * ============================================================
 * HOOK DE PANTALLA DE PARASITOLOGIA
 * ============================================================
 *
 * Centraliza la logica del formulario, carga de opciones,
 * validaciones, calculos y registro de parasitologias.
 */

import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useError } from "../../../shared/context/ErrorContext";
import { fincaService } from "../../finca/services/finca.service";
import { estanqueService } from "../../estanques/services/estanque.service";
import useParasitologia from "./useParasitologia";

import { COLORS } from "../../../theme/colors";

const PARASITOS_RESPALDO = [
  { label: "Gregarina", value: "gregarina" },
  { label: "Nematodo", value: "nematodo" },
  { label: "Epicomensal", value: "epicomensal" },
  { label: "Protozoario", value: "protozoario" },
  { label: "Otro", value: "otro" },
];

function obtenerFechaHoy() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");

  return `${dia}/${mes}/${hoy.getFullYear()}`;
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
  return Number(finca.id ?? finca.fincaId ?? finca.idFinca ?? finca.finca_id);
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

function normalizarCatalogoParasitos(catalogo) {
  if (!Array.isArray(catalogo) || catalogo.length === 0) {
    return PARASITOS_RESPALDO;
  }

  return catalogo
    .map(function (item) {
      if (typeof item === "string") {
        return {
          label: primeraMayuscula(item),
          value: item,
        };
      }

      const value = item.value ?? item.codigo ?? item.parasito ?? "";
      const label =
        item.label ??
        item.nombre ??
        item.nombreVisible ??
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

export default function useParasitologiaScreen() {
  const { width } = useWindowDimensions();
  const { mostrarError } = useError();

  const {
    catalogoParasitos,
    loading: loadingParasitologia,
    guardarRegistro,
  } = useParasitologia();

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);

  const [finca, setFinca] = useState("");
  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState(obtenerFechaHoy());
  const [responsable, setResponsable] = useState("");
  const [parasito, setParasito] = useState("");
  const [camaronesMuestreados, setCamaronesMuestreados] = useState("");
  const [camaronesInfectados, setCamaronesInfectados] = useState("");
  const [observaciones, setObservaciones] = useState("");

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
          item.codigoCbo ??
          `Finca ${id}`;

        return {
          label: String(label),
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
          label: String(label),
          value: String(id),
        };
      })
      .filter(function (item) {
        return Number(item.value) > 0;
      });
  }, [finca, estanques]);

  const opcionesParasitos = useMemo(function () {
    return normalizarCatalogoParasitos(catalogoParasitos);
  }, [catalogoParasitos]);

  const gradoCalculado = useMemo(function () {
    const muestreados = Number(camaronesMuestreados);
    const infectados = Number(camaronesInfectados);
    let porcentaje = 0;

    if (muestreados > 0 && infectados >= 0 && infectados <= muestreados) {
      porcentaje = Number(((infectados / muestreados) * 100).toFixed(2));
    }

    if (porcentaje >= 60) {
      return {
        codigo: "alto",
        nombre: "Alto",
        porcentaje,
        descripcion: "El nivel de infeccion requiere atencion inmediata.",
      };
    }

    if (porcentaje >= 30) {
      return {
        codigo: "medio",
        nombre: "Medio",
        porcentaje,
        descripcion: "El nivel de infeccion requiere seguimiento.",
      };
    }

    return {
      codigo: "bajo",
      nombre: "Bajo",
      porcentaje,
      descripcion:
        porcentaje === 0
          ? "Sin camarones infectados."
          : "El nivel de infeccion se encuentra en un rango bajo.",
    };
  }, [camaronesMuestreados, camaronesInfectados]);

  let colorGrado = COLORS.success;

  if (gradoCalculado.codigo === "alto") {
    colorGrado = COLORS.error;
  }

  if (gradoCalculado.codigo === "medio") {
    colorGrado = COLORS.warning;
  }

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

  const placeholderParasito =
    opcionesParasitos.length > 0
      ? "Seleccione un parasito"
      : "No se encuentran opciones o valores";

  const errorFinca = submitted && finca === "";
  const errorEstanque = submitted && estanque === "";
  const errorFechaReporte = submitted && fechaReporte.trim() === "";
  const errorParasito = submitted && parasito === "";
  const errorMuestreados =
    submitted && Number(camaronesMuestreados) <= 0;
  const errorInfectados =
    submitted &&
    (camaronesInfectados.trim() === "" ||
      Number(camaronesInfectados) < 0 ||
      Number(camaronesInfectados) > Number(camaronesMuestreados));

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

  function cambiarParasito(value) {
    setParasito(String(value));
    limpiarMensaje();
  }

  function cambiarCamaronesMuestreados(value) {
    setCamaronesMuestreados(String(value));
    limpiarMensaje();
  }

  function cambiarCamaronesInfectados(value) {
    setCamaronesInfectados(String(value));
    limpiarMensaje();
  }

  function cambiarObservaciones(value) {
    setObservaciones(value);
    limpiarMensaje();
  }

  function validarFormulario() {
    const muestreados = Number(camaronesMuestreados);
    const infectados = Number(camaronesInfectados);

    return Boolean(
      finca &&
      estanque &&
      fechaReporte &&
      parasito &&
      camaronesMuestreados.trim() !== "" &&
      camaronesInfectados.trim() !== "" &&
      muestreados > 0 &&
      infectados >= 0 &&
      infectados <= muestreados
    );
  }

  function limpiarFormulario() {
    setFinca("");
    setEstanque("");
    setFechaReporte(obtenerFechaHoy());
    setParasito("");
    setCamaronesMuestreados("");
    setCamaronesInfectados("");
    setObservaciones("");
    setSubmitted(false);
  }

  async function registrarParasitologia() {
    setSubmitted(true);
    setMensaje("");

    if (!validarFormulario()) {
      const muestreados = Number(camaronesMuestreados);
      const infectados = Number(camaronesInfectados);

      if (
        camaronesMuestreados.trim() !== "" &&
        camaronesInfectados.trim() !== "" &&
        infectados > muestreados
      ) {
        setTipoMensaje("danger");
        setMensaje(
          "El numero de infectados no puede ser mayor que el numero de muestreados."
        );
        return;
      }

      setTipoMensaje("danger");
      setMensaje("Rellene los datos requeridos correctamente.");
      return;
    }

    const muestreados = Number(camaronesMuestreados);
    const infectados = Number(camaronesInfectados);

    const parasitologiaDTO = {
      fincaId: Number(finca),
      estanqueId: Number(estanque),
      fechaReporte: convertirFechaParaBackend(fechaReporte),
      parasito,
      camaronesMuestreados: muestreados,
      camaronesInfectados: infectados,
      observaciones: observaciones.trim() || null,
    };

    const nuevoRegistro = await guardarRegistro(parasitologiaDTO);

    if (!nuevoRegistro) return;

    setResponsable(nuevoRegistro.responsable ?? "");
    setTipoMensaje("success");
    setMensaje("Parasitologia registrada correctamente.");
    limpiarFormulario();
  }

  return {
    finca,
    estanque,
    fechaReporte,
    responsable,
    parasito,
    camaronesMuestreados,
    camaronesInfectados,
    observaciones,

    opcionesFincas,
    opcionesEstanques,
    opcionesParasitos,

    placeholderFinca,
    placeholderEstanque,
    placeholderParasito,

    gradoCalculado,
    colorGrado,
    gridStyle,
    itemStyle,
    itemFullStyle,

    errorFinca,
    errorEstanque,
    errorFechaReporte,
    errorParasito,
    errorMuestreados,
    errorInfectados,

    mensaje,
    tipoMensaje,
    loading: loadingParasitologia || cargandoOpciones,

    cambiarFinca,
    setEstanque: cambiarEstanque,
    setFechaReporte: cambiarFechaReporte,
    setParasito: cambiarParasito,
    setCamaronesMuestreados: cambiarCamaronesMuestreados,
    setCamaronesInfectados: cambiarCamaronesInfectados,
    setObservaciones: cambiarObservaciones,
    registrarParasitologia,
  };
}