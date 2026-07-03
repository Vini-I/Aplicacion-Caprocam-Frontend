import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors.js";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 920,
    alignSelf: "center",
  },
  card: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontWeight: "700",
    letterSpacing: 0.3,
    color: COLORS.textPrimary,
  },
  groupTitle: {
    fontWeight: "700",
    letterSpacing: 0.2,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionSpacer: {
    height: 12,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  column: {
    flex: 1,
    minWidth: 220,
  },
  fullWidth: {
    width: "100%",
  },
  textArea: {
    minHeight: 140,
  },
  invalidField: {
    borderColor: COLORS.error,
  },
  errorBox: {
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: COLORS.error,
    fontWeight: "600",
  },
  saveButton: {
    marginTop: 4,
    minHeight: 52,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});