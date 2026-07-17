/**
 * ============================================================
 * COMPONENTE: CÁLCULO DE POBLACIÓN
 * ============================================================
 *
 * Renderiza la información del cálculo poblacional de una siembra.
 *
 * FUNCIONALIDAD:
 * - Muestra el área del estanque.
 * - Permite modificar la densidad poblacional.
 * - Muestra la cantidad sembrada calculada.
 *
 * DATOS:
 * - Recibe formData y onChange desde la screen/hook padre.
 * - No mantiene estado propio.
 *
 * VALIDACIONES:
 * - No calcula errores propios; refleja los que le pasa el padre.
 *
 * DEPENDENCIAS:
 * - Card, NumberInput (shared/components).
 * - SectionTitle.
 *
 * El cálculo matemático pertenece a las utilidades del módulo
 * (siembraCalculos.js).
 */
import { View, Text } from "react-native";

import Card from "../../../shared/components/Card";
import NumberInput from "../../../shared/components/NumberInput";

import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/SiembraSectionStyles";
import SectionTitle from "./SectionTitle";

export default function CalculoPoblacionSection({
  formData,
  onChange,
  mode = "edit",
  fieldHelpers,
}) {
  const isViewMode = mode === "view";
  const { hasError, requiredLabel } = fieldHelpers;

  const areaMostrada = formData.areaHectareas
    ? `${formData.areaHectareas} ha`
    : "Seleccione un estanque";

  const densidadMostrada = formData.densidadPoblacional
    ? `${formData.densidadPoblacional} PL/m²`
    : "0 PL/m²";

  const cantidadMostrada = formData.cantidadSembrada
    ? Number(formData.cantidadSembrada).toLocaleString()
    : "0";

  return (
    <Card>
      <SectionTitle icon={ICONS.weight} title="Cálculo de población" />

      <View
        style={[
          styles.calculationBox,
          hasError("areaHectareas") && styles.calculationBoxError,
        ]}
      >
        <Text style={styles.calculationLabel}>Área del estanque *</Text>
        <Text style={styles.calculationValue}>{areaMostrada}</Text>
      </View>

      <NumberInput
        label={requiredLabel(`Densidad poblacional (${densidadMostrada})`)}
        value={formData.densidadPoblacional}
        onChangeText={(value) => onChange("densidadPoblacional", value)}
        min={1}
        max={30}
        step={1}
        labelStyle={styles.requiredLabel}
        style={hasError("densidadPoblacional") ? styles.inputError : null}
        editable={!isViewMode}
      />

      <View
        style={[
          styles.calculationBox,
          hasError("cantidadSembrada") && styles.calculationBoxError,
        ]}
      >
        <Text style={styles.calculationLabel}>
          Cantidad sembrada calculada *
        </Text>
        <Text style={styles.calculationValue}>
          {cantidadMostrada} camarones
        </Text>
      </View>
    </Card>
  );
}
