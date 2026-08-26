/**
 * Calco de useParasitologiaScreen para edición.
 */

import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";

import parasitologiaService from "../services/ParasitologiaService.js";
import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { getSiembras } from "../../siembra/services/siembra.service.js";

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

function convertirFechaParaBackend(fecha) {
  if (!fecha) return "";
  if (fecha.includes("-") && !fecha.includes("/")) return fecha.slice(0, 10);

  const [d, m, y] = fecha.split("/");
  return d && m && y ? `${y}-${m}-${d}` : fecha;
}

function formatearFechaUI(fecha) {
  if (!fecha) return "";

  if (typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
    const [y, m, d] = fecha.slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
  }

  return fecha;
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
  ) return null;

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

function primeraMayuscula(texto) {
  return texto
    ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
    : "";
}

function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function obtenerIdEstanque(estanque) {
  return Number(
    estanque?.id ??
      estanque?.estanqueId ??
      estanque?.idEstanque ??
      estanque?.estanque_id ??
      0,
  );
}

function obtenerFincaIdEstanque(estanque) {
  return Number(
    estanque?.idFinca ??
      estanque?.fincaId ??
      estanque?.id_finca ??
      estanque?.finca_id ??
      0,
  );
}

function obtenerIdEstanqueSiembra(siembra) {
  return Number(
    siembra?.estanqueId ??
      siembra?.idEstanque ??
      siembra?.estanque_id ??
      siembra?.id_estanque ??
      0,
  );
}

function estanqueEstaOperativo(estanque) {
  return normalizarTexto(estanque?.estado) === "activo";
}

function siembraEstaActiva(siembra) {
  const activo = siembra?.activo ?? true;
  const estado = normalizarTexto(siembra?.estado);

  if (
    activo === false ||
    activo === 0 ||
    activo === "0" ||
    normalizarTexto(activo) === "false"
  ) return false;

  return estado === "activa" || estado === "activo";
}

function tieneSiembraActiva(estanqueId, siembras) {
  if (!Array.isArray(siembras)) return false;

  return siembras.some((siembra) => {
    return (
      obtenerIdEstanqueSiembra(siembra) === Number(estanqueId) &&
      siembraEstaActiva(siembra)
    );
  });
}

function buscarEstanque(estanques, estanqueId) {
  if (!Array.isArray(estanques)) return null;

  return (
    estanques.find(
      (item) => obtenerIdEstanque(item) === Number(estanqueId),
    ) ?? null
  );
}

function validarEstanqueParaRegistro(estanqueId, estanques, siembras) {
  const estanque = buscarEstanque(estanques, estanqueId);

  if (!estanque) return "Seleccione un estanque valido.";

  if (!estanqueEstaOperativo(estanque))
    return "El estanque seleccionado no esta activo.";

  if (!tieneSiembraActiva(estanqueId, siembras))
    return "El estanque seleccionado no tiene una siembra activa.";

  return "";
}

function normalizarCatalogoParasitos(catalogo) {
  if (!Array.isArray(catalogo) || catalogo.length === 0)
    return PARASITOS_RESPALDO;

  return catalogo
    .map((item) => {
      if (typeof item === "string")
        return { label: primeraMayuscula(item), value: item };

      const value =
        item.value ??
        item.codigo ??
        item.parasito ??
        item.nombre ??
        "";

      const label =
        item.label ??
        item.nombre ??
        item.nombreVisible ??
        primeraMayuscula(String(value));

      return { label: String(label), value: String(value) };
    })
    .filter((item) => item.value !== "");
}

export default function useEditarParasitologia(registroId, onGuardado) {
  const { width } = useWindowDimensions();

  const [finca, setFinca] = useState("");
  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState("");
  const [parasito, setParasito] = useState("");
  const [gradoInfeccion, setGradoInfeccion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [responsable, setResponsable] = useState("");

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);
  const [siembras, setSiembras] = useState([]);
  const [catalogo, setCatalogo] = useState([]);

  const [submitted, setSubmitted] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [loading, setLoading] = useState(false);
  const [cargandoRegistro, setCargandoRegistro] = useState(true);
  const [cargandoOpciones, setCargandoOpciones] = useState(true);

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
    let activo = true;

    async function cargarOpciones() {
      try {
        setCargandoOpciones(true);

        const [fincasData, estanquesData, siembrasData, catalogoData] =
          await Promise.all([
            fincaService.getFincas(),
            estanqueService.getEstanques(),
            getSiembras(),
            parasitologiaService.getCatalogo(),
          ]);

        if (!activo) return;

        setFincas(Array.isArray(fincasData) ? fincasData : []);
        setEstanques(Array.isArray(estanquesData) ? estanquesData : []);
        setSiembras(Array.isArray(siembrasData) ? siembrasData : []);
        setCatalogo(Array.isArray(catalogoData) ? catalogoData : []);
      } catch (error) {
        if (!activo) return;

        setTipoMensaje("danger");
        setMensaje(error.message);
      } finally {
        if (activo) setCargandoOpciones(false);
      }
    }

    cargarOpciones();

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (!registroId) {
      setCargandoRegistro(false);
      return undefined;
    }

    let activo = true;

    async function cargarRegistro() {
      try {
        setCargandoRegistro(true);

        const registro = await parasitologiaService.getById(registroId);

        if (!activo || !registro) return;

        setFinca(String(registro.fincaId ?? registro.finca_id ?? ""));
        setEstanque(String(registro.estanqueId ?? registro.estanque_id ?? ""));
        setFechaReporte(
          formatearFechaUI(
            registro.fechaReporte ??
              registro.fecha_reporte ??
              registro.fecha,
          ),
        );
        setParasito(registro.parasito ?? "");
        setGradoInfeccion(
          String(
            registro.gradoInfeccion ??
              registro.grado_infeccion ??
              "",
          ).toLowerCase(),
        );
        setObservaciones(registro.observaciones ?? "");
        setResponsable(registro.responsable ?? "No disponible");
      } catch (error) {
        if (!activo) return;

        setTipoMensaje("danger");
        setMensaje(error.message || "No se pudo cargar el registro.");
      } finally {
        if (activo) setCargandoRegistro(false);
      }
    }

    cargarRegistro();

    return () => {
      activo = false;
    };
  }, [registroId]);

  const opcionesFincas = useMemo(() => {
    return fincas
      .map((item) => {
        const id = Number(
          item.id ??
            item.fincaId ??
            item.idFinca ??
            item.finca_id,
        );

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
      .filter((item) => {
        const estanqueId = obtenerIdEstanque(item);

        return (
          obtenerFincaIdEstanque(item) === Number(finca) &&
          estanqueEstaOperativo(item) &&
          tieneSiembraActiva(estanqueId, siembras)
        );
      })
      .map((item) => {
        const id = obtenerIdEstanque(item);

        return {
          label: String(item.codigo ?? item.nombre ?? `Estanque ${id}`),
          value: String(id),
        };
      })
      .filter((item) => Number(item.value) > 0);
  }, [estanques, finca, siembras]);

  const opcionesParasitos = useMemo(
    () => normalizarCatalogoParasitos(catalogo),
    [catalogo],
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
      : "No hay estanques activos con siembra activa";

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

  const cambiarFinca = (v) => {
    setFinca(String(v));
    setEstanque("");
    limpiarMensaje();
  };

  const cambiarEstanque = (v) => {
    setEstanque(String(v));
    limpiarMensaje();
  };

  const cambiarFechaReporte = (v) => {
    setFechaReporte(v);
    limpiarMensaje();
  };

  const cambiarParasito = (v) => {
    setParasito(String(v));
    limpiarMensaje();
  };

  const cambiarGradoInfeccion = (v) => {
    setGradoInfeccion(String(v));
    limpiarMensaje();
  };

  const cambiarObservaciones = (v) => {
    setObservaciones(v);
    limpiarMensaje();
  };

  function validarFormulario() {
    if (!finca) return "Seleccione una finca.";
    if (!estanque) return "Seleccione un estanque.";

    const errorEstanqueOperativo = validarEstanqueParaRegistro(
      estanque,
      estanques,
      siembras,
    );

    if (errorEstanqueOperativo) return errorEstanqueOperativo;

    const errorFecha = validarFechaReporte(fechaReporte);

    if (errorFecha) return errorFecha;
    if (!parasito) return "Seleccione un parasito.";
    if (!gradoInfeccion) return "Seleccione el grado de infeccion.";

    return "";
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

    setLoading(true);

    try {
      await parasitologiaService.update(registroId, {
        fincaId: Number(finca),
        estanqueId: Number(estanque),
        fechaReporte: convertirFechaParaBackend(fechaReporte),
        parasito,
        gradoInfeccion,
        observaciones: observaciones.trim() || null,
      });

      setTipoMensaje("success");
      setMensaje("Parasitologia actualizada correctamente.");

      if (onGuardado) onGuardado();
    } catch (error) {
      setTipoMensaje("danger");
      setMensaje(error.message);
    } finally {
      setLoading(false);
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
    loading: loading || cargandoOpciones,
    cargandoRegistro,

    cambiarFinca,
    setEstanque: cambiarEstanque,
    setFechaReporte: cambiarFechaReporte,
    setParasito: cambiarParasito,
    setGradoInfeccion: cambiarGradoInfeccion,
    setObservaciones: cambiarObservaciones,
    registrarParasitologia,
  };
}