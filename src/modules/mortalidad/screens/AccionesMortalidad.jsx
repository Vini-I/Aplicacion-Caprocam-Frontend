import React from "react";
import { View, StyleSheet } from "react-native";

import Button from "../../../shared/components/Button";

export default function AccionesMortalidad() {
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.button}>
        <Button
          title="Cancelar"
          type="secondary"
          onPress={() => {
            console.log("Cancelar");
          }}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Registrar"
          onPress={() => {
            console.log("Guardar mortalidad");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});