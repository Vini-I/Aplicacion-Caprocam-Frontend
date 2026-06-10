import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import Select from "../../../shared/components/Select";

/**
 * Componente encargado de mostrar
 * el formulario para registrar una siembra.
 */
export default function SiembraForm() {
  const [formData, setFormData] = useState({
    fechaSiembra: "",
    estanque: "",
    cantidadSembrada: "",
    certificadoLarva: "",
    tecnicaCultivo: "",
    diasMaduracion: "90",
  });

  const estanques = [
    { label: "A01", value: "A01" },
    { label: "A02", value: "A02" },
    { label: "B01", value: "B01" },
    { label: "B02", value: "B02" },
  ];

  const tecnicasCultivo = [
    { label: "Semi-intensiva", value: "Semi-intensiva" },
    { label: "Intensiva", value: "Intensiva" },
    { label: "Extensiva", value: "Extensiva" },
  ];

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fecha de siembra</Text>
      <TextInput
        style={styles.input}
        placeholder="dd/mm/aaaa"
        value={formData.fechaSiembra}
        onChangeText={(value) => handleChange("fechaSiembra", value)}
      />

      <Select
        label="Estanque"
        placeholder="Seleccionar estanque"
        options={estanques}
        value={formData.estanque}
        onChange={(value) => handleChange("estanque", value)}
      />

      <Text style={styles.label}>Cantidad sembrada</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese la cantidad"
        keyboardType="numeric"
        value={formData.cantidadSembrada}
        onChangeText={(value) => handleChange("cantidadSembrada", value)}
      />

      <Text style={styles.label}>Certificado de larva</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el certificado"
        value={formData.certificadoLarva}
        onChangeText={(value) => handleChange("certificadoLarva", value)}
      />

      <Select
        label="Técnica de cultivo"
        placeholder="Seleccionar técnica"
        options={tecnicasCultivo}
        value={formData.tecnicaCultivo}
        onChange={(value) => handleChange("tecnicaCultivo", value)}
      />

      <Text style={styles.label}>Días de maduración</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese los días"
        keyboardType="numeric"
        value={formData.diasMaduracion}
        onChangeText={(value) => handleChange("diasMaduracion", value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4E6482",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DCE6F2",
    borderRadius: 12,
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 15,
    fontSize: 14,
  },
});
