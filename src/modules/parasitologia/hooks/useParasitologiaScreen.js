/**
 * ============================================================
 * HOOK DE PANTALLA DE PARASITOLOGIA
 * ============================================================
 *
 * Centraliza la logica del formulario, carga de opciones,
 * validaciones y registro de parasitologias.
 */

import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { getUsuario } from "../../login/utils/tokenStorage.js";
import useParasitologia from "./useParasitologia.js";

const PARASITOS_RESPALDO = [
  { label: "Gregarina", value: "gregarina" },
  { label: "Nematodo", value: "nematodo" },
  { label: "Epicomensal", value: "epicomensal" },
  { label: "Protozoario", value: "protozoario" },
  { label: "Otro", value: "otro" },
];

const GRADOS_INFECCION = [
  { label: "Bajo", value: "bajo" },
  { label: "Medio", value: "medio" },
  { label: "Alto", value: "alto" },
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

function obtenerFechaValida(fecha) {
  const texto = String(fecha ?? "").trim();
  let dia, mes, anio;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    [dia, mes, anio] = texto.split("/").map(Number);
  } else if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
    [anio, mes, dia] = texto.slice(0, 10).split("-").map(Number);
  } else {
    return null;
  }

  const fechaValidada = new Date(anio, mes - 1, dia);
  fechaValidada.setHours(0, 0, 0, 0);

  if (
    fechaValidada.getFullYear() !== anio ||
    fechaValidada.getMonth() !== mes - 1 ||
    fechaValidada.getDate() !== dia
  )
    return null;

  return fechaValidada;
}

function validarFechaReporte(fecha) {
  if (!String(fecha ?? "").trim()) return "Seleccione la fecha del reporte.";

  const fechaValidada = obtenerFechaValida(fecha);
  if (!fechaValidada) return "La fecha del reporte no es valida.";

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (fechaValidada > hoy) return "La fecha del reporte no puede ser futura.";

  return "";
}

function obtenerResponsable(usuario) {
  if (!usuario) return "No disponible";

  const nombreCompleto = usuario.nombreCompleto ?? usuario.nombre_completo;
  if (nombreCompleto) return String(nombreCompleto).trim();

  const nombre = usuario.nombre ?? "";
  const apellidos = usuario.apellidos ?? usuario.apellido ?? "";
  const responsable = `${nombre} ${apellidos}`.trim();

  return responsable || usuario.usuario || usuario.username || "No disponible";
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
      estanque.estanque_id,
  );
}

function obtenerFincaIdEstanque(estanque) {
  return Number(
    estanque.idFinca ??
      estanque.fincaId ??
      estanque.id_finca ??
      estanque.finca_id,
  );
}

function normalizarCatalogoParasitos(catalogo) {
  if (!Array.isArray(catalogo) || catalogo.length === 0)
    return PARASITOS_RESPALDO;

  return catalogo
    .map((item) => {
      if (typeof item === "string")
        return { label: primeraMayuscula(item), value: item };

      const value = item.value ?? item.codigo ?? item.parasito ?? "";
      const label =
        item.label ??
        item.nombre ??
        item.nombreVisible ??
        primeraMayuscula(String(value));

      return { label: String(label), value: String(value) };
    })
    .filter((item) => item.value !== "");
}

export default function useParasitologiaScreen() {
  const { width } = useWindowDimensions();

  const {
    catalogoParasitos,
    loading: loadingParasitologia,
    guardarRegistro,
  } = useParasitologia();

  const responsable = useMemo(() => obtenerResponsable(getUsuario()), []);

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);

  const [finca, setFinca] = useState("");
  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState(obtenerFechaHoy());
  const [parasito, setParasito] = useState("");
  const [gradoInfeccion, setGradoInfeccion] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [cargandoOpciones, setCargandoOpciones] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");

  useEffect(() => {
    if (!mensaje) return undefined;

    const duracion = tipoMensaje === "success" ? 3000 : 6000;
    const timer = setTimeout(() => {
      setMensaje("");
      setTipoMensaje("info");
    }, duracion);

    return () => clearTimeout(timer);
  }, [mensaje, tipoMensaje]);

  useEffect(() => {
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
        setTipoMensaje("danger");
        setMensaje(error.message);
      } finally {
        setCargandoOpciones(false);
      }
    }

    cargarOpciones();
  }, []);

  const opcionesFincas = useMemo(() => {
    return fincas
      .map((item) => {
        const id = obtenerIdFinca(item);
        const label =
          item.nombreFinca ??
          item.nombre_finca ??
          item.nombre ??
          item.codigoCBO ??
          item.codigoCbo ??
          `Finca ${id}`;

        return { label: String(label), value: String(id) };
      })
      .filter((item) => Number(item.value) > 0);
  }, [fincas]);

  const opcionesEstanques = useMemo(() => {
    if (!finca) return [];

    return estanques
      .filter((item) => obtenerFincaIdEstanque(item) === Number(finca))
      .map((item) => {
        const id = obtenerIdEstanque(item);
        const label = item.codigo ?? item.nombre ?? `Estanque ${id}`;

        return { label: String(label), value: String(id) };
      })
      .filter((item) => Number(item.value) > 0);
  }, [finca, estanques]);

  const opcionesParasitos = useMemo(
    () => normalizarCatalogoParasitos(catalogoParasitos),
    [catalogoParasitos],
  );

  const esTablet = width >= 768;

  const gridStyle = useMemo(
    () => ({
      width: "100%",
      flexDirection: esTablet ? "row" : "column",
      flexWrap: esTablet ? "wrap" : "nowrap",
      gap: 12,
    }),
    [esTablet],
  );

  const itemStyle = useMemo(
    () => ({ width: esTablet ? "48.5%" : "100%" }),
    [esTablet],
  );
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

  const placeholderParasito =
    opcionesParasitos.length > 0
      ? "Seleccione un parasito"
      : "No se encuentran opciones o valores";

  const placeholderGrado = "Seleccione el grado de infeccion";

  const errorFinca = submitted && finca === "";
  const errorEstanque = submitted && estanque === "";
  const errorFechaReporte =
    submitted && validarFechaReporte(fechaReporte) !== "";
  const errorParasito = submitted && parasito === "";
  const errorGrado = submitted && gradoInfeccion === "";

  function limpiarMensaje() {
    setMensaje("");
    setTipoMensaje("info");
  }

  const cambiarFinca = (value) => {
    setFinca(String(value));
    setEstanque("");
    limpiarMensaje();
  };
  const cambiarEstanque = (value) => {
    setEstanque(String(value));
    limpiarMensaje();
  };
  const cambiarFechaReporte = (value) => {
    setFechaReporte(value);
    limpiarMensaje();
  };
  const cambiarParasito = (value) => {
    setParasito(String(value));
    limpiarMensaje();
  };
  const cambiarGradoInfeccion = (value) => {
    setGradoInfeccion(String(value));
    limpiarMensaje();
  };
  const cambiarObservaciones = (value) => {
    setObservaciones(value);
    limpiarMensaje();
  };

  function validarFormulario() {
    if (!finca) return "Seleccione una finca.";
    if (!estanque) return "Seleccione un estanque.";

    const errorFecha = validarFechaReporte(fechaReporte);
    if (errorFecha) return errorFecha;

    if (!parasito) return "Seleccione un parasito.";
    if (!gradoInfeccion) return "Seleccione el grado de infeccion.";

    return "";
  }

  function limpiarFormulario() {
    setFinca("");
    setEstanque("");
    setFechaReporte(obtenerFechaHoy());
    setParasito("");
    setGradoInfeccion("");
    setObservaciones("");
    setSubmitted(false);
  }

  async function registrarParasitologia() {
    setSubmitted(true);
    setMensaje("");

    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setTipoMensaje("danger");
      setMensaje(errorValidacion);
      return;
    }

    try {
      const parasitologiaDTO = {
        fincaId: Number(finca),
        estanqueId: Number(estanque),
        fechaReporte: convertirFechaParaBackend(fechaReporte),
        parasito,
        gradoInfeccion,
        observaciones: observaciones.trim() || null,
      };

      await guardarRegistro(parasitologiaDTO);

      setTipoMensaje("success");
      setMensaje("Parasitologia registrada correctamente.");
      limpiarFormulario();
    } catch (error) {
      setTipoMensaje("danger");
      setMensaje(error.message);
    }
  }

  return {
    finca,
    estanque,
    fechaReporte,
    parasito,
    gradoInfeccion,
    observaciones,
    responsable,

    opcionesFincas,
    opcionesEstanques,
    opcionesParasitos,
    opcionesGrados: GRADOS_INFECCION,

    placeholderFinca,
    placeholderEstanque,
    placeholderParasito,
    placeholderGrado,

    gridStyle,
    itemStyle,
    itemFullStyle,

    errorFinca,
    errorEstanque,
    errorFechaReporte,
    errorParasito,
    errorGrado,

    mensaje,
    tipoMensaje,
    loading: loadingParasitologia || cargandoOpciones,

    cambiarFinca,
    setEstanque: cambiarEstanque,
    setFechaReporte: cambiarFechaReporte,
    setParasito: cambiarParasito,
    setGradoInfeccion: cambiarGradoInfeccion,
    setObservaciones: cambiarObservaciones,
    registrarParasitologia,
  };
}
