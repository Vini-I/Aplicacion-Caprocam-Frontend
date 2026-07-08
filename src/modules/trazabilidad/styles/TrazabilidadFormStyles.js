export const styles = StyleSheet.create({
  cardTitle: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 16,
  },
  label: {
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 6,
    fontSize: 14,
  },
  field: {
    marginBottom: 16,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  plNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  movimientoCard: {
    position: "relative",
    zIndex: 100,
    elevation: 100,
    overflow: "visible",
  },

  selectWrapper: {
    position: "relative",
    height: 110,
    marginBottom: 16,
    overflow: "visible",
  },
  selectWrapperFinca: {
    zIndex: 4000,
    elevation: 4000,
  },
  selectWrapperOrigen: {
    zIndex: 3000,
    elevation: 3000,
  },
  selectWrapperDestino: {
    zIndex: 2000,
    elevation: 2000,
  },
  selectWrapperColaborador: {
    zIndex: 1000,
    elevation: 1000,
  },
  selectContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
    overflow: "visible",
    width: "100%",
  },
  selectAbsoluteWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
    overflow: "visible",
    width: "100%",
  },
  selectPlaceholder: {
    height: 110,
  },
  selectLabel: {
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
  },
  selectButton: {
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
  },
  selectField: {
    position: "relative",
    marginBottom: 0,
    zIndex: 9999,
    elevation: 9999,
    overflow: "visible",
  },
});