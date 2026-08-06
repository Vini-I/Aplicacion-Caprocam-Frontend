/**
 * ============================================================
 * HOOK: useEquipoForm
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Encapsular el estado, validación y envío del formulario de creación/edición de equipos.
 *
 * @dependencies - React (useState, useEffect, useCallback)
 * @validations  - Valida campos obligatorios (código, tipo, función, horas uso) y acumula errores por campo.
 * @navigation   - Ninguna
 */

import { useState, useEffect, useCallback } from "react";

// ============================================================
// VALIDADORES
// ============================================================
const validarNombre = (nombre) => {
  if (!nombre || !nombre.trim()) return "El nombre del equipo es obligatorio";
  if (nombre.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  return "";
};

const validarDescripcion = (descripcion) => {
  if (!descripcion || !descripcion.trim()) return "La descripción es obligatoria";
  if (descripcion.trim().length < 5) return "La descripción debe tener al menos 5 caracteres";
  return "";
};

const validarFuncion = (funcion) => {
  if (!funcion || !funcion.trim()) return "La función del equipo es obligatoria";
  return "";
};

const validarHorasMantenimiento = (horas) => {
  if (!horas) return "";
  if (Number(horas) <= 0) return "Las horas de mantenimiento deben ser mayores a 0";
  return "";
};

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

// ============================================================
// HOOK
// ============================================================
export function useEquipoForm({ initialData = {}, onSubmit, isEditing = false, onValidationError }) {
  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------
  const [form, setForm] = useState({
    nombre: initialData.nombre || "",
    descripcion: initialData.descripcion || "",
    tipo: initialData.tipo || "",
    fechaInstalacion: initialData.fechaInstalacion || obtenerFechaActual(),
    funcionEquipo: initialData.funcionEquipo || "",
    estanqueId: initialData.estanqueId || "",
    estado: initialData.estado || "activo",
    horasMantenimiento: initialData.horasMantenimiento || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Actualizar formulario cuando cambian los datos iniciales (para edición)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        tipo: initialData.tipo || "",
        fechaInstalacion: initialData.fechaInstalacion || "",
        funcionEquipo: initialData.funcionEquipo || "",
        estanqueId: initialData.estanqueId || "",
        estado: initialData.estado || "activo",
        horasMantenimiento: initialData.horasMantenimiento || "",
      });
    }
  }, [initialData]);

  // --------------------------------------------------------
  // MANEJADORES
  // --------------------------------------------------------
  const handleChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    const nombreError = validarNombre(form.nombre);
    if (nombreError) newErrors.nombre = nombreError;

    const descError = validarDescripcion(form.descripcion);
    if (descError) newErrors.descripcion = descError;

    if (!form.tipo) newErrors.tipo = "Debe seleccionar un tipo de equipo";

    if (!form.fechaInstalacion) newErrors.fechaInstalacion = "La fecha de instalación es obligatoria";

    const funcionError = validarFuncion(form.funcionEquipo);
    if (funcionError) newErrors.funcionEquipo = funcionError;

    const horasError = validarHorasMantenimiento(form.horasMantenimiento);
    if (horasError) newErrors.horasMantenimiento = horasError;

    setErrors(newErrors);
    return newErrors;
  }, [form]);

  const getValidationMessage = useCallback(() => {
    const erroresActuales = validateForm();
    const mensajes = Object.values(erroresActuales).filter((msg) => msg !== "");
    if (mensajes.length === 0) return "";
    return (
      "Revisa los campos obligatorios marcados con *:\n" +
      mensajes.map((m) => `- ${m}`).join("\n")
    );
  }, [validateForm]);

  const handleSubmit = useCallback(async () => {
    setSubmitted(true);
    const erroresActuales = validateForm();
    const hasErrors = Object.values(erroresActuales).some((msg) => msg !== "");

    if (hasErrors) {
      if (onValidationError) {
        onValidationError(getValidationMessage());
      }
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...form,
        horasMantenimiento: form.horasMantenimiento ? Number(form.horasMantenimiento) : 500,
      };
      await onSubmit(submitData);
    } finally {
      setLoading(false);
    }
  }, [form, validateForm, getValidationMessage, onSubmit, onValidationError]);

  const resetForm = useCallback(() => {
    setForm({
      nombre: "",
      descripcion: "",
      tipo: "",
      fechaInstalacion: "",
      funcionEquipo: "",
      estanqueId: "",
      estado: "activo",
      horasMantenimiento: "",
    });
    setErrors({});
    setSubmitted(false);
  }, []);

  const isFormValid = useCallback(() => {
    const nombreError = validarNombre(form.nombre);
    const descError = validarDescripcion(form.descripcion);
    const funcionError = validarFuncion(form.funcionEquipo);

    return !nombreError && !descError && form.tipo && form.fechaInstalacion && !funcionError;
  }, [form]);

  // --------------------------------------------------------
  // RETORNO
  // --------------------------------------------------------
  return {
    form,
    errors,
    loading,
    submitted,
    handleChange,
    handleSubmit,
    resetForm,
    isFormValid: isFormValid(),
    getValidationMessage,
  };
}