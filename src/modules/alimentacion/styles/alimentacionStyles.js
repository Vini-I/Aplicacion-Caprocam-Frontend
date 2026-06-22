import { StyleSheet, Platform, StatusBar } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  contenido: {
    flexGrow: 1,
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },

  secLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  spacer: {
    height: 20,
  },

  fab: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },

  btnPrimario: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + 8
        : 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 12,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerTitleText: {
    fontSize: 22,
    fontWeight: "700",
  },
});