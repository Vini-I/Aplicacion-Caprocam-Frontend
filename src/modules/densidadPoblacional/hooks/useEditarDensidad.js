/**
 * ============================================================
 * HOOK USEEDITARDENSIDAD
 * ============================================================
 */
import { useState, useEffect, useCallback } from "react";
import densidadPoblacionalService from "../services/DensidadPoblacional.service.js";

function registroAForm(registro) {
  if (!registro) return {};
  let fecha = registro.fecha ?? "";
  if (typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
    const [y, m, d] = fecha.slice(0, 10).split("-");
    fecha = `${d}/${m}/${y}`;
  }
  return {
    idFinca: String(registro.idFinca ?? registro.fincaId ?? ""),
    idEstanque: String(registro.idEstanque ?? registro.estanqueId ?? ""),
    fecha,
    numeroCamarones: String(registro.numeroCamarones ?? ""),
    tirosAtarraya: String(registro.tirosAtarraya ?? ""),
    areaAtarraya: String(registro.areaAtarraya ?? ""),
    promedioPorTiro: String(registro.promedioPorTiro ?? ""),
    sobrevivencia: String(registro.sobrevivencia ?? registro.supervivencia ?? ""),
    cantidadSiembra: String(registro.cantidadSiembra ?? registro.siembraPorM2 ?? ""),
    areaEstanque: String(registro.areaEstanque ?? ""),
    notasConteo: registro.notasConteo ?? "",
  };
}

function formADto(form) {
  let fechaBackend = form.fecha;
  if (fechaBackend && fechaBackend.includes("/")) {
    const [d, m, y] = fechaBackend.split("/");
    fechaBackend = `${y}-${m}-${d}`;
  }
  return {
    idFinca: Number(form.idFinca),
    idEstanque: Number(form.idEstanque),
    fecha: fechaBackend,
    numeroCamarones: Number(form.numeroCamarones) || 0,
    tirosAtarraya: Number(form.tirosAtarraya) || 0,
    areaAtarraya: Number(form.areaAtarraya) || 0,
    promedioPorTiro: Number(form.promedioPorTiro) || 0,
    sobrevivencia: Number(form.sobrevivencia) || 0,
    notasConteo: (form.notasConteo || "").trim() || "No hay notas",
    cantidadSiembra: Number(form.cantidadSiembra) || 0,
    areaEstanque: Number(form.areaEstanque) || 0,
  };
}

function validarForm(form) {
  const errores = {};
  if (!form.fecha) errores.fecha = "Obligatorio";
  return { valido: Object.keys(errores).length === 0, errores };
}

export default function useEditarDensidad(registroId, onGuardado) {
  const [form, setForm] = useState({
    idFinca: "",
    idEstanque: "",
    fecha: "",
    numeroCamarones: "",
    tirosAtarraya: "",
    areaAtarraya: "",
    promedioPorTiro: "",
    sobrevivencia: "",
    cantidadSiembra: "",
    areaEstanque: "",
    notasConteo: "",
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
    densidadPoblacionalService
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
      await densidadPoblacionalService.update(registroId, formADto(form));
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
