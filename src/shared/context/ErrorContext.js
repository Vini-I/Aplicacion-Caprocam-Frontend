/**
 * ============================================================
 * CONTEXTO DE ERRORES GLOBALES
 * ============================================================
 *
 * Centraliza el manejo de errores inesperados (excepciones,
 * fallos de red, respuestas del backend) para mostrarlos en un
 * modal consistente en cualquier parte de la aplicación, sin
 * necesidad de que cada pantalla maneje su propio estado.
 *
 * Uso:
 * import { useError } from "[ruta de este context]"
 * const { mostrarError } = useError();
 * try {
 *   await algo();
 * } catch (error) {
 *   mostrarError(error);
 * }
 * ============================================================
 */

import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

function extraerMensaje(error) {
  if (typeof error === "string") {
    return error;
  }

  const detalles = error?.response?.data?.error;
  if (Array.isArray(detalles) && detalles.length > 0) {
    return detalles.join(" ");
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Ocurrió un error inesperado."
  );
}

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  function mostrarError(err) {
    setError(extraerMensaje(err));
  }

  function limpiarError() {
    setError(null);
  }

  return (
    <ErrorContext.Provider value={{ error, mostrarError, limpiarError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error("useError debe usarse dentro de un ErrorProvider");
  }

  return context;
}