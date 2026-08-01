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
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase() : "";
}

function obtenerIdFinca(estanque) {
  return Number(estanque.idFinca ?? estanque.fincaId ?? estanque.finca_id);
}

function normalizarCatalogoParasitos(catalogo) {
  if (!Array.isArray(catalogo) || catalogo.length === 0) return PARASITOS_RESPALDO;

  return catalogo
    .map((item) => {
      if (typeof item === "string") return { label: primeraMayuscula(item), value: item };

      const value = item.value ?? item.codigo ?? item.parasito ?? "";
      const label = item.label ?? item.nombre ?? item.nombreVisible ?? primeraMayuscula(value);

      return { label, value };
    })
    .filter((item) => item.value !== "");
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
  const [camaronesMuestreados, setCamaronesMuestreados] = useState("0");
  const [camaronesInfectados, setCamaronesInfectados] = useState("0");
  const [observaciones, setObservaciones] = useState("");

  const [cargandoOpciones, setCargandoOpciones] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");

  useEffect(() => {
    const cargarOpciones = async () => {
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
    };

    cargarOpciones();
  }, []);

  const opcionesFincas = useMemo(() => {
    return fincas.map((item) => ({
      label: item.nombreFinca ?? item.nombre ?? item.codigoCBO ?? item.codigoCbo ?? `Finca ${item.id}`,
      value: String(item.id),
    }));
  }, [fincas]);

  const opcionesEstanques = useMemo(() => {
    if (!finca) return [];

    return estanques
      .filter((item) => obtenerIdFinca(item) === Number(finca))
      .map((item) => ({
        label: item.codigo ?? item.nombre ?? `Estanque ${item.id}`,
        value: String(item.id),
      }));
  }, [finca, estanques]);

  const opcionesParasitos = useMemo(() => {
    return normalizarCatalogoParasitos(catalogoParasitos);
  }, [catalogoParasitos]);

  const gradoCalculado = useMemo(() => {
    const muestreados = Number(camaronesMuestreados);
    const infectados = Number(camaronesInfectados);
    const porcentaje = muestreados > 0 && infectados >= 0
      ? Number(((infectados / muestreados) * 100).toFixed(2))
      : 0;

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
      descripcion: porcentaje === 0
        ? "Sin camarones infectados."
        : "El nivel de infeccion se encuentra en un rango bajo.",
    };
  }, [camaronesMuestreados, camaronesInfectados]);

  const colorGrado = gradoCalculado.codigo === "alto"
    ? COLORS.error
    : gradoCalculado.codigo === "medio"
      ? COLORS.warning
      : COLORS.success;

  const esTablet = width >= 768;

  const gridStyle = useMemo(() => ({
    width: "100%",
    flexDirection: esTablet ? "row" : "column",
    flexWrap: esTablet ? "wrap" : "nowrap",
    gap: 12,
  }), [esTablet]);

  const itemStyle = useMemo(() => ({
    width: esTablet ? "48.5%" : "100%",
  }), [esTablet]);

  const itemFullStyle = useMemo(() => ({ width: "100%" }), []);

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

  const placeholderParasito = opcionesParasitos.length > 0
    ? "Seleccione un parasito"
    : "No se encuentran opciones o valores";

  function limpiarMensaje() {
    setMensaje("");
    setTipoMensaje("info");
  }

  function cambiarFinca(value) {
    setFinca(value);
    setEstanque("");
    limpiarMensaje();
  }

  function cambiarEstanque(value) {
    setEstanque(value);
    limpiarMensaje();
  }

  function cambiarFechaReporte(value) {
    setFechaReporte(value);
    limpiarMensaje();
  }

  function cambiarParasito(value) {
    setParasito(value);
    limpiarMensaje();
  }

  function cambiarCamaronesMuestreados(value) {
    setCamaronesMuestreados(value);
    limpiarMensaje();
  }

  function cambiarCamaronesInfectados(value) {
    setCamaronesInfectados(value);
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
    setCamaronesMuestreados("0");
    setCamaronesInfectados("0");
    setObservaciones("");
  }

  async function registrarParasitologia() {
    setMensaje("");

    if (!validarFormulario()) {
      setTipoMensaje("danger");
      setMensaje("Rellene los datos requeridos correctamente.");
      return;
    }

    const parasitologiaDTO = {
      fincaId: Number(finca),
      estanqueId: Number(estanque),
      fechaReporte: convertirFechaParaBackend(fechaReporte),
      parasito,
      camaronesMuestreados: Number(camaronesMuestreados),
      camaronesInfectados: Number(camaronesInfectados),
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