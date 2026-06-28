import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center", 
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  lastActive: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginTop: 8,
  },
});