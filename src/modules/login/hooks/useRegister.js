/**
 * ============================================================
 * HOOK: useRegister
 * ============================================================
 * 
 * Responsabilidad: Gestionar el estado, las validaciones y el proceso
 * de envío para el formulario de registro de administradores Web.
 * 
 * FUNCIONALIDAD:
 * - Controla los estados de nombre, apellidos, correo, usuario y contraseña.
 * - Valida los campos y expone los errores tras intentar enviar el formulario.
 * - Ejecuta la llamada al servicio de registro (authService.js).
 * - Muestra un modal de éxito al registrarse exitosamente.
 * 
 * DATOS:
 * - nombre, apellidos, email, username, password: Estados del formulario.
 * - submitted: Booleano para activar la visualización de errores.
 * - showSuccessModal: Booleano que controla el modal de éxito.
 * 
 * VALIDACIONES:
 * - Valida obligatoriedad y formatos mediante registerValidator.js.
 * 
 * NAVEGACIÓN:
 * - Llama a onRegisterSuccess al cerrar el modal de éxito.
 * 
 * DEPENDENCIAS:
 * - authService.js
 * - registerValidator.js
 */

import { useState } from 'react';
import { register } from '../services/authService';
import { validateRegisterForm, isRegisterFormValid } from '../utils/registerValidator';

export const useRegister = ({ onRegisterSuccess = () => {} } = {}) => {
  const [nombre,    setNombre]    = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email,     setEmail]     = useState('');
  const [username,  setUsername]  = useState('');
  const [password,  setPassword]  = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validationErrors = validateRegisterForm({ nombre, apellidos, email, username, password });
  const isFormValid = isRegisterFormValid(validationErrors);

  // Errores visibles solo tras intentar enviar
  const errors = submitted
    ? validationErrors
    : { nombre: '', apellidos: '', email: '', username: '', password: '' };

  // Al cerrar el modal: navegar a loginWeb
  const handleModalClose = () => {
    setShowSuccessModal(false);
    onRegisterSuccess();
  };

  const handleRegister = async () => {
    setSubmitted(true);
    setServerError(null);

    if (!isFormValid) return;

    setLoading(true);
    try {
      await register(username, password, { nombre, apellidos, email });
      // Si la llamada al servicio de registro (memoria global) es exitosa:
      setShowSuccessModal(true);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    nombre, setNombre,
    apellidos, setApellidos,
    email, setEmail,
    username, setUsername,
    password, setPassword,
    errors,
    isFormValid,
    loading,
    serverError,
    setServerError,
    handleRegister,
    showSuccessModal,
    handleModalClose,
  };
};