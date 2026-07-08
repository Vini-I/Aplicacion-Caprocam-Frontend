/**
 * ============================================================
 * HOOK DE VALIDACIÓN DE CAMPOS - SIEMBRA
 * ============================================================
 *
 * Centraliza la validación visual de campos obligatorios
 * utilizada por los formularios del módulo de Siembra.
 *
 * FUNCIONALIDAD:
 * - Controla el estado de envío del formulario.
 * - Genera errores de campos obligatorios.
 * - Permite mostrar estados visuales de error.
 * - Maneja etiquetas de campos requeridos.
 *
 * También contiene la función reutilizable para validar
 * campos obligatorios antes de guardar información.
 */
import { useCallback, useState } from "react";

export function useSiembraFieldValidation() {
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

export function validarCamposObligatorios(formData, camposObligatorios) {
  const errores = {};

  camposObligatorios.forEach((campo) => {
    if (String(formData[campo] ?? "").trim() === "") {
      errores[campo] = "Campo obligatorio";
    }
  });

  return errores;
}