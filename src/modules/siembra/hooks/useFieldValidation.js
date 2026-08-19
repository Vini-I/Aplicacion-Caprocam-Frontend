/**
 * ============================================================
 * HOOK DE VALIDACIÓN DE CAMPOS OBLIGATORIOS - MÓDULO SIEMBRA
 * ============================================================
 *
 * FUNCIONALIDAD:
 *
 * Contrato único required/submitted/error usado por los
 * formularios del módulo de Siembra 
 *
 * - El asterisco se muestra siempre (requiredLabel).
 * - El borde rojo (hasError) solo aparece cuando "submitted"
 *   es true Y el campo sigue inválido/vacío.
 *
 * Este archivo no conoce la lista de campos obligatorios de
 * Siembra/Pre-Cría (esa lógica de negocio vive en
 * siembraValidationRules.js); solo resuelve el mecanismo de
 * estado (submitted/errors/hasError/requiredLabel), para que
 * "Crear" y "Editar" se comporten exactamente igual.
 *
 * USO TÍPICO:
 *
 *   const { submitted, setSubmitted, errors, setErrors,
 *           hasError, requiredLabel } = useFieldValidation();
 *
 *   const nuevosErrores = validarCamposObligatorios(
 *     formData,
 *     camposObligatoriosDelModulo,
 *   );
 */
import { useCallback, useState } from "react";

export function useFieldValidation() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const hasError = useCallback(
    (field) => submitted && Boolean(errors[field]),
    [submitted, errors],
  );

  const requiredLabel = useCallback((label) => `${label} *`, []);

  return {
    submitted,
    setSubmitted,
    errors,
    setErrors,
    hasError,
    requiredLabel,
  };
}

/**
 * Valida una lista de campos obligatorios contra un formData.
 * Reutilizable por cualquier módulo, independientemente de cuáles
 * campos exija (esa lista la define cada módulo).
 */
export function validarCamposObligatorios(formData, camposObligatorios) {
  const errores = {};

  camposObligatorios.forEach((campo) => {
    if (String(formData[campo] ?? "").trim() === "") {
      errores[campo] = "Campo obligatorio";
    }
  });
  return errores;
}