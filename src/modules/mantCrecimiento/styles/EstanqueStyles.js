import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },

  contentWrapper: {
    flex: 1,
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },

  cardContent: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  inputWrapper: {
    flex: 1,
  },

  inputItem: {
    flex: 1,
    marginRight: 10,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 10,
  },

  badgeItem: {
    marginRight: 8,
    marginBottom: 6,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },

  resultCard: {
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: COLORS.success,
  },

  errorText: {
    color: COLORS.error,
    marginTop: 12,
  },

  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.secondary,
    borderRadius: 28,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  detalles: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  detalle: {
    color: COLORS.secondary,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  IconoDetalle: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingLeft: 12,
  },

  iconoDetalleText: {
    fontSize: 22,
    color: "#6c757d",
  },

  addButton: {
    maxWidth: 700,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: "row",
  },
});
