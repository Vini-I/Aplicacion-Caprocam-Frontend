/**
 * Calco de useEnfermedadesScreen para edición (misma API `pantalla`).
 */

import { useEffect, useMemo, useState } from "react";
import enfermedadesService from "../services/EnfermedadesService.js";
import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { getSiembras } from "../../siembra/services/siembra.service.js";

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

function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function obtenerIdFinca(finca) {
  return Number(finca?.id ?? finca?.fincaId ?? finca?.idFinca ?? finca?.finca_id ?? 0);
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
  const estado = normalizarTexto(estanque?.estado);

  return (
    estado === "activo" ||
    estado === "engorde" ||
    estado === "mantenimiento"
  );
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

  return estanques.find((item) => obtenerIdEstanque(item) === Number(estanqueId)) ?? null;
}

function validarEstanqueParaRegistro(estanqueId, estanques, siembras) {
  const estanque = buscarEstanque(estanques, estanqueId);

  if (!estanque) return "Seleccione un estanque valido.";
  if (!estanqueEstaOperativo(estanque)) return "El estanque seleccionado no esta activo.";

  if (!tieneSiembraActiva(estanqueId, siembras))
    return "El estanque seleccionado no tiene una siembra activa.";

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
  const [siembras, setSiembras] = useState([]);
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

        const [f, e, s, ce, cs] = await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          getSiembras(),
          enfermedadesService.getCatalogo(),
          enfermedadesService.getCatalogoSeveridades(),
        ]);

        if (!activo) return;

        setFincas(Array.isArray(f) ? f : []);
        setEstanques(Array.isArray(e) ? e : []);
        setSiembras(Array.isArray(s) ? s : []);
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
    () =>
      fincas
        .map((f) => ({
          label: String(
            f.nombreFinca ??
              f.nombre_finca ??
              f.nombre ??
              f.codigoCBO ??
              `Finca ${obtenerIdFinca(f)}`,
          ),
          value: String(obtenerIdFinca(f)),
        }))
        .filter((item) => Number(item.value) > 0),
    [fincas],
  );

  const opcionesEstanques = useMemo(
    () =>
      estanques
        .filter((e) => {
          const estanqueId = obtenerIdEstanque(e);

          return (
            obtenerFincaIdEstanque(e) === Number(finca) &&
            estanqueEstaOperativo(e) &&
            tieneSiembraActiva(estanqueId, siembras)
          );
        })
        .map((e) => ({
          label: String(e.codigo ?? e.nombre ?? `Estanque ${obtenerIdEstanque(e)}`),
          value: String(obtenerIdEstanque(e)),
        }))
        .filter((item) => Number(item.value) > 0),
    [estanques, finca, siembras],
  );

  const opcionesEnfermedades = useMemo(() => {
    if (!Array.isArray(catalogoEnf) || catalogoEnf.length === 0) return [];

    return catalogoEnf.map((x) =>
      typeof x === "string"
        ? { label: x, value: x }
        : {
            label: x.nombre ?? x.label ?? x.value,
            value: x.value ?? x.codigo ?? x.nombre,
          },
    );
  }, [catalogoEnf]);

  const opcionesSeveridades = useMemo(() => {
    if (!Array.isArray(catalogoSev) || catalogoSev.length === 0) return [];

    return catalogoSev.map((x) =>
      typeof x === "string"
        ? { label: x, value: x }
        : {
            label: x.nombre ?? x.label ?? x.value,
            value: x.value ?? x.codigo ?? x.nombre,
          },
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

    const errorEstanqueOperativo = validarEstanqueParaRegistro(
      estanque,
      estanques,
      siembras,
    );

    if (errorEstanqueOperativo) return errorEstanqueOperativo;

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