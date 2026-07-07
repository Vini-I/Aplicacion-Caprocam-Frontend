/**
 * ============================================================
 * HOOK USERALEO
 * ============================================================
 *
 * Maneja el estado local del formulario de raleo y su
 * validación. No muestra ni renderiza nada en pantalla: la
 * interfaz (la screen) decide cuándo mostrar los errores
 * devueltos, usando su propio estado `submitted`.
 *
 * Estado que maneja:
 * - form: objeto con los valores actuales de todos los campos.
 *
 * Retorna:
 * - form: valores actuales del formulario.
 * - updateField(campo, valor): actualiza un campo del formulario.
 * - resetForm(): restaura el formulario a sus valores iniciales.
 * - validarForm(): retorna { valido, errores } verificando como
 *   obligatorios finca, estanque, fecha, porcentajeRaleo,
 *   objetivo y metodo, sin mostrar nada en pantalla (mismo
 *   patrón que useAlimentacionForm.js).
 *
 * Ejemplo:
 * const { form, updateField, resetForm, validarForm } = useRaleo();
 */

import { useState } from "react";

const FORM_INICIAL = {
  fecha: "",
  finca: "",
  estanque: "",
  porcentajeRaleo: "",
  pesoPromedio: "",
  biomasaTotal: "",
  objetivo: "",
  metodo: "",
  responsable: "",
  observaciones: "",
};

export default function useRaleo() {
  const [form, setForm] = useState(FORM_INICIAL);

  function updateField(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function resetForm() {
    setForm(FORM_INICIAL);
  }

  function validarForm() {
    const errores = {};
    if (!form.finca) errores.finca = "La finca es obligatoria";
    if (!form.estanque) errores.estanque = "El estanque es obligatorio";
    if (!form.fecha) errores.fecha = "La fecha es obligatoria";
    if (!form.porcentajeRaleo) errores.porcentajeRaleo = "El porcentaje de raleo es obligatorio";
    if (!form.objetivo) errores.objetivo = "El objetivo del raleo es obligatorio";
    if (!form.metodo) errores.metodo = "El método es obligatorio";
    return { valido: Object.keys(errores).length === 0, errores };
  }

  return {
    form,
    updateField,
    resetForm,
    validarForm,
  };
}
