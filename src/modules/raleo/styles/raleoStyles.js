import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.surface,
  },
  contenido: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  
  horasContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  pctBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
  },
  pctBtnSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  saveBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveBtnText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
});
