/**
 * ============================================================
 * ESTILOS RangeCardStyles
 * ============================================================
 *
 * Descripción:
 * Estilos para RangeCard, separando layout de la tarjeta en 2 filas responsivas (header/badge superior y slider a ancho completo inferior).
 *
 * @dependencies StyleSheet, COLORS, TYPOGRAPHY
 * @validations N/A
 * @navigation N/A
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTimeWrap: {
    marginBottom: 0,
  },
  headerTimeInput: {
    minHeight: 32,
    paddingVertical: 2,
    paddingLeft: 8,
    paddingRight: 4,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.secondary,
  },
  headerTimeText: {
    fontSize: 12,
  },
});

export const innerStyles = StyleSheet.create({
  readingItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },

  readingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  readingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  readingDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },

  labelCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },

  labelText: {
    marginLeft: 2,
  },

  readingTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  timeInputWrap: {
    marginBottom: 0,
  },

  timeInput: {
    height: 36,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timeText: {
    fontSize: 13.5,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
  },

  valueBadge: {
    height: 36,
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },

  stepHoldBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  stepBtnIdle: {
    backgroundColor: COLORS.primary,
  },

  iconBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderColor: COLORS.transparent,
  },
});
