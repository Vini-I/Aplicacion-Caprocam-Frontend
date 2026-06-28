import { StyleSheet } from 'react-native';

import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
  safeActionArea: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  footerContent: {
    paddingHorizontal: 20,
    paddingBottom: 6,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
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
  sectionSubtitle: {
    marginTop: 4,
    marginBottom: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  workersList: {
    marginTop: 6,
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
  validationContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 2,
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
  pinErrorText: {
    marginTop: 10,
    marginBottom: 8,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});

export default styles;
