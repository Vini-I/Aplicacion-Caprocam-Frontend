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
import { View } from "react-native";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { PROVEEDORES } from "../constants/alimentacionOpciones";

const bordeError = { borderColor: COLORS.error, borderWidth: 1.5 };
const sectionTitleRow = { flexDirection: "row", alignItems: "center", marginBottom: 10 };
const sectionIcon = { marginRight: 8 };

export default function AlimentacionFormConsumo({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
}) {
  const invalidoCantidadKg = submitted && !!errores.cantidadKg;
  const invalidoProveedor = submitted && !!errores.proveedor;

  return (
    <Card>
      <View style={sectionTitleRow}>
        <Icon icon={ICONS.weight} size={18} color={COLORS.primary} style={sectionIcon} />
        <Text size={18} weight="700" color={COLORS.textSecondary}>
          Consumo
        </Text>
      </View>

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
