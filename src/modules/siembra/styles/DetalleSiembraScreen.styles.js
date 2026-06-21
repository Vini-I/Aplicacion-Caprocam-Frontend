import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.white,
    opacity: 0.9,
  },
  
  content: {
    padding: 16,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
  alert: {
    marginBottom: 16,
  },
 
  resumenHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
 
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  resumenInfo: {
    flex: 1,
  },
  siembraTitle: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
 
  subtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textTertiary,
    marginTop: 1,
    marginBottom: 16,
  },
  
  etapas: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 16,
  },
  badgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  
  badgeEtapa: {
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
    flex: 1,
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  
  button: {
    flex: 1,
  },
  textoBoton: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
 
  selectVista: {
    backgroundColor: COLORS.secondary,
    opacity: 1,
    borderWidth: 0,
  },
 
  inputNombre: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary,
    opacity: 1,
    color: COLORS.black,
  },
  labelNombre: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  labelSelect: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
  textoSeleccionado: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  textoOpciones: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  
  inputEditing: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    opacity: 1,
    color: COLORS.black,
  },
  dateInputLectura: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary,
    opacity: 1,
  },
  dateInputTexto: {
    color: COLORS.black,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
 
  webDateContainer: {
    marginBottom: 12,
  },
  webDateInput: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid " + COLORS.textTertiary,
    fontSize: 16,
    width: "100%",
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.white,
  },
});