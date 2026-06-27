import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

/**
 * contenedor    → pantalla completa (SafeAreaView)
 * scroll        → contenido centrado, ancho máximo 700
 * seccion       → tarjeta de selección de finca/estanque
 * chips         → contenedor flex-wrap de Chip
 * grilla        → contenedor flex-wrap de ModuloCard, gap 12
 * moduloCard    → width 47.5% (2 columnas junto con el gap de grilla)
 */

export const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  scroll: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 32,
  },

  seccion: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: COLORS.textQuaternary,
  },

  seccionLabel: { letterSpacing: 0.8, marginBottom: 14 },
  subLabel: { marginBottom: 8 },

  chips: {
    backgroundColor: COLORS.white,
    marginTop: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 99,
    borderWidth: 0.3,
    borderColor: COLORS.textQuaternary,
    backgroundColor: COLORS.white,
  },

  chipSelected: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },

  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  moduloCard: {
    width: '47.5%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: COLORS.textQuaternary,
    padding: 14,
    marginTop: 0,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  moduloIcono: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  moduloLabel: { marginBottom: 2 },
  moduloDesc: { marginBottom: 8, lineHeight: 16 },
});
