/**
 * Calco de useEnfermedadesScreen para edición (misma API `pantalla`).
 */

import { useEffect, useMemo, useState } from "react";
import enfermedadesService from "../services/EnfermedadesService.js";
import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";

function obtenerFechaActual() {
  const h = new Date();
  return `${String(h.getDate()).padStart(2, "0")}/${String(h.getMonth() + 1).padStart(2, "0")}/${h.getFullYear()}`;
}

function convertirFechaParaBackend(fecha) {
  if (!fecha) return "";
  if (fecha.includes("-") && !fecha.includes("/")) return fecha.slice(0, 10);
  const [d, m, y] = fecha.split("/");
  return `${y}-${m}-${d}`;
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

export default function useEditarEnfermedad(registroId, onGuardado) {
  const [finca, setFinca] = useState("");
  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState(obtenerFechaActual());
  const [enfermedad, setEnfermedad] = useState("");
  const [severidad, setSeveridad] = useState("");
  const [reporte, setReporte] = useState("");
  const [responsable, setResponsable] = useState("");

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);
  const [catalogoEnf, setCatalogoEnf] = useState([]);
  const [catalogoSev, setCatalogoSev] = useState([]);

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

        const [f, e, ce, cs] = await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          enfermedadesService.getCatalogo(),
          enfermedadesService.getCatalogoSeveridades(),
        ]);

        if (!activo) return;

        setFincas(Array.isArray(f) ? f : []);
        setEstanques(Array.isArray(e) ? e : []);
        setCatalogoEnf(Array.isArray(ce) ? ce : []);
        setCatalogoSev(Array.isArray(cs) ? cs : []);
      } catch (error) {
        if (!activo) return;
        setTipoMensaje("danger");
        setMensaje(error.message);
      } finally {
        if (activo) setCargandoOpciones(false);
      }
    }

    cargarOpciones();
    return () => { activo = false; };
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

        const registro = await enfermedadesService.getById(registroId);
        if (!activo || !registro) return;

        setFinca(String(registro.fincaId ?? registro.finca_id ?? ""));
        setEstanque(String(registro.estanqueId ?? registro.estanque_id ?? ""));
        setFechaReporte(formatearFechaUI(registro.fechaReporte ?? registro.fecha_reporte ?? registro.fecha));
        setEnfermedad(registro.enfermedad ?? "");
        setSeveridad(registro.severidad ?? "");
        setReporte(registro.reporte ?? "");
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
    return () => { activo = false; };
  }, [registroId]);

  const opcionesFincas = useMemo(
    () => fincas.map((f) => ({ label: f.nombreFinca, value: String(f.id) })),
    [fincas],
  );

  const opcionesEstanques = useMemo(
    () => estanques
      .filter((e) => Number(e.idFinca) === Number(finca))
      .map((e) => ({ label: e.codigo, value: String(e.id) })),
    [estanques, finca],
  );

  const opcionesEnfermedades = useMemo(() => {
    if (!Array.isArray(catalogoEnf) || catalogoEnf.length === 0) return [];

    return catalogoEnf.map((x) =>
      typeof x === "string"
        ? { label: x, value: x }
        : { label: x.nombre ?? x.label ?? x.value, value: x.value ?? x.codigo ?? x.nombre }
    );
  }, [catalogoEnf]);

  const opcionesSeveridades = useMemo(() => {
    if (!Array.isArray(catalogoSev) || catalogoSev.length === 0) return [];

    return catalogoSev.map((x) =>
      typeof x === "string"
        ? { label: x, value: x }
        : { label: x.nombre ?? x.label ?? x.value, value: x.value ?? x.codigo ?? x.nombre }
    );
  }, [catalogoSev]);

  const cambiarFinca = (v) => { setFinca(String(v)); setEstanque(""); setMensaje(""); };
  const cambiarEstanque = (v) => { setEstanque(String(v)); setMensaje(""); };
  const cambiarFechaReporte = (v) => { setFechaReporte(v); setMensaje(""); };
  const cambiarEnfermedad = (v) => { setEnfermedad(String(v)); setMensaje(""); };
  const cambiarSeveridad = (v) => { setSeveridad(String(v)); setMensaje(""); };
  const cambiarReporte = (v) => { setReporte(v); setMensaje(""); };

  function validarFormulario() {
    if (!finca) return "Seleccione una finca.";
    if (!estanque) return "Seleccione un estanque.";

    const errorFecha = validarFechaReporte(fechaReporte);
    if (errorFecha) return errorFecha;

    if (!enfermedad) return "Seleccione una enfermedad.";
    if (!severidad) return "Seleccione la severidad.";

    return "";
  }

  async function guardarEnfermedad() {
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
      await enfermedadesService.update(registroId, {
        fincaId: Number(finca),
        estanqueId: Number(estanque),
        fechaReporte: convertirFechaParaBackend(fechaReporte),
        enfermedad,
        severidad,
        reporte: reporte.trim() || null,
      });

      setTipoMensaje("success");
      setMensaje("Enfermedad actualizada correctamente.");

      if (onGuardado) onGuardado();
    } catch (error) {
      setTipoMensaje("danger");
      setMensaje(error.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    finca, estanque, fechaReporte, enfermedad, severidad, reporte, responsable,
    opcionesFincas, opcionesEstanques, opcionesEnfermedades, opcionesSeveridades,

    placeholderFinca: "Seleccione una finca",
    placeholderEstanque: "Seleccione un estanque",
    placeholderEnfermedad: "Seleccione enfermedad",
    placeholderSeveridad: "Seleccione severidad",

    gridStyle: undefined,
    itemStyle: undefined,
    itemFullStyle: undefined,

    errorFinca: submitted && !finca,
    errorEstanque: submitted && !estanque,
    errorFechaReporte: submitted && validarFechaReporte(fechaReporte) !== "",
    errorEnfermedad: submitted && !enfermedad,
    errorSeveridad: submitted && !severidad,

    mensaje,
    tipoMensaje,
    loading: loading || cargandoOpciones,
    cargandoRegistro,

    cambiarFinca,
    cambiarEstanque,
    cambiarFechaReporte,
    cambiarEnfermedad,
    cambiarSeveridad,
    cambiarReporte,
    guardarEnfermedad,
  };
}