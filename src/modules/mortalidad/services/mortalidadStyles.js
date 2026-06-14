import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.surface,
  },

  caprocamTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
  },

  subTitle: {
    color: COLORS.textSecondary,
    marginBottom: 10,
    marginTop: 6,
  },

  label: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },

  fechaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  fechaInput: {
    flex: 1,
  },

  calendarButton: {
    marginLeft: 10,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  half: {
    width: "48%",
  },
});