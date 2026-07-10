/**
 * ============================================================
 * COMPONENTE ALIMENTACIONFORMTIPO
 * ============================================================
 *
 * Sección "Tipo de Alimentación" del formulario de Alimentación:
 * tipo de balanceado, presentación y método (obligatorio, con
 * asterisco + borde rojo + mensaje de error tras submitted).
 *
 * Props principales:
 * - form, updateField, submitted, errores (mismos que recibe
 *   AlimentacionForm).
 *
 * Ejemplo:
 * <AlimentacionFormTipo form={form} updateField={updateField} submitted={submitted} errores={errores} />
 */

import React from "react";
import { View } from "react-native";
import Card from "../../../shared/components/Card";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TIPOS, PRESENTACION, METODOS } from "../constants/alimentacionOpciones";

const bordeError = { borderColor: COLORS.error, borderWidth: 1.5 };
const sectionTitleRow = { flexDirection: "row", alignItems: "center", marginBottom: 10 };
const sectionIcon = { marginRight: 8 };

export default function AlimentacionFormTipo({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
}) {
  const invalidoMetodo = submitted && !!errores.metodo;
  const invalidoTipoAlimento = submitted && !!errores.tipoAlimento;
  const invalidoPresentacion = submitted && !!errores.presentacion;

  return (
    <Card>
      <View style={sectionTitleRow}>
        <Icon icon={ICONS.food} size={18} color={COLORS.primary} style={sectionIcon} />
        <Text size={18} weight="700" color={COLORS.textSecondary}>
          Tipo de Alimentación
        </Text>
      </View>

      <Select
        label="Tipo *"
        value={form.tipoAlimento}
        onChange={(v) => updateField("tipoAlimento", v)}
        options={TIPOS}
        placeholder="Seleccionar tipo"
        selectStyle={invalidoTipoAlimento ? bordeError : null}
      />

      <Select
        label="Presentación *"
        value={form.presentacion}
        onChange={(v) => updateField("presentacion", v)}
        options={PRESENTACION}
        placeholder="Seleccionar presentación"
        selectStyle={invalidoPresentacion ? bordeError : null}
      />

      <Select
        label="Método *"
        value={form.metodo}
        onChange={(v) => updateField("metodo", v)}
        options={METODOS}
        placeholder="Seleccionar método"
        selectStyle={invalidoMetodo ? bordeError : null}
      />
    </Card>
  );
}
