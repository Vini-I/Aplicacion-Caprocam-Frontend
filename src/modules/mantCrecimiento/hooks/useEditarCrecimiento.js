/**
 * ============================================================
 * HOOK USEEDITARCRECIMIENTO
 * ============================================================
 * Mismo patrón que useEditarAlimentacionScreen del compañero:
 * getById → precarga → validar → update → onGuardado.
 */
import { useState, useEffect, useCallback } from "react";
import crecimientoService from "../services/mantCrecimiento.service.js";

function registroAForm(registro) {
  if (!registro) return {};
  let fecha = registro.fechaRegistro ?? registro.fecha_registro ?? registro.fecha ?? "";
  // backend YYYY-MM-DD → UI DD/MM/YYYY (como useFincaCrecimiento)
  if (typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
    const [y, m, d] = fecha.slice(0, 10).split("-");
    fecha = `${d}/${m}/${y}`;
  }
  return {
    finca: String(registro.finca ?? registro.fincaId ?? registro.finca_id ?? ""),
    estanque: String(registro.estanque ?? registro.estanqueId ?? registro.estanque_id ?? ""),
    pesoActual: String(registro.pesoActual ?? registro.peso_actual ?? ""),
    fechaRegistro: fecha,
    colaborador: String(
      registro.colaborador ?? registro.colaboradorId ?? registro.colaborador_id ?? ""
    ),
  };
}

function formADto(form) {
  let fechaBackend = form.fechaRegistro;
  if (fechaBackend && fechaBackend.includes("/")) {
    const [d, m, y] = fechaBackend.split("/");
    fechaBackend = `${y}-${m}-${d}`;
  }
  return {
    finca: Number(form.finca),
    estanque: Number(form.estanque),
    pesoActual: Number(form.pesoActual),
    fechaRegistro: fechaBackend,
    colaborador: Number(form.colaborador),
  };
}

function validarForm(form) {
  const errores = {};
  if (!form.finca) errores.finca = "Seleccione una finca.";
  if (!form.estanque) errores.estanque = "Seleccione un estanque.";
  if (!form.pesoActual || Number(form.pesoActual) <= 0) {
    errores.peso = "Ingrese un peso actual válido.";
  }
  if (!form.fechaRegistro) errores.fecha = "Seleccione una fecha.";
  if (!form.colaborador) errores.colaborador = "Seleccione un colaborador.";
  return { valido: Object.keys(errores).length === 0, errores };
}

export default function useEditarCrecimiento(registroId, onGuardado) {
  const [form, setForm] = useState({
    finca: "",
    estanque: "",
    pesoActual: "",
    fechaRegistro: "",
    colaborador: "",
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
    crecimientoService
      .getById(registroId)
      .then((registro) => {
        if (!activo) return;
        const valores = registroAForm(registro);
        setForm((prev) => ({ ...prev, ...valores }));
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
      await crecimientoService.update(registroId, formADto(form));
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
