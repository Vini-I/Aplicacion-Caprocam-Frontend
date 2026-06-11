/**
 * ============================================================
 * COMPONENTE INPUT
 * ============================================================
 *
 * Campo de entrada reutilizable para React Native.
 *
 * Funcionalidad:
 * - Permite campos de texto normales.
 * - Permite campos multilinea.
 * - Permite usar inputType="date" para abrir calendario.
 * - Cuando inputType es "date", implementa DateInput.
 *
 * Props principales:
 * - label: texto opcional mostrado arriba del campo.
 * - value: valor actual del input.
 * - onChangeText: funcion que recibe el nuevo valor.
 * - placeholder: texto de ayuda.
 * - inputType: tipo de input. Usa "text" o "date".
 * - multiline: permite escribir varias lineas.
 * - editable: permite bloquear o habilitar la edicion.
 * - allowFutureDates: permite fechas futuras cuando inputType es "date".
 * - style: estilos extra para el campo.
 * - containerStyle: estilos extra para el contenedor.
 *
 * Ejemplos:
 * <Input label="Nombre" value={nombre} onChangeText={setNombre} />
 *
 * <Input
 *     label="Fecha"
 *     inputType="date"
 *     value={fecha}
 *     onChangeText={setFecha}
 * />
 */

import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import DateInput from "./DateInput.jsx";

export default function Input({
  label = "",
  value = "",
  onChangeText,
  placeholder = "",
  inputType = "text",
  multiline = false,
  editable = true,
  keyboardType = "default",
  allowFutureDates = false,
  style,
  containerStyle,
  labelStyle,
  textStyle,
  ...props
}) {
  if (inputType === "date") {
    return (
      <DateInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        disabled={!editable}
        allowFutureDates={allowFutureDates}
        inputStyle={style}
        containerStyle={containerStyle}
        labelStyle={labelStyle}
        textStyle={textStyle}
      />
    );
  }

  const inputStyles = [styles.input];

  if (multiline === true) {
    inputStyles.push(styles.multiline);
  }

  if (editable === false) {
    inputStyles.push(styles.disabledInput);
  }

  if (style) {
    inputStyles.push(style);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label !== "" && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <TextInput
        style={inputStyles}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#adb5bd"
        multiline={multiline}
        editable={editable}
        keyboardType={keyboardType}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#212529",
    backgroundColor: "#ffffff",
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
    color: "#6c757d",
  },
});
