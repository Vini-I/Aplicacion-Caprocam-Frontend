/**
 * Calco de useDensidadPoblacional para edición.
 */
import { useCallback, useEffect, useState } from "react";
import densidadPoblacionalService from "../services/DensidadPoblacional.service.js";
import useFincaEstanqueDensidad from "./useFincaEstanqueDensidad";

function hoy() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function toMysqlDate(fecha) {
  if (!fecha) return "";
  if (fecha.includes("-") && !fecha.includes("/")) return fecha.slice(0, 10);
  const [d, m, y] = fecha.split("/");
  return `${y}-${m}-${d}`;
}

function formatearFechaUI(fecha) {
  if (!fecha) return hoy();
  if (typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
    const [y, m, d] = fecha.slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
  }
  return fecha;
}

export default function useEditarDensidad(registroId, onGuardado) {
  const [finca, setFinca] = useState(null);
  const [estanque, setEstanque] = useState(null);
  const [fecha, setFecha] = useState(hoy());
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState({ visible: false, variant: "success", mensaje: "" });
  const [cargando, setCargando] = useState(true);

  const [numeroCamarones, setNumeroCamarones] = useState("");
  const [tirosAtarraya, setTirosAtarraya] = useState("");
  const [areaAtarraya, setAreaAtarraya] = useState("");
  const [promedioPorTiro, setPromedioPorTiro] = useState("");
  const [supervivencia, setSupervivencia] = useState("");
  const [siembraPorM2, setSiembraPorM2] = useState("");
  const [areaEstanque, setAreaEstanque] = useState("");
  const [notasConteo, setNotasConteo] = useState("");

  const { fincasOptions, estanquesOptions } = useFincaEstanqueDensidad(finca);
  const fincas = fincasOptions;
  const estanques = estanquesOptions;

  const setFincaYResetEstanque = useCallback((v) => {
    setFinca(v);
    setEstanque(null);
  }, []);

  useEffect(() => {
    if (!registroId) { setCargando(false); return; }
    let activo = true;
    setCargando(true);
    densidadPoblacionalService.getById(registroId)
      .then((r) => {
        if (!activo || !r) return;
        setFinca(r.idFinca ?? r.fincaId ?? null);
        setEstanque(r.idEstanque ?? r.estanqueId ?? null);
        setFecha(formatearFechaUI(r.fecha));
        setNumeroCamarones(String(r.numeroCamarones ?? ""));
        setTirosAtarraya(String(r.tirosAtarraya ?? ""));
        setAreaAtarraya(String(r.areaAtarraya ?? ""));
        setPromedioPorTiro(String(r.promedioPorTiro ?? ""));
        setSupervivencia(String(r.sobrevivencia ?? r.supervivencia ?? ""));
        setSiembraPorM2(String(r.cantidadSiembra ?? r.siembraPorM2 ?? ""));
        setAreaEstanque(String(r.areaEstanque ?? ""));
        setNotasConteo(r.notasConteo ?? "");
      })
      .catch(() => {
        if (activo) setAlerta({ visible: true, variant: "danger", mensaje: "No se pudo cargar el registro." });
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [registroId]);

  const handleGuardar = useCallback(async () => {
    setSubmitted(true);
    const err = {};
    if (!finca) err.finca = "La finca es obligatoria";
    if (!estanque) err.estanque = "El estanque es obligatorio";
    if (!fecha) err.fecha = "La fecha es obligatoria";
    setErrores(err);
    if (Object.keys(err).length) {
      setAlerta({ visible: true, variant: "danger", mensaje: "Por favor complete todos los campos obligatorios." });
      return;
    }
    try {
      await densidadPoblacionalService.update(registroId, {
        idFinca: finca,
        idEstanque: estanque,
        fecha: toMysqlDate(fecha),
        numeroCamarones,
        tirosAtarraya,
        areaAtarraya,
        promedioPorTiro,
        sobrevivencia: supervivencia,
        notasConteo: notasConteo?.trim() ? notasConteo : "No hay notas",
        cantidadSiembra: siembraPorM2,
        areaEstanque,
      });
      setAlerta({ visible: true, variant: "success", mensaje: "Registro actualizado exitosamente" });
      onGuardado?.();
    } catch (e) {
      setAlerta({
        visible: true,
        variant: "danger",
        mensaje: e.response?.data?.message || "No se pudo actualizar el registro.",
      });
    }
  }, [finca, estanque, fecha, numeroCamarones, tirosAtarraya, areaAtarraya, promedioPorTiro, supervivencia, siembraPorM2, areaEstanque, notasConteo, registroId, onGuardado]);

  return {
    finca,
    setFinca: setFincaYResetEstanque,
    estanque,
    setEstanque,
    fecha,
    setFecha,
    fincas,
    estanques,
    submitted,
    errores,
    alerta,
    handleGuardar,
    cargando,
    numeroCamarones,
    setNumeroCamarones,
    tirosAtarraya,
    setTirosAtarraya,
    areaAtarraya,
    setAreaAtarraya,
    promedioPorTiro,
    setPromedioPorTiro,
    supervivencia,
    setSupervivencia,
    siembraPorM2,
    setSiembraPorM2,
    areaEstanque,
    setAreaEstanque,
    notasConteo,
    setNotasConteo,
  };
}
