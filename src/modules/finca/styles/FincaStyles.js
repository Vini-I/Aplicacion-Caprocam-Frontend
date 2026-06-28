import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";

export const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },

  ContentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },

  Card: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginVertical: 5,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },

  CardContent: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-start",
  },

  IconContainer: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.secondary,
    borderRadius: 28,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  Detalles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },

  DetallesColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  Detalle: {
    color: COLORS.primary,
    backgroundColor: COLORS.secondary,
    alignSelf: "flex-start",
  },

  Buttons: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginRight: 20,
  },

  Eliminar: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.error,
    borderWidth: 2,
    marginBottom: "auto",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 2,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },

  Editar: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 2,
    marginBottom: "auto",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 2,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  AddButton: {
    maxWidth: 900,
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
});
