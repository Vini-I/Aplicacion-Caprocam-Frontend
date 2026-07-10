/**
 * ============================================================
 * COMPONENTE ALIMENTACIONFORMCONSUMO
 * ============================================================
 *
 * Sección "Consumo" del formulario de Alimentación: cantidad en
 * Kg (obligatoria, con asterisco + borde rojo + mensaje de error
 * tras submitted) y proveedor.
 *
 * Props principales:
 * - form, updateField, submitted, errores (mismos que recibe
 *   AlimentacionForm).
 *
 * Ejemplo:
 * <AlimentacionFormConsumo form={form} updateField={updateField} submitted={submitted} errores={errores} />
 */

import React from "react";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import { COLORS } from "../../../theme/colors";
import { PROVEEDORES } from "../constants/alimentacionOpciones";

const bordeError = { borderColor: COLORS.error, borderWidth: 1.5 };

export default function AlimentacionFormConsumo({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
}) {
  const invalidoCantidadKg = submitted && !!errores.cantidadKg;
  const invalidoProveedor = submitted && !!errores.proveedor;

  return (
    <Card title="Consumo">
      <Input
        label="Cantidad (Kg) *"
        placeholder="Ej: 20"
        value={String(form.cantidadKg ?? "")}
        keyboardType="numeric"
        onChangeText={(v) => {
          const soloNumeros = v.replace(/[^0-9]/g, "");
          updateField("cantidadKg", soloNumeros);
        }}
        style={invalidoCantidadKg ? bordeError : null}
      />

      <Select
        label="Proveedor *"
        value={form.proveedor}
        onChange={(v) => updateField("proveedor", v)}
        options={PROVEEDORES}
        placeholder="Seleccionar proveedor"
        selectStyle={invalidoProveedor ? bordeError : null}
      />
    </Card>
  );
}
