/**
 * HOOK: useRegister
 *
 * Encapsula la gestión de estado, filtrado en tiempo real, validaciones y
 * el envío del formulario de registro de administradores web.
 *
 * @dependencies - register (services/authService)
 *               - useAuthRequest (hooks/useAuthRequest)
 *               - validateRegisterForm, isRegisterFormValid (utils/registerValidator)
 *               - filterNameChars, filterUsernameChars (utils/inputFilters)
 * @validations  - Filtrado en tiempo real de caracteres en nombre, apellidos y username.
 *               - Visualización de errores de obligatoriedad y formato tras submit.
 * @navigation   - onRegisterSuccess → callback inyectado para redirigir tras registro exitoso.
 */

import { useState } from 'react';
import { register } from '../services/authService';
import { useAuthRequest } from './useAuthRequest';
import { validateRegisterForm, isRegisterFormValid, getRegisterValidationResult } from '../utils/registerValidator';
import { filterNameChars, filterUsernameChars } from '../utils/inputFilters';

export const useRegister = ({ onRegisterSuccess = () => {} } = {}) => {
  const [nombre, setNombreState] = useState('');
  const [apellidos, setApellidosState] = useState('');
  const [email, setEmailState] = useState('');
  const [username, setUsernameState] = useState('');
  const [password, setPasswordState] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const setNombre = (val) => {
    if (submitted) setSubmitted(false);
    setNombreState(filterNameChars(val));
  };
  const setApellidos = (val) => {
    if (submitted) setSubmitted(false);
    setApellidosState(filterNameChars(val));
  };
  const setEmail = (val) => {
    if (submitted) setSubmitted(false);
    setEmailState(val);
  };
  const setUsername = (val) => {
    if (submitted) setSubmitted(false);
    setUsernameState(filterUsernameChars(val));
  };
  const setPassword = (val) => {
    if (submitted) setSubmitted(false);
    setPasswordState(val);
  };

  const validationErrors = validateRegisterForm({ nombre, apellidos, email, username, password });
  const isFormValid = isRegisterFormValid(validationErrors);

  const errors = submitted
    ? validationErrors
    : { nombre: '', apellidos: '', email: '', username: '', password: '' };

  const validationResult = submitted
    ? getRegisterValidationResult(validationErrors)
    : { mode: 'none', message: '', fieldsToHighlight: [] };

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
    validationResult,
    isFormValid,
    loading,
    serverError,
    setServerError,
    handleRegister,
    showSuccessModal,
    handleModalClose,
  };
};