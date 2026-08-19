/**
 * ============================================================
 * COMPONENTE ALIMENTACIONFORM
 * ============================================================
 *
 * Formulario de registro de alimentación. Compone las 4
 * secciones del formulario (Información General, Tipo de
 * Alimentación, Consumo y Observaciones), pasando a cada una
 * form/updateField/submitted/errores.
 *
 * Props principales:
 * - form: objeto con los valores actuales del formulario.
 * - updateField: función (campo, valor) para actualizar el form.
 * - submitted: boolean, true cuando el usuario ya intentó guardar.
 * - errores: objeto { campo: mensaje } devuelto por validarForm().
 *
 * Ejemplo:
 * <AlimentacionForm
 *   form={form}
 *   updateField={updateField}
 *   submitted={submitted}
 *   errores={errores}
 * />
 */
 
import React from "react";
import { View } from "react-native";
import AlimentacionFormInfoGeneral from "./AlimentacionFormInfoGeneral";
import AlimentacionFormTipo from "./AlimentacionFormTipo";
import AlimentacionFormConsumo from "./AlimentacionFormConsumo";
import AlimentacionFormObservaciones from "./AlimentacionFormObservaciones";

export default function AlimentacionForm({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
  onCatalogoErrorChange = () => {},
}) {
  const props = { form, updateField, submitted, errores, onCatalogoErrorChange };

  return (
    <View>
      <AlimentacionFormInfoGeneral {...props} />
      <AlimentacionFormTipo {...props} />
      <AlimentacionFormConsumo {...props} />
      <AlimentacionFormObservaciones {...props} />
    </View>
  );
}
