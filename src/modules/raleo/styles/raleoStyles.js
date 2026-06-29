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
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  backBtn: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
    marginBottom: 20,
  },
  backBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backBtnText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
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
