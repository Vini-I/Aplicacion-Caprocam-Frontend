import { StyleSheet } from "react-native";

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
});