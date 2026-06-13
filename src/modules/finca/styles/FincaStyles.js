import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700; 

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems:"center",
    width: "100%",
  },

  contentWrapper: {
    width: "100%",
    maxWidth: 700,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 1,
  },

  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#E3F2FD",
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
    color: "#FFF",
    backgroundColor: "#0088FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    fontSize: 13,
  },

  IconoDetalle: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 12,
  },

  iconoDetalleText: {
    fontSize: 22,
    color: "#6c757d",
  },

  addButton: {
    maxWidth: 700,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#0088FF",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});