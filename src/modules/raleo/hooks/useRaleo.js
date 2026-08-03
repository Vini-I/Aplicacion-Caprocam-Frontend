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
 *   obligatorios finca, estanque, colaborador, fecha,
 *   porcentajeRaleo, pesoPromedio, biomasaActual, objetivo y
 *   metodo. `observaciones` NO se valida aquí (es opcional): si
 *   queda vacío, RaleoScreen.jsx lo completa con un texto por
 *   defecto antes de guardar (mismo patrón que useAlimentacionForm.js
 *   y useDensidadPoblacional.js con sus notas).
 *
 * CORREGIDO: antes `observaciones` SÍ se validaba como
 * obligatorio aquí, contradiciendo tanto el docstring como el
 * fallback de RaleoScreen.jsx: el formulario nunca lograba
 * guardarse si se dejaba en blanco, aunque la UI lo mostraba como
 * campo opcional (sin asterisco).
 *
 * CORREGIDO: el campo "responsable" (un Input de texto,
 * deshabilitado y sin ninguna forma de llenarse) se reemplazó por
 * "colaborador": un Select real con colaboradores reales del
 * backend (mismo patrón que "Colaborador asignado" en
 * useFincaCrecimiento.js / FincaCrecimientoScreen.jsx). Es
 * obligatorio en la UI (estandarización con Crecimiento), aunque
 * la columna colaborador_id en la base de datos es nullable.
 *
 * Funcionalidad:
 * - `fecha` inicia en la fecha de hoy (hoy()) y no en "": DateInput
 *   solo llama a onChangeText cuando el usuario abre el calendario
 *   y elige una fecha, pero ya muestra "hoy" por defecto sin
 *   disparar ese evento. Si el estado inicial fuera "", el campo
 *   se veía lleno mientras form.fecha seguía vacío, y la
 *   validación mostraba "La fecha es obligatoria" aunque se viera
 *   una fecha en pantalla.
 *
 * Ejemplo:
 * const { form, updateField, resetForm, validarForm } = useRaleo();
 */

import { useState } from "react";

function hoy() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

const FORM_INICIAL = {
  fecha: hoy(),
  finca: "",
  estanque: "",
  porcentajeRaleo: "",
  pesoPromedio: "",
  biomasaActual: "",
  objetivo: "",
  metodo: "",
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
    if (!form.porcentajeRaleo || Number.isNaN(Number(form.porcentajeRaleo))) {
      errores.porcentajeRaleo = "El porcentaje de raleo es obligatorio y debe ser numérico";
    }
    if (!form.pesoPromedio) errores.pesoPromedio = "El peso promedio estimado es obligatorio";
    if (!form.biomasaActual) errores.biomasaActual = "La biomasa actual estimada es obligatoria";
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
