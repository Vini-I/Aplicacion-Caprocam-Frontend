/**
 * ============================================================
 * HOOK USEEDITARPARASITOLOGIA
 * ============================================================
 */
import { useState, useEffect, useCallback } from "react";
import parasitologiaService from "../services/ParasitologiaService.js";

function registroAForm(registro) {
  if (!registro) return {};
  let fecha = registro.fechaReporte ?? registro.fecha ?? "";
  if (typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
    const [y, m, d] = fecha.slice(0, 10).split("-");
    fecha = `${d}/${m}/${y}`;
  }
  return {
    fincaId: String(registro.fincaId ?? registro.finca_id ?? ""),
    estanqueId: String(registro.estanqueId ?? registro.estanque_id ?? ""),
    fechaReporte: fecha,
    parasito: registro.parasito ?? "",
    camaronesMuestreados: String(registro.camaronesMuestreados ?? ""),
    camaronesInfectados: String(registro.camaronesInfectados ?? ""),
    observaciones: registro.observaciones ?? "",
  };
}

function formADto(form) {
  let fechaBackend = form.fechaReporte;
  if (fechaBackend && fechaBackend.includes("/")) {
    const [d, m, y] = fechaBackend.split("/");
    fechaBackend = `${y}-${m}-${d}`;
  }
  return {
    fincaId: Number(form.fincaId),
    estanqueId: Number(form.estanqueId),
    fechaReporte: fechaBackend,
    parasito: form.parasito,
    camaronesMuestreados: Number(form.camaronesMuestreados) || 0,
    camaronesInfectados: Number(form.camaronesInfectados) || 0,
    observaciones: (form.observaciones || "").trim() || null,
  };
}

function validarForm(form) {
  const errores = {};
  if (!form.fechaReporte) errores.fechaReporte = "Obligatorio";
  if (!form.parasito) errores.parasito = "Obligatorio";
  return { valido: Object.keys(errores).length === 0, errores };
}

export default function useEditarParasitologia(registroId, onGuardado) {
  const [form, setForm] = useState({
    fincaId: "",
    estanqueId: "",
    fechaReporte: "",
    parasito: "",
    camaronesMuestreados: "",
    camaronesInfectados: "",
    observaciones: "",
  });
  const [cargando, setCargando] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState({
    visible: false,
    variant: "success",
    mensaje: "",
  });

  const updateField = useCallback((campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  useEffect(() => {
    if (!registroId) {
      setCargando(false);
      return;
    }
    let activo = true;
    setCargando(true);
    parasitologiaService
      .getById(registroId)
      .then((registro) => {
        if (!activo) return;
        setForm((prev) => ({ ...prev, ...registroAForm(registro) }));
      })
      .catch(() => {
        if (activo) {
          setAlerta({
            visible: true,
            variant: "error",
            mensaje: "No se pudo cargar el registro.",
          });
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [registroId]);

  const handleGuardar = useCallback(async () => {
    setSubmitted(true);
    const { valido, errores: err } = validarForm(form);
    setErrores(err);
    if (!valido) {
      setAlerta({
        visible: true,
        variant: "error",
        mensaje: "Revisá los campos marcados.",
      });
      return;
    }
    setGuardando(true);
    try {
      await parasitologiaService.update(registroId, formADto(form));
      setAlerta({
        visible: true,
        variant: "success",
        mensaje: "Registro actualizado correctamente.",
      });
      onGuardado?.();
    } catch (error) {
      setAlerta({
        visible: true,
        variant: "error",
        mensaje:
          error.response?.data?.message || "No se pudo actualizar el registro.",
      });
    } finally {
      setGuardando(false);
    }
  }, [form, registroId, onGuardado]);

  return {
    form,
    updateField,
    cargando,
    submitted,
    errores,
    alerta,
    guardando,
    handleGuardar,
  };
}
