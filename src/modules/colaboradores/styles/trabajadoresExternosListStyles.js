import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  item: {
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingVertical: 12,
  },
  itemName: {
    fontWeight: "bold",
    color: COLORS.textSecondary,
    fontSize: 15,
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textTertiary,
    paddingVertical: 16,
  },
});