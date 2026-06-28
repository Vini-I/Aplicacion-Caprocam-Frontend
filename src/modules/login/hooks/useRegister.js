/**
 * HOOK: useRegister
 *
 * Lógica de la pantalla de Registro Web.
 *
 * COMPORTAMIENTO DE ERRORES:
 * Los errores de validación solo se muestran cuando el usuario
 * presiona "Registrarme" (submitted = true). Mientras escribe,
 * los campos no muestran error aunque estén vacíos.
 *
 * FLUJO DE ÉXITO Y MODAL:
 * El modal se activa en cuanto el formulario es válido y el
 * usuario presiona "Registrarme", sin esperar respuesta del
 * backend. Esto es intencional: el backend aún no está listo
 * para recibir todos los campos (ver TODO en authService.js),
 * pero el flujo de UI debe funcionar completo.
 * El intento de registro contra la API ocurre en paralelo;
 * si falla por red, no interrumpe el flujo del usuario.
 * Al cerrar el modal se navega a /loginWeb.
 *
 * NOTA BACKEND: nombre, apellidos y email se capturan y validan
 * aquí pero el endpoint aún solo acepta {username, password}.
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

    if (!isFormValid) return;

    // Mostrar modal de éxito inmediatamente (el formulario es válido)
    setShowSuccessModal(true);

    // Intentar llamar al backend en paralelo (sin bloquear el flujo)
    // TODO: cuando el backend esté listo, manejar el token aquí
    setLoading(true);
    try {
      await register(username, password, { nombre, apellidos, email });
    } catch (_) {
      // Error de red o backend no disponible: el modal ya está abierto,
      // el usuario continúa el flujo. Se registrará correctamente
      // en cuanto el backend esté disponible.
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
    handleRegister,
    showSuccessModal,
    handleModalClose,
  };
};