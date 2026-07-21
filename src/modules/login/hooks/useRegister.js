/**
 * ============================================================
 * HOOK: useRegister
 *
 * Lógica de la pantalla de Registro Web.
 *
 * COMPORTAMIENTO DE ERRORES:
 * Los errores de validación solo se muestran cuando el usuario
 * presiona "Registrarme" (submitted = true).
 */

import { useState } from 'react';
import { register } from '../services/authService';
import { useAuthRequest } from './useAuthRequest';
import { validateRegisterForm, isRegisterFormValid } from '../utils/registerValidator';

export const useRegister = ({ onRegisterSuccess = () => {} } = {}) => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validationErrors = validateRegisterForm({ nombre, apellidos, email, username, password });
  const isFormValid = isRegisterFormValid(validationErrors);

  const errors = submitted
    ? validationErrors
    : { nombre: '', apellidos: '', email: '', username: '', password: '' };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    onRegisterSuccess();
  };

  const { loading, serverError, setServerError, submit } = useAuthRequest({
    onSuccess: () => setShowSuccessModal(true),
  });

  const handleRegister = () => {
    setSubmitted(true);
    submit(() => register(username, password, { nombre, apellidos, email }), isFormValid);
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