/**
 * ============================================================
 * HOOK: useAuth
 * ============================================================
 *
 * Gestiona el estado, las validaciones y el proceso de envío
 * del formulario de inicio de sesión web. Expone setters que
 * limpian el serverError en cada cambio de campo.
 *
 * @dependencies - authService (login)
 *               - useAuthRequest (manejo de loading/error de red)
 *               - authValidator (validateAuthForm, isAuthFormValid)
 * @validations  - Campos username y password obligatorios.
 *               - Errores visibles solo después del primer submit (submitted = true).
 * @navigation   - onLoginSuccess → callback inyectado por la pantalla que lo consume.
 */

import { useState } from "react";
import { login } from "../services/authService";
import { useAuthRequest } from "./useAuthRequest";
import { validateAuthForm, isAuthFormValid } from "../utils/authValidator";

export const useAuth = ({ onLoginSuccess = () => {} } = {}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validationErrors = validateAuthForm(username, password);
  const isFormValid = isAuthFormValid(validationErrors);

  // Los errores visibles solo aparecen si el usuario ya intentó enviar
  const errors = submitted ? validationErrors : { username: "", password: "" };

  const { loading, serverError, setServerError, submit } = useAuthRequest({
    onSuccess: onLoginSuccess,
  });

  const handleUsernameChange = (val) => {
    setUsername(val);
    if (serverError) setServerError(null);
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (serverError) setServerError(null);
  };

  const handleLogin = () => {
    setSubmitted(true);
    submit(() => login(username, password), isFormValid);
  };

  return {
    username,
    setUsername: handleUsernameChange,
    password,
    setPassword: handlePasswordChange,
    errors,
    isFormValid,
    loading,
    serverError,
    setServerError,
    handleLogin,
  };
};
