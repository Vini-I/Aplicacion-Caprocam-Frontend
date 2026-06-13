import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
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
    color: "#000",
  },

  valor: {
    flex: 2,
    textAlign: "right",
    color: "#555",
  },

  addButton: {
    borderWidth: 2,
    borderColor: "#0088FF",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  addButtonText: {
    color: "#0088FF",
    fontWeight: "700",
  },

  titleText: {
    marginBottom: 8,
    color: "#708090",
  }
});