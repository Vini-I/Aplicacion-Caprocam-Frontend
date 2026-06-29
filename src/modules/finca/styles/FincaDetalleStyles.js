import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors"

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },

  contentWrapper: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  detalleCard: {
    padding: 16,
  },

  filaDetalle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 4,
  },

  etiqueta: {
    width: 120,
    fontWeight: "bold",
    color: COLORS.black,
  },

  valor: {
    flex: 2,
    textAlign: "right",
    color: COLORS.textTertiary,
  },

  buttonExport: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.success,
  },

  iconDocument: {
    marginRight: 5
  },

  addButton: {
    maxWidth: "100%",
    alignSelf: "center",
    width: "100%",
    borderWidth: 2,
    color: COLORS.black,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    borderStyle: "dashed",
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  addButtonText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginLeft: 8,
  },

  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  iconAdd: {
    marginRight: 5
  },

  iconDetail: {
    marginRight: 5
  },

  titleText: {
    marginBottom: 8,
    color: COLORS.textTertiary,
  }
});