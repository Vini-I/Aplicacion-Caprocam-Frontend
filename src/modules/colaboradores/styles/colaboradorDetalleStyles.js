import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  closeButton: { padding: 16, alignItems: "flex-end" },
  closeButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: "600" },
  card: { 
    margin: 16, 
    marginBottom: 12,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center", 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 12,
  },
  infoRow: { flexDirection: "row", marginBottom: 8, flexWrap: "wrap" },
  label: { fontWeight: "bold", width: 110, color: COLORS.textSecondary },
  value: { flex: 1, color: COLORS.textTertiary },
  link: { color: COLORS.primary, textDecorationLine: "underline" },
  error: { color: COLORS.error, textAlign: "center", marginTop: 20 },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center", 
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  statsRow: {
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
  trabajadoresSection: { marginTop: 8 },
  searchContainer: { paddingHorizontal: 16, marginBottom: 8 },
  searchInput: { marginBottom: 0, backgroundColor: COLORS.white, borderRadius: 8 },
});