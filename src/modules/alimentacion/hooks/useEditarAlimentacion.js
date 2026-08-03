/**
 * ============================================================
 * HOOK USEEDITARALIMENTACIONSCREEN
 * ============================================================
 *
 * Carga un registro de alimentación por id, precarga el form
 * de useAlimentacionForm con esos valores, y persiste los
 * cambios contra el backend vía alimentacionService.update().
 * Reusa la misma validación que la creación (validarAlimentacion).
 *
 * Retorna:
 * - form, updateField: estado y setter del formulario.
 * - cargando: true mientras se trae el registro original.
 * - submitted, errores: estado de validación para AlimentacionForm.
 * - alerta: { visible, variant, mensaje } feedback de guardado.
 * - guardando: true mientras se persiste el cambio.
 * - handleGuardar: valida y actualiza si es válido.
 */

import { useState, useEffect, useCallback } from "react";
import useAlimentacionForm from "./useAlimentacionForm";
import alimentacionService from "../services/Alimentacion.service";

function registroAForm(registro) {
  if (!registro) return {};
  return {
    finca: registro.idFinca ?? "",
    estanque: registro.idEstanque ?? "",
    fecha: registro.fecha ?? "",
    hora: registro.hora ?? "",
    metodo: registro.metodo ?? "",
    cantidadKg: registro.cantidadKg ?? "",

    idProveedor: registro.idProveedor != null ? String(registro.idProveedor) : "",
    proveedor: registro.proveedor ?? "",

    idProducto: registro.idProducto != null ? String(registro.idProducto) : "",
    idColaborador: registro.idColaborador ?? "",
    observaciones: registro.observaciones ?? "",
    tipoAlimento: registro.tipoAlimento ?? "",
    presentacion: registro.presentacion ?? "",
    racionesDia: registro.racionesDia ?? 1,
    totalKg: registro.totalKg ?? 0,
    tasaAlimentacion: registro.tasaAlimentacion ?? 0,
    lecturaAM: registro.lecturaAM ?? 0,
    lecturaPM: registro.lecturaPM ?? 0,
  };
}

// Mapeo form -> DTO backend. Mismo criterio que (según el comentario de)
// alimentacionService.create(): idFinca/idEstanque en vez de finca/estanque.
// Confirmar contra el flujo real de creación (GestionAlimentacion.jsx o
// donde llames a alimentacionService.create) que el shape coincide.
function formADto(form) {
  return {
    idFinca: form.finca,
    idEstanque: form.estanque,
    fecha: form.fecha,
    hora: form.hora,
    metodo: form.metodo,
    cantidadKg: Number(form.cantidadKg),
    idProveedor: form.idProveedor,
    proveedor: form.proveedor,
    idProducto: form.idProducto,
    idColaborador: form.idColaborador,
    observaciones: form.observaciones,
    tipoAlimento: form.tipoAlimento,
    presentacion: form.presentacion,
    racionesDia: form.racionesDia,
    totalKg: form.totalKg,
    tasaAlimentacion: form.tasaAlimentacion,
    lecturaAM: form.lecturaAM,
    lecturaPM: form.lecturaPM,
  };
}

export default function useEditarAlimentacionScreen(registroId, onGuardado) {
  const [cargando, setCargando] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [alerta, setAlerta] = useState({ visible: false, variant: "success", mensaje: "" });

  const { form, updateField, resetForm, validarForm } = useAlimentacionForm();
  // resetForm no sirve para precargar valores custom (solo vuelve a
  // estadoInicial), así que precargamos directo con setForm vía updateField
  // en el useEffect de abajo.

  useEffect(() => {
    if (!registroId) {
      setCargando(false);
      return;
    }

    let activo = true;
    setCargando(true);

    alimentacionService
      .getById(registroId)
      .then((registro) => {
        if (!activo) return;
        const valores = registroAForm(registro);
        Object.entries(valores).forEach(([campo, valor]) => updateField(campo, valor));
      })
      .catch(() => {
        if (activo) {
          setAlerta({ visible: true, variant: "error", mensaje: "No se pudo cargar el registro." });
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

  const [errores, setErrores] = useState({});

  const handleGuardar = useCallback(async () => {
    setSubmitted(true);
    const { valido, errores: erroresValidacion } = validarForm();
    setErrores(erroresValidacion);

    if (!valido) {
      setAlerta({ visible: true, variant: "error", mensaje: "Revisá los campos marcados." });
      return;
    }

    setGuardando(true);
    setAlerta({ visible: false, variant: "success", mensaje: "" });

    try {
      await alimentacionService.update(registroId, formADto(form));
      setAlerta({ visible: true, variant: "success", mensaje: "Registro actualizado correctamente." });
      onGuardado?.();
    } catch (error) {
      setAlerta({
        visible: true,
        variant: "error",
        mensaje: error.response?.data?.message || "No se pudo actualizar el registro.",
      });
    } finally {
      setGuardando(false);
    }
  }, [form, registroId, onGuardado]);

  return { form, updateField, cargando, submitted, errores, alerta, guardando, handleGuardar };
}