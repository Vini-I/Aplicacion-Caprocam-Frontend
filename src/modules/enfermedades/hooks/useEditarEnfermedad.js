/**
 * Calco de useEnfermedadesScreen para edición (misma API `pantalla`).
 */
import { useCallback, useEffect, useMemo, useState } from "react";
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

export default function useEditarEnfermedad(registroId, onGuardado) {
  const [finca, setFinca] = useState("");
  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState(obtenerFechaActual());
  const [enfermedad, setEnfermedad] = useState("");
  const [severidad, setSeveridad] = useState("");
  const [mortalidad, setMortalidad] = useState("");
  const [reporte, setReporte] = useState("");
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
    let activo = true;
    (async () => {
      try {
        setCargandoOpciones(true);
        const [f, e, ce, cs] = await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          enfermedadesService.getCatalogo?.() ?? Promise.resolve([]),
          enfermedadesService.getCatalogoSeveridades?.() ?? Promise.resolve([]),
        ]);
        if (!activo) return;
        setFincas(Array.isArray(f) ? f : []);
        setEstanques(Array.isArray(e) ? e : []);
        setCatalogoEnf(Array.isArray(ce) ? ce : []);
        setCatalogoSev(Array.isArray(cs) ? cs : []);
      } catch (err) {
        console.error(err);
      } finally {
        if (activo) setCargandoOpciones(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    if (!registroId) { setCargandoRegistro(false); return; }
    let activo = true;
    setCargandoRegistro(true);
    enfermedadesService.getById(registroId)
      .then((r) => {
        if (!activo || !r) return;
        setFinca(String(r.fincaId ?? r.finca_id ?? ""));
        setEstanque(String(r.estanqueId ?? r.estanque_id ?? ""));
        setFechaReporte(formatearFechaUI(r.fechaReporte ?? r.fecha));
        setEnfermedad(r.enfermedad ?? "");
        setSeveridad(r.severidad ?? "");
        setMortalidad(String(r.mortalidadRegistrada ?? r.mortalidad ?? ""));
        setReporte(r.reporte ?? "");
      })
      .catch(() => setMensaje("No se pudo cargar el registro."))
      .finally(() => { if (activo) setCargandoRegistro(false); });
    return () => { activo = false; };
  }, [registroId]);

  const opcionesFincas = useMemo(
    () => fincas.map((f) => ({ label: f.nombreFinca, value: String(f.id) })),
    [fincas],
  );
  const opcionesEstanques = useMemo(
    () =>
      estanques
        .filter((e) => Number(e.idFinca ?? e.fincaId) === Number(finca))
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
  const cambiarMortalidad = (v) => { setMortalidad(String(v)); setMensaje(""); };
  const cambiarReporte = (v) => { setReporte(v); setMensaje(""); };

  const validar = () => {
    const m = Number(mortalidad);
    return Boolean(finca && estanque && fechaReporte && enfermedad && severidad && reporte.trim() && !Number.isNaN(m) && m >= 0);
  };

  const guardarEnfermedad = async () => {
    setSubmitted(true);
    setMensaje("");
    if (!validar()) {
      setTipoMensaje("danger");
      setMensaje("Rellene los datos requeridos correctamente.");
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
        mortalidadRegistrada: Number(mortalidad) || 0,
        reporte: reporte.trim(),
      });
      setTipoMensaje("success");
      setMensaje("Enfermedad actualizada correctamente.");
      onGuardado?.();
    } catch (e) {
      setTipoMensaje("danger");
      setMensaje(e.response?.data?.message || "No se pudo actualizar.");
    } finally {
      setLoading(false);
    }
  };

  return {
    finca, estanque, fechaReporte, responsable: "", enfermedad, severidad, mortalidad, reporte,
    opcionesFincas, opcionesEstanques, opcionesEnfermedades, opcionesSeveridades,
    placeholderFinca: "Seleccione una finca",
    placeholderEstanque: "Seleccione un estanque",
    placeholderEnfermedad: "Seleccione enfermedad",
    placeholderSeveridad: "Seleccione severidad",
    gridStyle: undefined, itemStyle: undefined, itemFullStyle: undefined,
    errorFinca: submitted && !finca,
    errorEstanque: submitted && !estanque,
    errorFechaReporte: submitted && !fechaReporte,
    errorEnfermedad: submitted && !enfermedad,
    errorSeveridad: submitted && !severidad,
    errorReporte: submitted && !reporte.trim(),
    mensaje, tipoMensaje,
    loading: loading || cargandoOpciones,
    cargandoRegistro,
    cambiarFinca, cambiarEstanque, cambiarFechaReporte, cambiarEnfermedad,
    cambiarSeveridad, cambiarMortalidad, cambiarReporte, guardarEnfermedad,
  };
}
