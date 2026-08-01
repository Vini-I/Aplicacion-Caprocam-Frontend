/**
 * ============================================================
 * ESTILOS: colaboradorCardStyles
 * ============================================================
 *
 * Estilos para el componente ColaboradorCard.
 * Utiliza la paleta de COLORS del tema central.
 *
 * Dependencias:
 * - COLORS desde theme/colors
 *
 * Ejemplo de uso:
 * import { styles } from './colaboradorCardStyles';
 * <View style={styles.card}>...</View>
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  details: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  detailRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
},
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
actionBtn: {
  marginTop: 0,
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderWidth: 1,
  borderRadius: 6,
  backgroundColor: "transparent",
  minWidth: 70,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: 4,
},
});