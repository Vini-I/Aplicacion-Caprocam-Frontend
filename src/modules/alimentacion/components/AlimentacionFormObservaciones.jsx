/**
 * ============================================================
 * COMPONENTE ALIMENTACIONFORMOBSERVACIONES
 * ============================================================
 *
 * Sección "Observaciones" del formulario de Alimentación: notas
 * libres del registro, ahora obligatorias (asterisco + borde
 * rojo + mensaje de error tras submitted).
 *
 * Props principales:
 * - form, updateField, submitted, errores (mismos que recibe
 *   AlimentacionForm).
 *
 * Ejemplo:
 * <AlimentacionFormObservaciones form={form} updateField={updateField} submitted={submitted} errores={errores} />
 */

import React from "react";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import { COLORS } from "../../../theme/colors";

const bordeError = { borderColor: COLORS.error, borderWidth: 1.5 };

export default function AlimentacionFormObservaciones({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
}) {
  const invalidoObservaciones = submitted && !!errores.observaciones;

  return (
    <Card title="Observaciones">
      <Input
        label="Notas *"
        placeholder="Ingrese observaciones"
        value={form.observaciones ?? ""}
        onChangeText={(v) => updateField("observaciones", v)}
        style={invalidoObservaciones ? bordeError : null}
      />
    </Card>
  );
}
