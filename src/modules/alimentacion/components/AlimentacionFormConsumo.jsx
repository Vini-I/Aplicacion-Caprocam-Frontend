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
import { styles } from "../styles/AlimentacionStyles";

export default function AlimentacionFormConsumo({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
}) {
  return (
    <Card>
      <View style={styles.sectionTitleRow}>
        <Icon icon={ICONS.weight} size={18} color={COLORS.primary} style={styles.sectionIcon} />
        <Text size={18} weight="700" color={COLORS.textSecondary}>
          Consumo
        </Text>
      </View>

      <Input
        label="Cantidad (Kg)"
        placeholder="Ej: 20"
        value={String(form.cantidadKg ?? "")}
        keyboardType="numeric"
        maxLength={6}
        onChangeText={(v) => {
          const soloNumeros = v.replace(/[^0-9]/g, "");
          updateField("cantidadKg", soloNumeros);
        }}
        required
        submitted={submitted}
        error={submitted ? (errores.cantidadKg || "") : ""}
      />

      <Select
        label="Proveedor"
        value={form.proveedor}
        onChange={(v) => updateField("proveedor", v)}
        options={PROVEEDORES}
        placeholder="Seleccionar proveedor"
        required
        submitted={submitted}
        error={submitted ? (errores.proveedor || "") : ""}
      />
    </Card>
  );
}
