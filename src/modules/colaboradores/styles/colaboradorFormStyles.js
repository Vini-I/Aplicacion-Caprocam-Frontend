import { StyleSheet } from "react-native";
import { COLORS } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
  },
  cardContainer: {
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  submitButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  loader: {
    marginTop: 4,
    marginBottom: 8,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  alertContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0, // <--- reducido de 12 a 4
  },
  alertText: {
    textAlign: "center",
    fontSize: 13,
    width: "100%",
  },
});