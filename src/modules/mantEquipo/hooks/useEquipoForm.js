/**
 * ============================================================
 * HOOK PERSONALIZADO: useEquipoForm
 * ============================================================
 *
 * Hook que encapsula la lógica del formulario de equipos.
 * Maneja el estado del formulario, validaciones y envío.
 *
 * Parámetros:
 * - initialData: datos iniciales para edición
 * - onSubmit: función a ejecutar al enviar el formulario
 * - isEditing: booleano que indica si es edición
 *
 * Retorna:
 * - form: objeto con los datos del formulario
 * - errors: objeto con los errores de validación
 * - loading: booleano de carga
 * - handleChange: función para actualizar un campo
 * - handleSubmit: función para validar y enviar el formulario
 * - resetForm: función para reiniciar el formulario
 * - isFormValid: booleano que indica si el formulario es válido
 *
 * Ejemplo:
 * const { form, handleChange, handleSubmit } = useEquipoForm({
 *   initialData: equipo,
 *   onSubmit: guardarEquipo,
 *   isEditing: true,
 * });
 */

// ============================================================
// IMPORTS
// ============================================================
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

const validarMarca = (marca) => {
  if (!marca || !marca.trim()) return "La marca es obligatoria";
  return "";
};

const validarModelo = (modelo) => {
  if (!modelo || !modelo.trim()) return "El modelo es obligatorio";
  return "";
};

const validarSerie = (serie) => {
  if (!serie || !serie.trim()) return "El número de serie es obligatorio";
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
export function useEquipoForm({ initialData = {}, onSubmit, isEditing = false }) {
  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------
  const [form, setForm] = useState({
    nombre: initialData.nombre || "",
    descripcion: initialData.descripcion || "",
    tipo: initialData.tipo || "",
    subcategoria: initialData.subcategoria || "",
    marca: initialData.marca || "",
    modelo: initialData.modelo || "",
    serie: initialData.serie || "",
    fechaInstalacion: initialData.fechaInstalacion || obtenerFechaActual(),
    funcionEquipo: initialData.funcionEquipo || "",
    ubicacion: initialData.ubicacion || "",
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
        subcategoria: initialData.subcategoria || "",
        marca: initialData.marca || "",
        modelo: initialData.modelo || "",
        serie: initialData.serie || "",
        fechaInstalacion: initialData.fechaInstalacion || "",
        funcionEquipo: initialData.funcionEquipo || "",
        ubicacion: initialData.ubicacion || "",
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
    
    const marcaError = validarMarca(form.marca);
    if (marcaError) newErrors.marca = marcaError;
    
    const modeloError = validarModelo(form.modelo);
    if (modeloError) newErrors.modelo = modeloError;
    
    const serieError = validarSerie(form.serie);
    if (serieError) newErrors.serie = serieError;
    
    if (!form.fechaInstalacion) newErrors.fechaInstalacion = "La fecha de instalación es obligatoria";
    
    const funcionError = validarFuncion(form.funcionEquipo);
    if (funcionError) newErrors.funcionEquipo = funcionError;
    
    const horasError = validarHorasMantenimiento(form.horasMantenimiento);
    if (horasError) newErrors.horasMantenimiento = horasError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    setSubmitted(true);
    if (!validateForm()) return;
    
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
  }, [form, validateForm, onSubmit]);

  const resetForm = useCallback(() => {
    setForm({
      nombre: "",
      descripcion: "",
      tipo: "",
      subcategoria: "",
      marca: "",
      modelo: "",
      serie: "",
      fechaInstalacion: "",
      funcionEquipo: "",
      ubicacion: "",
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
    const marcaError = validarMarca(form.marca);
    const modeloError = validarModelo(form.modelo);
    const serieError = validarSerie(form.serie);
    const funcionError = validarFuncion(form.funcionEquipo);
    
    return !nombreError && !descError && form.tipo && !marcaError && 
           !modeloError && !serieError && form.fechaInstalacion && !funcionError;
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
  };
}