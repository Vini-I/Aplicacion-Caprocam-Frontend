/**
 * ESTILOS: loginStyles
 * Centraliza el layout y la apariencia de la pantalla de login.
 *
 * @dependencies - COLORS de theme/colors, TYPOGRAPHY de theme/typography
 * @validations  - Reglas de flexbox y alineaciones del formulario y tarjeta hero.
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from 'react-native';

import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    marginBottom: 16,
    borderColor: COLORS.secondary,
  },
  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  companyName: {
    marginTop: 4,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  dateText: {
    marginTop: 6,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  sectionCard: {
    marginBottom: 12,
    borderColor: COLORS.secondary,
  },
  syncButton: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
    marginBottom: 12,
  },
  searchContainer: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
    marginBottom: 12,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  searchInput: {
    borderWidth: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    outlineStyle: 'none',
  },
  continueButton: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
  },
  workersList: {
    marginTop: 6,
  },
  workersScroll: {
    height: 392, // ~5 items de ~72px cada uno
  },
  workersScrollCompressed: {
    height: 336, // reducido ~56px cuando el alert de sync es visible
  },
  workerButton: {
    marginTop: 0,
    marginBottom: 12,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    borderColor: COLORS.secondary,
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
  },
  workerCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
  },
  workerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectionBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    marginVertical: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  actionSection: {
    marginTop: 4,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
  },
  modalTitle: {
    marginBottom: 12,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  cancelButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  cancelButtonTextOutline: {
    color: COLORS.primary,
  },
  pinInputContainer: {
    width: '100%',
  },
  pinInput: {
    letterSpacing: 8,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  pinErrorAlert: {
    marginTop: 10,
    marginBottom: 8,
  },
  syncAlert: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    marginBottom: 12,
  },
  errorText: {
    color: COLORS.textPrimary,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 6,
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 16,
  },
  
  alertTextDark: {
    color: COLORS.textPrimary,
  },
  

});

export default styles;
