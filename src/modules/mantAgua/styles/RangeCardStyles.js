/**
 * ============================================================
 * ESTILOS - RANGECARD
 * ============================================================
 *
 * Descripción:
 * Estilos para `RangeCard`, separando estilos de la tarjeta
 * (cardStyles) y estilos internos (innerStyles) para controles
 * como botones, inputs y la barra de progreso.
 *
 * Reglas importantes:
 * - Mantener consistencia con la paleta definida en `theme/colors`.
 * - Evitar estilos globales que afecten a otros componentes.
 *
 * Restricciones:
 * - Sólo contiene definiciones de StyleSheet.
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
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
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

export const innerStyles = StyleSheet.create({
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    gap: 10,
  },

  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Etiqueta izquierda (sol/luna o numérica) ───────────────
  labelWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  labelCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  labelText: {
    marginTop: 2,
  },

  // ─── Botón circular de agregar (reemplaza al antiguo stepBtn +) ──
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginTop: 0,
  },
  stepBtnIdle: { backgroundColor: COLORS.primary },

  // ─── Botón de eliminar lectura ──────────────────────────────
  iconBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginTop: 0,
    marginLeft: 2,
    borderWidth: 0,
    borderColor: COLORS.transparent,
  },

  // ─── Valor de lectura a la derecha del slider ───────────────
  rightValueWrap: {
    minWidth: 64,
    alignItems: 'flex-end',
  },

  rightContainer: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightValue: {
    fontWeight: '700',
    marginBottom: 6,
  },

  smallCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  smallCircleBtnDelete: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Input de valor ────────────────────────────────────────
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  valueInput: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 36,
    maxWidth: 64,
    margin: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    padding: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderBottomColor: COLORS.primary,

  },

  valueInputContainer: {
    marginBottom: 0,
    flex: 1,
  },
});
