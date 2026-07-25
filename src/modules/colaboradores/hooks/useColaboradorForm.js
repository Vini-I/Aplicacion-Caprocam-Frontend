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
 *
 * Retorna:
 * - form, errors, submitted, validationMessage
 * - handleChange, handleSubmit
 * - rolesDisponibles
 * - handleCedulaChange, handleTelefonoChange, handleNombreChange, handleApellidosChange
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

export function useColaboradorForm({ initialData, isEditing, userRole, fincaId, onSubmit }) {
  const [form, setForm] = useState({
    cedula: initialData.cedula || "",
    nombre: initialData.nombre?.split(" ")[0] || "",
    apellidos: initialData.nombre?.split(" ").slice(1).join(" ") || "",
    telefono: initialData.telefono || "",
    email: initialData.email || "",
    rol: initialData.rol || (userRole === "camprocam_admin" ? "camprocam_worker" : "external_worker"),
    fincaId: initialData.fincaId || fincaId || "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const rolesDisponibles = userRole === "camprocam_admin" ? ROLES_CAMPROCAM : ROLES_EXTERNO;

  // ─── FUNCIONES DE FILTRADO POR CAMPO ──────────────────────

  // Cédula: solo números, máximo 9 dígitos
  const handleCedulaChange = (value) => {
    const soloNumeros = value.replace(/\D/g, "").slice(0, 9);
    handleChange("cedula", soloNumeros);
  };

  // Teléfono: solo números, máximo 8 dígitos
  const handleTelefonoChange = (value) => {
    const soloNumeros = value.replace(/\D/g, "").slice(0, 8);
    handleChange("telefono", soloNumeros);
  };

  // Nombre: solo letras (con acentos, ñ, espacios) - elimina números y caracteres especiales
  const handleNombreChange = (value) => {
    const soloLetras = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
    handleChange("nombre", soloLetras);
  };

  // Apellidos: solo letras (con acentos, ñ, espacios) - elimina números y caracteres especiales
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

    if (form.telefono && !validarTelefono(form.telefono)) {
      newErrors.telefono = "Teléfono debe tener 8 dígitos";
      hasError = true;
    }

    if (form.email && !validarEmail(form.email)) {
      newErrors.email = "Correo electrónico inválido";
      hasError = true;
    }

    if (userRole === "camprocam_admin" && form.rol === "external_owner" && !form.fincaId) {
      newErrors.fincaId = "El ID de finca es obligatorio para dueños externos";
      hasError = true;
    }

    setErrors(newErrors);
    return { hasError, errors: newErrors };
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const { hasError } = validateForm();

    if (hasError) {
      setValidationMessage("Revisa los campos obligatorios marcados con *");
      return;
    }

    setValidationMessage("");
    const fullName = `${form.nombre} ${form.apellidos}`;
    const submitData = { ...form, nombre: fullName };
    delete submitData.apellidos;
    onSubmit(submitData);
  };

  return {
    form,
    errors,
    submitted,
    validationMessage,
    rolesDisponibles,
    handleChange,
    handleCedulaChange,
    handleTelefonoChange,
    handleNombreChange,
    handleApellidosChange,
    handleSubmit,
  };
}