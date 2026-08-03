/**
 * Calco de useRaleoScreen para edición. Reusa useRaleo + RaleoForm.
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import useRaleo from "./useRaleo";
import raleoService from "../services/Raleo.service.js";

function registroAForm(registro) {
  if (!registro) return {};
  let fecha = registro.fecha ?? "";
  if (typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
    const [y, m, d] = fecha.slice(0, 10).split("-");
    fecha = `${d}/${m}/${y}`;
  }
  return {
    finca: String(registro.idFinca ?? registro.fincaId ?? registro.finca ?? ""),
    estanque: String(registro.idEstanque ?? registro.estanqueId ?? registro.estanque ?? ""),
    fecha,
    porcentajeRaleo: String(registro.porcentajeRaleo ?? registro.porcentaje ?? ""),
    pesoPromedio: String(registro.pesoPromedio ?? registro.pesoEstimado ?? ""),
    biomasaActual: String(registro.biomasaActual ?? registro.biomasaEstimado ?? ""),
    objetivo: registro.objetivo ?? "",
    metodo: registro.metodo ?? "",
    observaciones: registro.observaciones ?? "",
  };
}

function convertirFecha(fecha) {
  if (!fecha) return fecha;
  if (fecha.includes("-") && !fecha.includes("/")) return fecha.slice(0, 10);
  const [dia, mes, anio] = fecha.split("/");
  return `${anio}-${mes}-${dia}`;
}

function formADto(form) {
  return {
    idFinca: form.finca,
    idEstanque: form.estanque,
    fecha: convertirFecha(form.fecha),
    porcentaje: Number(form.porcentajeRaleo),
    pesoEstimado: Number(form.pesoPromedio),
    biomasaEstimado: Number(form.biomasaActual),
    objetivo: form.objetivo,
    metodo: form.metodo,
    observaciones: form.observaciones?.trim()
      ? form.observaciones
      : "No se realizan observaciones",
  };
}

export default function useEditarRaleo(registroId, onGuardado) {
  const { form, updateField, validarForm } = useRaleo();
  const [cargando, setCargando] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState({ visible: false, variant: "success", mensaje: "" });

  useEffect(() => {
    if (!registroId) { setCargando(false); return; }
    let activo = true;
    setCargando(true);
    raleoService.getById(registroId)
      .then((registro) => {
        if (!activo) return;
        Object.entries(registroAForm(registro)).forEach(([k, v]) => updateField(k, v));
      })
      .catch(() => {
        if (activo) setAlerta({ visible: true, variant: "danger", mensaje: "No se pudo cargar el registro." });
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registroId]);

  const biomasaRestante = useMemo(() => {
    const b = Number(form.biomasaActual);
    const p = Number(form.porcentajeRaleo);
    if (!b || Number.isNaN(b) || Number.isNaN(p)) return "";
    return (b * (1 - p / 100)).toFixed(2);
  }, [form.biomasaActual, form.porcentajeRaleo]);

  const handleGuardar = useCallback(async (onError) => {
    setSubmitted(true);
    const { valido, errores: err } = validarForm();
    setErrores(err);
    if (!valido) {
      setAlerta({ visible: true, variant: "danger", mensaje: "Rellenar campos obligatorios." });
      return;
    }
    try {
      await raleoService.update(registroId, formADto(form));
      setAlerta({ visible: true, variant: "success", mensaje: "Raleo actualizado correctamente" });
      onGuardado?.();
    } catch (error) {
      onError?.(error);
      setAlerta({
        visible: true,
        variant: "danger",
        mensaje: error.response?.data?.message || "No se pudo actualizar el registro.",
      });
    }
  }, [form, registroId, onGuardado, validarForm]);

  return { form, updateField, biomasaRestante, submitted, errores, alerta, handleGuardar, cargando };
}
