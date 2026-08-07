/**
 * ============================================================
 * HOOK: useColaboradorForm
 * ============================================================
 *
 * Encapsula la lógica del formulario de colaboradores:
 * estado del formulario, validaciones, envío y manejo de errores.
 *
 * Parámetros:
 * - initialData: objeto con datos iniciales (para edición)
 * - isEditing: booleano
 * - userRole: "camprocam_admin" o "external_owner"
 * - fincaId: ID de finca (para asignación automática)
 * - onSubmit: función que recibe los datos al enviar
 * - availableRoles: opciones de roles para el select (array de {label, value})
 *
 * Retorna:
 * - form, errors, submitted, validationMessage (mensaje específico)
 * - handleChange, handleSubmit
 * - rolesDisponibles
 * - handleCedulaChange, handleTelefonoChange, handleNombreChange, handleApellidosChange
 * - resetForm: función para limpiar el formulario y estados de validación
 * ============================================================
 */

import { useState } from "react";

// Constantes y validadores
const ROLES_CAMPROCAM = [
  { label: "Trabajador Camprocam", value: "camprocam_worker" },
  { label: "Dueño Externo", value: "external_owner" },
];
const ROLES_EXTERNO = [{ label: "Trabajador Externo", value: "external_worker" }];

const validarCedula = (cedula) => /^\d{9}$/.test(cedula);
const validarTelefono = (telefono) => /^\d{8}$/.test(telefono);
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validarNombre = (nombre) => nombre.trim().length >= 2;
const validarApellidos = (apellidos) => apellidos.trim().length >= 2;

const INITIAL_FORM = {
  cedula: "",
  nombre: "",
  apellidos: "",
  telefono: "",
  email: "",
  rol: "",
  fincaId: "",
};

export function useColaboradorForm({
  initialData,
  isEditing,
  userRole,
  fincaId,
  onSubmit,
  availableRoles,
  fincasOptions = [],
}) {
  const [form, setForm] = useState({
    cedula: initialData.cedula || "",
    nombre: initialData.nombre?.split(" ")[0] || "",
    apellidos: initialData.nombre?.split(" ").slice(1).join(" ") || "",
    telefono: initialData.telefono || "",
    email: initialData.email || "",
    rol: initialData.rolId ?? initialData.rol ?? "",
    fincaId: initialData.fincaId || fincaId || "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const rolesDisponibles =
    availableRoles ||
    (userRole === "camprocam_admin" ? ROLES_CAMPROCAM : ROLES_EXTERNO);

  // ─── FUNCIONES DE FILTRADO POR CAMPO ──────────────────────

  const handleCedulaChange = (value) => {
    const soloNumeros = value.replace(/\D/g, "").slice(0, 9);
    handleChange("cedula", soloNumeros);
  };

  const handleTelefonoChange = (value) => {
    const soloNumeros = value.replace(/\D/g, "").slice(0, 8);
    handleChange("telefono", soloNumeros);
  };

  const handleNombreChange = (value) => {
    const soloLetras = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
    handleChange("nombre", soloLetras);
  };

  const handleApellidosChange = (value) => {
    const soloLetras = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
    handleChange("apellidos", soloLetras);
  };

  // ─── FUNCIONES EXISTENTES ──────────────────────────────────

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (submitted && validationMessage) {
      setValidationMessage("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let hasError = false;

    // Campos obligatorios básicos
    if (!form.cedula) {
      newErrors.cedula = "La cédula es obligatoria";
      hasError = true;
    } else if (!validarCedula(form.cedula)) {
      newErrors.cedula = "Cédula debe tener 9 dígitos";
      hasError = true;
    }

    if (!form.nombre) {
      newErrors.nombre = "El nombre es obligatorio";
      hasError = true;
    } else if (!validarNombre(form.nombre)) {
      newErrors.nombre = "Nombre debe tener al menos 2 caracteres";
      hasError = true;
    }

    if (!form.apellidos) {
      newErrors.apellidos = "Los apellidos son obligatorios";
      hasError = true;
    } else if (!validarApellidos(form.apellidos)) {
      newErrors.apellidos = "Apellidos deben tener al menos 2 caracteres";
      hasError = true;
    }

    // Rol obligatorio (sin valor por defecto)
    if (!form.rol) {
      newErrors.rol = "El rol es obligatorio";
      hasError = true;
    }

    // Validar fincaId SOLO si el rol requiere finca asociada (IDs 3 y 5)
    const ROLES_CON_FINCA = [3, 5];
    const rolId = Number(form.rol);
    if (ROLES_CON_FINCA.includes(rolId) && !form.fincaId) {
      newErrors.fincaId = "La finca es obligatoria para este rol";
      hasError = true;
    }

    // ─── VALIDACIÓN DE MEDIOS DE CONTACTO (teléfono o email) ───
    const telefonoValido = form.telefono && validarTelefono(form.telefono);
    const emailValido = form.email && validarEmail(form.email);

    // Al menos uno debe estar presente y ser válido
    if (!telefonoValido && !emailValido) {
      // Ambos vacíos o inválidos
      if (!form.telefono) {
        newErrors.telefono = "Debe proporcionar al menos un medio de contacto (teléfono o correo)";
      } else if (!validarTelefono(form.telefono)) {
        newErrors.telefono = "Teléfono debe tener 8 dígitos";
      }
      if (!form.email) {
        newErrors.email = "Debe proporcionar al menos un medio de contacto (teléfono o correo)";
      } else if (!validarEmail(form.email)) {
        newErrors.email = "Correo electrónico inválido";
      }
      hasError = true;
    } else {
      // Si al menos uno es válido, validar el otro si está presente
      if (form.telefono && !validarTelefono(form.telefono)) {
        newErrors.telefono = "Teléfono debe tener 8 dígitos";
        hasError = true;
      }
      if (form.email && !validarEmail(form.email)) {
        newErrors.email = "Correo electrónico inválido";
        hasError = true;
      }
    }

    setErrors(newErrors);
    return { hasError, errors: newErrors };
  };

  // ─── CONSTRUCCIÓN DEL MENSAJE: UN SOLO ERROR A LA VEZ ──────
  // Orden de prioridad: cedula, nombre, apellidos, rol, fincaId, telefono, email
  const buildValidationMessage = (errorsObj) => {
    const order = ['cedula', 'nombre', 'apellidos', 'rol', 'fincaId', 'telefono', 'email'];
    for (const field of order) {
      if (errorsObj[field]) {
        return errorsObj[field];
      }
    }
    return "";
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const { hasError, errors: errorsObj } = validateForm();

    if (hasError) {
      setValidationMessage(buildValidationMessage(errorsObj));
      return;
    }

    setValidationMessage("");
    const fullName = `${form.nombre} ${form.apellidos}`;
    const submitData = { ...form, nombre: fullName };
    delete submitData.apellidos;
    onSubmit(submitData);
  };

  // ─── RESET FORM ──────────────────────────────────────────────
  const resetForm = () => {
    setForm({
      cedula: "",
      nombre: "",
      apellidos: "",
      telefono: "",
      email: "",
      rol: "",
      fincaId: fincaId || "",
    });
    setErrors({});
    setSubmitted(false);
    setValidationMessage("");
  };

  return {
    form,
    errors,
    submitted,
    validationMessage,
    rolesDisponibles,
    fincasOptions,
    handleChange,
    handleCedulaChange,
    handleTelefonoChange,
    handleNombreChange,
    handleApellidosChange,
    handleSubmit,
    resetForm,
  };
}