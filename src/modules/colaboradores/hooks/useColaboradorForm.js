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
 * - fincaId: ID de finca (para asignación automática)
 * - onSubmit: función que recibe los datos al enviar
 * - fincasOptions: opciones de fincas para el select (array de {label, value})
 *
 * Retorna:
 * - form, errors, submitted, validationMessage (mensaje específico)
 * - handleChange, handleSubmit
 * - handleCedulaChange, handleTelefonoChange, handleNombreChange, handleApellidosChange
 * - handlePinChange, handleConfirmPinChange, pin, confirmPin
 * - resetForm: función para limpiar el formulario y estados de validación
 * ============================================================
 */

import { useState } from "react";

const validarCedula = (cedula) => /^\d{9}$/.test(cedula);
const validarTelefono = (telefono) => /^\d{8}$/.test(telefono);
const validarEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  const partes = trimmed.split("@");
  if (partes.length !== 2) return false;
  if (partes[0].length < 3) return false;
  return /^[^\s@]{3,}@[^\s@]+\.[^\s@]+$/.test(trimmed);
};
const validarNombre = (nombre) => nombre.trim().length >= 2;
const validarApellidos = (apellidos) => apellidos.trim().length >= 2;
const validarPin = (pin) => /^\d{4}$/.test(pin);

/**
 * Valida que el PIN sea seguro:
 * - No todos los dígitos iguales (0000, 1111, ...)
 * - No sea una secuencia ascendente (0123, 1234, ...)
 * - No sea una secuencia descendente (9876, 8765, ...)
 */
function esPinSeguro(pin) {
  if (!validarPin(pin)) return false;
  const digits = pin.split('').map(Number);
  // Todos iguales
  if (digits.every(d => d === digits[0])) return false;
  // Secuencia ascendente o descendente
  const ascendente = digits.every((d, i) => i === 0 || d === digits[i-1] + 1);
  const descendente = digits.every((d, i) => i === 0 || d === digits[i-1] - 1);
  if (ascendente || descendente) return false;
  return true;
}

const INITIAL_FORM = {
  cedula: "",
  nombre: "",
  apellidos: "",
  telefono: "",
  email: "",
  fincaId: "",
};

export function useColaboradorForm({
  initialData,
  isEditing,
  fincaId,
  onSubmit,
  fincasOptions = [],
}) {
  const [form, setForm] = useState({
    cedula: initialData.cedula || "",
    nombre: initialData.nombre?.split(" ")[0] || "",
    apellidos: initialData.nombre?.split(" ").slice(1).join(" ") || "",
    telefono: initialData.telefono || "",
    email: initialData.email || "",
    fincaId: initialData.fincaId || fincaId || "",
  });

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

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

  const handlePinChange = (value) => {
    const soloNumeros = value.replace(/\D/g, "").slice(0, 4);
    setPin(soloNumeros);
    if (errors.pin) {
      setErrors((prev) => ({ ...prev, pin: null }));
    }
    if (submitted && validationMessage) {
      setValidationMessage("");
    }
  };

  const handleConfirmPinChange = (value) => {
    const soloNumeros = value.replace(/\D/g, "").slice(0, 4);
    setConfirmPin(soloNumeros);
    if (errors.confirmPin) {
      setErrors((prev) => ({ ...prev, confirmPin: null }));
    }
    if (submitted && validationMessage) {
      setValidationMessage("");
    }
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

    // ─── VALIDACIÓN DE MEDIOS DE CONTACTO (teléfono o email) ───
    const telefonoValido = form.telefono && validarTelefono(form.telefono);
    const emailValido = form.email && validarEmail(form.email);

    if (!telefonoValido && !emailValido) {
      if (!form.telefono) {
        newErrors.telefono = "Debe proporcionar al menos un medio de contacto (teléfono o correo)";
      } else if (!validarTelefono(form.telefono)) {
        newErrors.telefono = "Teléfono debe tener 8 dígitos";
      }
      if (!form.email) {
        newErrors.email = "Debe proporcionar al menos un medio de contacto (teléfono o correo)";
      } else if (!validarEmail(form.email)) {
        const partes = String(form.email).trim().split("@");
        if (partes[0] && partes[0].length < 3) {
          newErrors.email = "El correo debe tener un mínimo de 3 caracteres antes del @";
        } else {
          newErrors.email = "Correo electrónico inválido";
        }
      }
      hasError = true;
    } else {
      if (form.telefono && !validarTelefono(form.telefono)) {
        newErrors.telefono = "Teléfono debe tener 8 dígitos";
        hasError = true;
      }
      if (form.email && !validarEmail(form.email)) {
        const partes = String(form.email).trim().split("@");
        if (partes[0] && partes[0].length < 3) {
          newErrors.email = "El correo debe tener un mínimo de 3 caracteres antes del @";
        } else {
          newErrors.email = "Correo electrónico inválido";
        }
        hasError = true;
      }
    }

    // ─── VALIDACIÓN DE PIN ──────────────────────────────────────
    const pinProvided = pin && pin.trim() !== "";
    const confirmProvided = confirmPin && confirmPin.trim() !== "";

    if (!isEditing) {
      if (!pinProvided) {
        newErrors.pin = "El PIN es obligatorio";
        hasError = true;
      } else if (!validarPin(pin)) {
        newErrors.pin = "El PIN debe tener 4 dígitos numéricos";
        hasError = true;
      } else if (!esPinSeguro(pin)) {
        newErrors.pin = "El PIN no es seguro, elija otro (evite dígitos repetidos o secuencias)";
        hasError = true;
      }

      if (!confirmProvided) {
        newErrors.confirmPin = "Debe confirmar el PIN";
        hasError = true;
      } else if (pin !== confirmPin) {
        newErrors.confirmPin = "Los PIN no coinciden";
        hasError = true;
      }
    } else {
      if (pinProvided || confirmProvided) {
        if (!pinProvided) {
          newErrors.pin = "Debe ingresar el PIN para actualizarlo";
          hasError = true;
        } else if (!validarPin(pin)) {
          newErrors.pin = "El PIN debe tener 4 dígitos numéricos";
          hasError = true;
        } else if (!esPinSeguro(pin)) {
          newErrors.pin = "El PIN no es seguro, elija otro (evite dígitos repetidos o secuencias)";
          hasError = true;
        }

        if (!confirmProvided) {
          newErrors.confirmPin = "Debe confirmar el PIN";
          hasError = true;
        } else if (pin !== confirmPin) {
          newErrors.confirmPin = "Los PIN no coinciden";
          hasError = true;
        }
      }
    }

    setErrors(newErrors);
    return { hasError, errors: newErrors };
  };

  // ─── CONSTRUCCIÓN DEL MENSAJE: UN SOLO ERROR A LA VEZ ──────
  const buildValidationMessage = (errorsObj) => {
    const order = ['cedula', 'nombre', 'apellidos', 'telefono', 'email', 'pin', 'confirmPin'];
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

    if (pin && pin.trim() !== "" && validarPin(pin)) {
      submitData.pin = pin;
    }

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
      fincaId: fincaId || "",
    });
    setPin("");
    setConfirmPin("");
    setErrors({});
    setSubmitted(false);
    setValidationMessage("");
  };

  return {
    form,
    errors,
    submitted,
    validationMessage,
    handleChange,
    handleCedulaChange,
    handleTelefonoChange,
    handleNombreChange,
    handleApellidosChange,
    handlePinChange,
    handleConfirmPinChange,
    pin,
    confirmPin,
    handleSubmit,
    resetForm,
  };
}