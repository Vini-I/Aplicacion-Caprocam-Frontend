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

const bordeError = { borderColor: COLORS.error, borderWidth: 1.5 };
const sectionTitleRow = { flexDirection: "row", alignItems: "center", marginBottom: 10 };
const sectionIcon = { marginRight: 8 };

export default function AlimentacionFormObservaciones({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
}) {
  const invalidoObservaciones = submitted && !!errores.observaciones;

  return (
    <Card>
      <View style={sectionTitleRow}>
        <Icon icon={ICONS.clipboard} size={18} color={COLORS.primary} style={sectionIcon} />
        <Text size={18} weight="700" color={COLORS.textSecondary}>
          Observaciones
        </Text>
      </View>

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
