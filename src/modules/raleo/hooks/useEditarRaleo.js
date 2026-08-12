/**
 * ============================================================
 * HOOK USEEDITARRALEO
 * ============================================================
 *
 * Calco de useRaleoScreen para edición. Reusa useRaleo + RaleoForm.
 *
 * CAMBIO (documento de requerimientos): igual que en el alta, el
 * usuario edita los kilogramos retirados y la biomasa previa; el
 * porcentaje y la biomasa restante se recalculan y se muestran de
 * solo lectura. Se eliminaron del formulario `porcentajeRaleo`,
 * `pesoPromedio`, `objetivo` y `metodo`.
 *
 * registroAForm() acepta los nombres viejos como alias
 * (`biomasaEstimado`, `pesoEstimado`) además de los nuevos, para
 * que los registros creados antes del cambio se sigan abriendo
 * sin quedar en blanco.
 */

import { useState, useEffect, useCallback } from "react";
import useRaleo from "./useRaleo";
import { calcularRaleo } from "./useRaleoScreen";
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
    biomasaAntes: String(registro.biomasaAntes ?? registro.biomasaEstimado ?? ""),
    kgRetirados: String(registro.kgRetirados ?? registro.pesoEstimado ?? ""),
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
  /*
  Solo se envian los datos que el usuario captura. El porcentaje y
  la biomasa restante los recalcula el backend al guardar, para que
  exista una sola fuente de verdad de las formulas.
  */
  return {
    idFinca: form.finca,
    idEstanque: form.estanque,
    fecha: convertirFecha(form.fecha),
    biomasaAntes: Number(form.biomasaAntes),
    kgRetirados: Number(form.kgRetirados),
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

  const { porcentaje: porcentajeRaleo, biomasaRestante } = calcularRaleo(
    form.biomasaAntes,
    form.kgRetirados
  );

  const handleGuardar = useCallback(async () => {
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
      setAlerta({
        visible: true,
        variant: "danger",
        mensaje: error.message,
      });
    }
  }, [form, registroId, onGuardado, validarForm]);

  return {
    form,
    updateField,
    porcentajeRaleo,
    biomasaRestante,
    submitted,
    errores,
    alerta,
    handleGuardar,
    cargando,
  };
}
