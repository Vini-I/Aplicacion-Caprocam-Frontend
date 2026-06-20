import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  navbar: { backgroundColor: COLORS.primary, borderBottomWidth: 0 },

  navbarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
  },
  card: {
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  providerType: {
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  contactText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    marginTop: 16,
  },
  editButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  tabsInternas: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    backgroundColor: COLORS.white,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 4,
  },
  tabActiva: {
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
  },
  btnAgregar: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginTop: 0,
  },
  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  btnVerDetalle: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 0,
  },
  btnVerDetalleText: {
    fontSize: 13,
    color: COLORS.white,
  },
  searchBarContainer: { flex: 1 },
  filterButton: { alignSelf: "center", marginTop: 0, height: 43 },
  contadorResultados: { marginHorizontal: 16, marginTop: 10, marginBottom: 4 },
  lista: { paddingBottom: 24 },
});
