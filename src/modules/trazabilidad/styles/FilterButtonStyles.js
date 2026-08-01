/**
 * ============================================================
 * ESTILOS FilterButtonStyles
 * ============================================================
 *
 * Descripción:
 * Estilos centralizados para el componente de filtrado FilterButton.
 *
 * @dependencies StyleSheet, COLORS
 * @validations N/A
 * @navigation N/A
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  overlay: {
    backgroundColor: COLORS.overlay,
    justifyContent: "flex-end",
    padding: 0,
  },
 modalContainer: {
  paddingHorizontal: 16,
  paddingTop: 12,
  paddingBottom: 24,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  maxHeight: "90%",
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
    borderRadius: 12,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterBtnInactive: {
    borderColor: COLORS.black,
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

export default styles;
