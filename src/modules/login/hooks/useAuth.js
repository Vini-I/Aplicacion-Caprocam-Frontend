/**
 * ============================================================
 * HOOK: useAuth
 * ============================================================
 * 
 * Responsabilidad: Gestionar el estado, las validaciones y el proceso
 * de envío para el formulario de inicio de sesión Web.
 * 
 * FUNCIONALIDAD:
 * - Controla los estados de los inputs de usuario y contraseña.
 * - Calcula las validaciones en tiempo real pero solo expone errores
 *   tras el envío del formulario.
 * - Ejecuta la consulta de inicio de sesión contra el servicio de autenticación.
 * 
 * DATOS:
 * - username: Estado del nombre de usuario.
 * - password: Estado de la contraseña.
 * - submitted: Booleano que indica si el formulario fue enviado.
 * 
 * VALIDACIONES:
 * - Valida campos vacíos mediante authValidator.js.
 * 
 * NAVEGACIÓN:
 * - Llama a onLoginSuccess si la autenticación es exitosa.
 * 
 * DEPENDENCIAS:
 * - authService.js
 * - useAuthRequest.js
 * - authValidator.js
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
    buttonVariant: "primary",
    loading,
    serverError,
    setServerError,
    handleLogin,
  };
};
