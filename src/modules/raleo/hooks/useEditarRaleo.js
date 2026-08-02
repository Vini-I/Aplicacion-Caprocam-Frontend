/**
 * ============================================================
 * HOOK USEEDITARRALEO
 * ============================================================
 * Igual que useEditarAlimentacion: reusa useRaleo (form + validarForm).
 */
import { useState, useEffect, useCallback } from "react";
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
    colaborador: String(
      registro.idColaborador ?? registro.colaboradorId ?? registro.colaborador ?? ""
    ),
    fecha,
    porcentajeRaleo: String(
      registro.porcentajeRaleo ?? registro.porcentaje ?? ""
    ),
    pesoPromedio: String(
      registro.pesoPromedio ?? registro.pesoEstimado ?? ""
    ),
    biomasaActual: String(
      registro.biomasaActual ?? registro.biomasaEstimado ?? ""
    ),
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
    idColaborador: form.colaborador ? Number(form.colaborador) : undefined,
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
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState({
    visible: false,
    variant: "success",
    mensaje: "",
  });

  useEffect(() => {
    if (!registroId) {
      setCargando(false);
      return;
    }
    let activo = true;
    setCargando(true);
    raleoService
      .getById(registroId)
      .then((registro) => {
        if (!activo) return;
        const valores = registroAForm(registro);
        Object.entries(valores).forEach(([campo, valor]) =>
          updateField(campo, valor)
        );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registroId]);

  const handleGuardar = useCallback(async () => {
    setSubmitted(true);
    const { valido, errores: err } = validarForm();
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
      await raleoService.update(registroId, formADto(form));
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
  }, [form, registroId, onGuardado, validarForm]);

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
