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
import { View } from "react-native";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/AlimentacionStyles";

export default function AlimentacionFormObservaciones({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
}) {
  return (
    <Card>
      <View style={styles.sectionTitleRow}>
        <Icon icon={ICONS.clipboard} size={18} color={COLORS.primary} style={styles.sectionIcon} />
        <Text size={18} weight="700" color={COLORS.textSecondary}>
          Observaciones
        </Text>
      </View>

      <Input
        label="Notas"
        placeholder="Ej: Se aplicó ración extra por baja temperatura del agua"
        multiline
        value={form.observaciones ?? ""}
        onChangeText={(v) => updateField("observaciones", v)}
        required
        submitted={submitted}
        error={submitted ? (errores.observaciones || "") : ""}
      />
    </Card>
  );
}
