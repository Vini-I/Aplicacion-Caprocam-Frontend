import { View, TextInput, StyleSheet } from "react-native";

const AlimentacionForm = ({
  form,
  updateField,
}) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Estanque"
        value={form.estanque}
        onChangeText={(value) =>
          updateField("estanque", value)
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Cantidad Kg"
        value={form.cantidadKg}
        onChangeText={(value) =>
          updateField("cantidadKg", value)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
});

export default AlimentacionForm;