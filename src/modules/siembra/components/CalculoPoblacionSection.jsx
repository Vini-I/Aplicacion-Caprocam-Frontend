/**
 * ============================================================
 * COMPONENTE: CÁLCULO DE POBLACIÓN
 * ============================================================
 *
 * Renderiza la información del cálculo poblacional de una siembra.
 *
 * FUNCIONALIDAD:
 * - Área del estanque, densidad poblacional y cantidad sembrada
 *   siempre se muestran como texto dentro de una caja (nunca
 *   como input editable), incluso en modo edición - solo la
 *   densidad cambia entre texto fijo (view) o campo numérico
 *   editable (edit); área y cantidad son siempre solo lectura,
 *   ya que se calculan a partir de otros campos.
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
 * - SectionTitle, CampoLectura.
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

      {isViewMode ? (
        <View style={styles.calculationBox}>
          <Text style={styles.calculationLabel}>Densidad poblacional</Text>
          <Text style={styles.calculationValue}>{densidadMostrada}</Text>
        </View>
      ) : (
        <NumberInput
          label={requiredLabel(`Densidad poblacional (${densidadMostrada})`)}
          value={formData.densidadPoblacional}
          onChangeText={(value) => onChange("densidadPoblacional", value)}
          min={1}
          max={30}
          step={1}
          labelStyle={styles.requiredLabel}
          style={hasError("densidadPoblacional") ? styles.inputError : null}
        />
      )}

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
