/**
 * ============================================================
 * ESTILOS - FILTERBUTTON
 * ============================================================
 *
 * Define los estilos del componente de filtrado de trazabilidad,
 * incluyendo el botón principal, el modal y los chips de filtro.
 *
 * Reglas:
 * - Usar colores del tema `COLORS`.
 * - Mantener los estilos de presentación separados de la lógica.
 * - `filterBtnInactive` aplica solo el borde cuando no hay filtros activos.
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    padding: 0,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.textTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterBtnInactive: {
    borderColor: COLORS.textTertiary,
  },
  filterBtnText: {
    marginLeft: 8,
  },
  badge: {
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
  },
  dateInput: {
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btnClear: {
    flex: 1,
    marginRight: 8,
  },
  btnApply: {
    flex: 1,
  },
});

export const sectionStyles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export const chipStyles = StyleSheet.create({
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: COLORS.textTertiary,
    backgroundColor: COLORS.white,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
});

export default styles;
