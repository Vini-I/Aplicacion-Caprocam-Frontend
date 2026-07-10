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
import Text from "../../../shared/components/Text";
import { COLORS } from "../../../theme/colors";
import { PROVEEDORES } from "../constants/alimentacionOpciones";

const bordeError = { borderColor: COLORS.error, borderWidth: 1.5 };
const errorText = { marginTop: -6, marginBottom: 8, marginLeft: 2 };

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
        placeholder="0"
        value={String(form.cantidadKg ?? "")}
        keyboardType="numeric"
        onChangeText={(v) => {
          const soloNumeros = v.replace(/[^0-9]/g, "");
          updateField("cantidadKg", soloNumeros);
        }}
        style={invalidoCantidadKg ? bordeError : null}
      />
      {invalidoCantidadKg && (
        <Text size={12} color={COLORS.error} style={errorText}>
          {errores.cantidadKg}
        </Text>
      )}

      <Select
        label="Proveedor *"
        value={form.proveedor}
        onChange={(v) => updateField("proveedor", v)}
        options={PROVEEDORES}
        placeholder="Seleccionar proveedor"
        selectStyle={invalidoProveedor ? bordeError : null}
      />
      {invalidoProveedor && (
        <Text size={12} color={COLORS.error} style={errorText}>
          {errores.proveedor}
        </Text>
      )}
    </Card>
  );
}
