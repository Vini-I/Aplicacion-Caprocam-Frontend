import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomWidth: 0,
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: "left",
    alignSelf: "flex-start",
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  wrapper: {
    flex: 1,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
  contentHeader: {
    paddingTop: 22,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    flex: 1,
  },
  newButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 0,
  },
  newButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
});
