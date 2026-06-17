import { StyleSheet, Platform, StatusBar } from "react-native";
import { COLORS } from "../../../theme/colors";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.surface,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
  },

  subTitle: {
    color: COLORS.textSecondary,
    marginBottom: 10,
    marginTop: 6,
    fontSize: 16,
    fontWeight: "600",
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

  backBtn: { 
    flexDirection: "row", alignItems: "center", gap: 4 
  },

  headerTitle: { 
    flexDirection: "row", alignItems: "center", gap: 10 
  },

  headerTitleText: { 
    fontSize: 22, fontWeight: "700" 
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
});