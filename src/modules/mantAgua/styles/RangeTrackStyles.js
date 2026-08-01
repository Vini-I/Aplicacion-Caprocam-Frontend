/**
 * ============================================================
 * ESTILOS RangeTrackStyles
 * ============================================================
 *
 * Descripción:
 * Estilos centralizados para el componente RangeTrack (slider dinámico y etiquetas de ticks).
 *
 * @dependencies StyleSheet, COLORS, TYPOGRAPHY
 * @validations N/A
 * @navigation N/A
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  trackWrapper: {
    height: 26,
    justifyContent: 'center',
    marginTop: 22,
  },

  trackBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
    overflow: 'hidden',
  },

  zoneSegment: {
    position: 'absolute',
    height: 6,
  },

  badgeContainer: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
    transform: [{ translateX: -18 }],
  },

  badgeBox: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    minWidth: 36,
    alignItems: 'center',
  },

  badgePointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },

  thumb: {
    position: 'absolute',
    transform: [{ translateX: -10 }],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 3,
  },

  ticksContainer: {
    height: 14,
  },

  tickText: {
    position: 'absolute',
  },
});
