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
 *   obligatorios finca, estanque, fecha, biomasaAntes y
 *   kgRetirados. `observaciones` NO se valida aquí (es opcional):
 *   si queda vacío, useRaleoScreen.js lo completa con un texto por
 *   defecto antes de guardar (mismo patrón que useAlimentacionForm.js).
 *
 * CAMBIO (documento de requerimientos):
 * El registro de raleo pasó a capturar los kilogramos realmente
 * retirados en vez del porcentaje. El porcentaje y la biomasa
 * restante ya NO se digitan: los calcula el sistema a partir de
 * `biomasaAntes` y `kgRetirados` (ver useRaleoScreen.js).
 *
 * Campos eliminados y por qué:
 * - `porcentajeRaleo`: el documento lo define como un valor
 *   generado por fórmula, no ingresado por el usuario.
 * - `pesoPromedio` (peso promedio estimado en gramos): no aparece
 *   en los requerimientos; lo que se debe guardar es el peso
 *   retirado en kilogramos, que ahora es `kgRetirados`.
 * - `objetivo` y `metodo`: no aparecen en los requerimientos.
 *
 * `biomasaActual` se renombró a `biomasaAntes` para que el nombre
 * diga exactamente qué momento representa (la biomasa previa al
 * raleo), ya que ahora convive con la biomasa restante calculada.
 *
 * Funcionalidad:
 * - `fecha` inicia en la fecha de hoy (hoy()) y no en "": DateInput
 *   solo llama a onChangeText cuando el usuario abre el calendario
 *   y elige una fecha, pero ya muestra "hoy" por defecto sin
 *   disparar ese evento. Si el estado inicial fuera "", el campo
 *   se veía lleno mientras form.fecha seguía vacío, y la
 *   validación mostraba "La fecha es obligatoria" aunque se viera
 *   una fecha en pantalla.
 * - `kgRetirados` no puede superar a `biomasaAntes`: sacar más
 *   biomasa de la que hay produciría un porcentaje mayor a 100 % y
 *   una biomasa restante negativa.
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
  biomasaAntes: "",
  kgRetirados: "",
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

    const biomasaAntes = Number(form.biomasaAntes);
    const kgRetirados = Number(form.kgRetirados);

    if (!form.biomasaAntes || Number.isNaN(biomasaAntes)) {
      errores.biomasaAntes = "La biomasa antes del raleo es obligatoria y debe ser numérica";
    } else if (biomasaAntes <= 0) {
      errores.biomasaAntes = "La biomasa antes del raleo debe ser mayor a 0";
    }

    if (!form.kgRetirados || Number.isNaN(kgRetirados)) {
      errores.kgRetirados = "La cantidad retirada es obligatoria y debe ser numérica";
    } else if (kgRetirados <= 0) {
      errores.kgRetirados = "La cantidad retirada debe ser mayor a 0";
    } else if (!errores.biomasaAntes && kgRetirados > biomasaAntes) {
      /*
      Sin esta validacion el sistema calcularia un porcentaje mayor
      a 100 % y una biomasa restante negativa.
      */
      errores.kgRetirados = "La cantidad retirada no puede ser mayor que la biomasa antes del raleo";
    }

    return { valido: Object.keys(errores).length === 0, errores };
  }

  return {
    form,
    updateField,
    resetForm,
    validarForm,
  };
}
