import { StyleSheet } from "react-native";
import { COLORS } from '../../../theme/colors';


export const styles = StyleSheet.create({
  container: { 
    paddingVertical: 8 
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  submitButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  loader: { 
    marginTop: 4, 
    marginBottom: 8 
  },
    inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
    alertContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: {
    textAlign: "center",
    fontSize: 13,
    width: "100%",
  },
});