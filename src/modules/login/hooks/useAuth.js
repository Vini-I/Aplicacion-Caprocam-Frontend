/**
 * HOOK: useAuth
 *
 * Lógica de la pantalla de Login Web.
 *
 * COMPORTAMIENTO DE ERRORES:
 * Los errores de validación solo se muestran cuando el usuario
 * presiona "Iniciar Sesión" (submitted = true). Mientras escribe,
 * los campos no muestran error aunque estén vacíos.
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

  const handleLogin = () => {
    setSubmitted(true);
    submit(() => login(username, password), isFormValid);
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    errors,
    isFormValid,
    buttonVariant: "primary",
    loading,
    serverError,
    setServerError,
    handleLogin,
  };
};
