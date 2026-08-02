/**
 * ============================================================
 * COMPONENTE: CAMPO DE LECTURA
 * ============================================================
 *
 * Muestra un campo como texto plano (etiqueta + valor), para usar
 * en las secciones del módulo de Siembra cuando están en modo
 * "view" - en vez de un input/select deshabilitado con aspecto de
 * formulario, se ve como una simple línea de detalle.
 *
 * Props:
 * - label: título del campo.
 * - value: valor a mostrar. Si viene vacío, se muestra "—".
 */
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function CampoLectura({ label, value }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});
