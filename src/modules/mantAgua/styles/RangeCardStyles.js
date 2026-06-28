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
  idealMarker: {
    position: 'absolute',
    top: 2,
    width: 1,
    height: 6,
    backgroundColor: COLORS.success,
    opacity: 0.7,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },

  // ─── Botones +/− ───────────────────────────────────────────
  stepBtn: {
    // Forma circular
    width: 36,
    height: 36,
    borderRadius: 18,
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
