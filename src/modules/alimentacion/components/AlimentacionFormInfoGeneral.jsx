/**
 * ============================================================
 * COMPONENTE ALIMENTACIONFORMINFOGENERAL
 * ============================================================
 *
 * Sección "Información General" del formulario de Alimentación:
 * fecha, hora, finca y estanque, con el contrato de campos
 * obligatorios (asterisco + borde rojo + mensaje de error tras
 * submitted).
 *
 * Props principales:
 * - form, updateField, submitted, errores (mismos que recibe
 *   AlimentacionForm).
 *
 * Finca/estanque: usa useFincaEstanqueAlimentacion (mismo patron
 * que useFincaCrecimiento.js) en vez del useCatalogos generico que
 * usaba antes (importado, de forma confusa, desde el modulo de
 * densidadPoblacional). Trae todas las fincas y todos los
 * estanques una sola vez, y filtra los estanques de la finca
 * elegida en memoria, sin pedirle al backend "los estanques de la
 * finca X" cada vez que cambia la finca.
 *
 * Ejemplo:
 * <AlimentacionFormInfoGeneral form={form} updateField={updateField} submitted={submitted} errores={errores} />
 */
 
import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Card from "../../../shared/components/Card";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text";
import DateInput from "../../../shared/components/DateInput";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";
import { HORAS } from "../constants/AlimentacionOpciones";
import { useFincaEstanqueAlimentacion } from "../hooks/useFincaEstanqueAlimentacion";
import { styles as formStyles } from "../styles/AlimentacionStyles";

const { bordeError, sectionTitleRow, sectionIcon } = formStyles;

export default function AlimentacionFormInfoGeneral({
  form = {},
  updateField = () => {},
  submitted = false,
  errores = {},
}) {
  const invalidoFinca = submitted && !!errores.finca;
  const invalidoEstanque = submitted && !!errores.estanque;
  const invalidoFecha = submitted && !!errores.fecha;
  const invalidoHora = submitted && !!errores.hora;

  const { fincasOptions, estanquesOptions } = useFincaEstanqueAlimentacion(form.finca);

  const handleFincaChange = (idFinca) => {
    updateField("finca", idFinca);
    updateField("estanque", "");
  };

  const handleEstanqueChange = (idEstanque) => {
    updateField("estanque", idEstanque);
  };

  return (
    <Card>
      <View style={sectionTitleRow}>
        <Icon icon={ICONS.calendar} size={18} color={COLORS.primary} style={sectionIcon} />
        <Text size={18} weight="700" color={COLORS.textSecondary}>
          Información General
        </Text>
      </View>

      <DateInput
        label="Fecha de Registro *"
        value={form.fecha ?? ""}
        onChangeText={(v) => updateField("fecha", v)}
        labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
        inputStyle={invalidoFecha ? bordeError : null}
      />

      <Text size={14} weight="600" color={COLORS.textSecondary} style={styles.horaLabel}>
        Hora *
      </Text>
      <View style={[styles.horasContainer, invalidoHora && styles.horasContainerInvalid]}>
        {HORAS.map((h) => {
          const selected = form.hora === h;
          return (
            <Pressable
              key={h}
              onPress={() => updateField("hora", h)}
              style={[styles.horaButton, selected && styles.horaButtonSelected]}
            >
              <Text size={14} color={selected ? COLORS.primary : COLORS.textTertiary} weight="500">
                {h}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Select
        label="Finca *"
        value={form.finca}
        onChange={handleFincaChange}
        options={fincasOptions}
        placeholder="Seleccionar finca"
        selectStyle={invalidoFinca ? bordeError : null}
      />

      <Select
        label="Estanque *"
        value={form.estanque}
        onChange={handleEstanqueChange}
        options={estanquesOptions}
        placeholder="Seleccionar estanque"
        selectStyle={invalidoEstanque ? bordeError : null}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  horaLabel: { marginBottom: 6 },
  horasContainer: { flexDirection: "row", gap: 8, marginTop: 4 },
  horasContainerInvalid: {
    borderWidth: 1.5,
    borderColor: COLORS.error,
    borderRadius: 8,
    padding: 4,
  },
  horaButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
  },
  horaButtonSelected: { backgroundColor: COLORS.secondary, borderColor: COLORS.primary },
});
