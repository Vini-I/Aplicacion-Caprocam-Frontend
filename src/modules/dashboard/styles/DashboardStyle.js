/**
 * ============================================================
 * ESTILOS DEL DASHBOARD GENERAL
 * ============================================================
 *
 * Estilos exclusivos para DashboardScreen.
 *
 * Incluye:
 * - Header celeste.
 * - Cards desplegables.
 * - Alertas.
 * - Gráficas simples.
 * - Gráfico circular de estanques activos/cosechados.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
  },

  scrollContent: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingTop: 14,
    paddingBottom: 28,
  },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  headerIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerTextBox: {
    flex: 1,
    minWidth: 0,
  },

  headerTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.white,
  },

  headerSubtitle: {
    marginTop: 2,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  alertsCard: {
    width: "100%",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 14,
  },

  alertsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  alertsTitleBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },

  alertsIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFF7D6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  alertsTextBox: {
    flex: 1,
    minWidth: 0,
  },

  alertsTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
  },

  alertsCounter: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF7D6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  emptyAlertBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  alertItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },

  alertCritical: {
    backgroundColor: COLORS.errorLight,
    borderColor: "#FCA5A5",
  },

  alertWarning: {
    backgroundColor: COLORS.warningLight,
    borderColor: "#FDBA74",
  },

  alertInfo: {
    backgroundColor: "#ECF8FF",
    borderColor: "#BAE6FD",
  },

  alertIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  alertContent: {
    flex: 1,
    minWidth: 0,
  },

  alertTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  alertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: COLORS.white,
  },

  alertMessage: {
    marginTop: 4,
    lineHeight: 17,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  statsGrid: {
    width: "100%",
    gap: 12,
    marginBottom: 14,
  },

  statsGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  statCard: {
    width: "100%",
    minHeight: 118,
    borderRadius: 18,
    padding: 16,
    marginTop: 0,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "flex-start",
    justifyContent: "space-between",
    shadowOpacity: 0,
    elevation: 0,
  },

  statCardTablet: {
    width: "48.5%",
  },

  statCardActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  cardBlue: {
    backgroundColor: "#ECF8FF",
  },

  cardIndigo: {
    backgroundColor: "#EEF6FF",
  },

  cardYellow: {
    backgroundColor: "#FFF9E8",
  },

  cardRed: {
    backgroundColor: "#FFF0F2",
  },

  statTopRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statBottom: {
    width: "100%",
  },

  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  iconBlue: {
    backgroundColor: "#D7F0FF",
  },

  iconIndigo: {
    backgroundColor: "#DDEBFF",
  },

  iconYellow: {
    backgroundColor: "#FFF0BA",
  },

  iconRed: {
    backgroundColor: "#FFDDE2",
  },

  statValue: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: "900",
    color: COLORS.textSecondary,
    marginTop: 12,
  },

  statValueDanger: {
    color: "#FF002A",
  },

  statLabel: {
    marginTop: 4,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  detailCard: {
    width: "100%",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionTitle: {
    marginLeft: 8,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 14,
    marginBottom: 16,
  },

  panelSubtitle: {
    marginBottom: 12,
    letterSpacing: 0.5,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  panelSubtitleSecondary: {
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: 0.5,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  emptyBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  barChart: {
    height: 170,
    width: "100%",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.textQuaternary,
    marginBottom: 18,
    position: "relative",
    overflow: "hidden",
  },

  chartGridLines: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 28,
    justifyContent: "space-between",
  },

  gridLine: {
    height: 1,
    width: "100%",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#E5EAF2",
  },

  barChartContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },

  barItem: {
    flex: 1,
    alignItems: "center",
    minWidth: 0,
  },

  barTrack: {
    height: 115,
    width: 36,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  barFill: {
    width: "100%",
    backgroundColor: "#38BDF8",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    maxHeight: 115,
  },

  barLabel: {
    width: "100%",
    marginTop: 6,
    paddingHorizontal: 2,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  twoColumns: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },

  chartColumn: {
    flex: 1,
    alignItems: "center",
    minWidth: 0,
  },

  donutWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  donutChart: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    backgroundColor: "#94A3B8",
    position: "relative",
  },

  donutActiveSegment: {
    height: "100%",
    backgroundColor: "#38BDF8",
  },

  donutHarvestSegment: {
    height: "100%",
    backgroundColor: "#94A3B8",
  },

  donutInner: {
    position: "absolute",
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    top: 26,
    left: 26,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendBlue: {
    width: 10,
    height: 10,
    backgroundColor: "#38BDF8",
    marginRight: 4,
  },

  legendGray: {
    width: 10,
    height: 10,
    backgroundColor: "#94A3B8",
    marginRight: 4,
  },

  lineChart: {
    height: 135,
    width: "100%",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.textQuaternary,
    position: "relative",
    overflow: "hidden",
  },

  lineBars: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingHorizontal: 4,
  },

  lineItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    minWidth: 0,
  },

  lineBar: {
    width: 8,
    backgroundColor: "#38BDF8",
    borderRadius: 8,
    marginBottom: 4,
    maxHeight: 105,
  },

  infoRowBlue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECF8FF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  infoRowIndigo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF6FF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  rowIconBoxBlue: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#BDE8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rowIconBoxIndigo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rowContent: {
    flex: 1,
    minWidth: 0,
  },

  rowDescription: {
    marginTop: 3,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  rowRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 8,
  },

  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 4,
    backgroundColor: "#EAF7FF",
  },

  diseaseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 12,
    marginBottom: 8,
  },

  diseaseDotRed: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.error,
    marginRight: 12,
  },

  diseaseDotViolet: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.violet,
    marginRight: 12,
  },

  caseText: {
    marginLeft: 6,
  },

  caseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF9E8",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },

  badgeAlta: {
    backgroundColor: "#FFE4E6",
    borderColor: "#FDA4AF",
  },

  badgeMedia: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FCD34D",
  },

  badgeBaja: {
    backgroundColor: "#DCFCE7",
    borderColor: "#86EFAC",
  },

  mortalityTotalBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F2",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FFCCD5",
  },

  totalBoxText: {
    marginLeft: 18,
    flex: 1,
    minWidth: 0,
  },

  mortalityRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F2",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },

  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  recordIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
});
