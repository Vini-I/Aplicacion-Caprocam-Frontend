/**
 * ============================================================
 * ESTILOS MODULO MAREAS
 * ============================================================
 *
 * Estilos exclusivos para MareasScreen.
 *
 * Diseño inspirado en dashboard oscuro:
 * - Tarjetas navy.
 * - Indicadores operativos.
 * - Tabla de mareas.
 * - Ventanas de llenado, cosecha y navegación.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080F20",
  },

  scroll: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },

  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  brandSubtitle: {
    letterSpacing: 1.5,
    marginTop: 2,
  },

  unitSelector: {
    flexDirection: "row",
    gap: 8,
  },

  unitButton: {
    backgroundColor: "#111A2E",
    borderWidth: 1,
    borderColor: "#22304F",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 0,
  },

  unitButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  zoneSelector: {
    marginBottom: 14,
  },

  zoneButton: {
    backgroundColor: "#111A2E",
    borderWidth: 1,
    borderColor: "#22304F",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 0,
    marginRight: 8,
  },

  zoneButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  loadingBox: {
    backgroundColor: "#10182D",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#22304F",
  },

  loadingText: {
    marginTop: 10,
  },

  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  refreshButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
  },

  summaryGrid: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
    flexWrap: "wrap",
  },

  statusCard: {
    flex: 1,
    minWidth: 290,
    backgroundColor: "#111A2E",
    borderColor: "#22304F",
    borderRadius: 18,
    padding: 20,
    marginBottom: 0,
  },

  darkCardTitle: {
    color: "#B7C0DA",
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    letterSpacing: 0.4,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  liveBadge: {
    backgroundColor: "#372036",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  portPill: {
    alignSelf: "flex-start",
    backgroundColor: "#143B86",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 20,
  },

  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
  },

  trendBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  trendDown: {
    backgroundColor: "#7F2D2D",
  },

  trendUp: {
    backgroundColor: "#0F766E",
  },

  darkDivider: {
    height: 1,
    backgroundColor: "#22304F",
    marginVertical: 16,
  },

  infoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },

  indicatorBody: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  coefficientCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },

  indicatorTextBox: {
    flex: 1,
    minWidth: 0,
  },

  indicatorDesc: {
    marginTop: 6,
    lineHeight: 18,
  },

  sunRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  sunItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  sunText: {
    marginLeft: 8,
  },

  moonPercentBadge: {
    backgroundColor: "#263149",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  moonMainRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  moonCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  moonTextBox: {
    flex: 1,
    minWidth: 0,
  },

  moonPhasesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  moonPhaseItem: {
    alignItems: "center",
    width: 62,
  },

  chartCard: {
    backgroundColor: "#111A2E",
    borderColor: "#22304F",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },

  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },

  legendInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendDotCyan: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#22D3EE",
    marginRight: 5,
  },

  legendDotRed: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#F97372",
    marginRight: 5,
  },

  waveChart: {
    height: 230,
    borderRadius: 14,
    backgroundColor: "#0E172A",
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#1F2A44",
  },

  chartGridLineTop: {
    position: "absolute",
    left: 16,
    right: 16,
    top: "25%",
    height: 1,
    backgroundColor: "#1F2A44",
  },

  chartGridLineMiddle: {
    position: "absolute",
    left: 16,
    right: 16,
    top: "50%",
    height: 1,
    backgroundColor: "#1F2A44",
  },

  chartGridLineBottom: {
    position: "absolute",
    left: 16,
    right: 16,
    top: "75%",
    height: 1,
    backgroundColor: "#1F2A44",
  },

  wavePointBox: {
    position: "absolute",
    width: 95,
    alignItems: "center",
  },

  waveLabel: {
    marginBottom: 5,
    textShadowColor: "#000",
    textShadowRadius: 4,
  },

  wavePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  wavePointHigh: {
    backgroundColor: "#22D3EE",
  },

  wavePointLow: {
    backgroundColor: "#F97372",
  },

  tableCard: {
    backgroundColor: "#111A2E",
    borderColor: "#22304F",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },

  tableHeaderTop: {
    marginBottom: 14,
  },

  table: {
    minWidth: 980,
  },

  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#22304F",
    paddingBottom: 10,
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: "#18243A",
  },

  dayCell: {
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  tideColumn: {
    width: 150,
  },

  tableTideCell: {
    width: 150,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  tidePill: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  tidePillHigh: {
    backgroundColor: "#0E7490",
  },

  tidePillLow: {
    backgroundColor: "#7F1D1D",
  },

  coefCell: {
    width: 90,
    alignItems: "center",
  },

  coefficientBadge: {
    minWidth: 34,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: "center",
  },

  coefficientLow: {
    backgroundColor: "#334155",
  },

  coefficientMedium: {
    backgroundColor: "#1D4ED8",
  },

  coefficientHigh: {
    backgroundColor: "#B45309",
  },

  sunCell: {
    width: 170,
  },

  windowsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  windowCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: "#111A2E",
    borderColor: "#22304F",
    borderRadius: 18,
    padding: 20,
    marginBottom: 0,
  },

  windowSubtitle: {
    marginTop: 3,
  },

  windowItem: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#1A2338",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  windowFill: {
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },

  windowDrain: {
    borderLeftWidth: 4,
    borderLeftColor: "#F97372",
  },

  windowRightText: {
    flex: 1,
    marginLeft: 12,
    alignItems: "flex-end",
  },

  navigationCard: {
    marginTop: 14,
    backgroundColor: "#111A2E",
    borderColor: "#22304F",
    borderRadius: 18,
    padding: 0,
    overflow: "hidden",
  },

  navigationAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: "#10B981",
  },

  navigationContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },

  navigationTextBox: {
    marginLeft: 14,
    flex: 1,
    minWidth: 0,
  },
});
