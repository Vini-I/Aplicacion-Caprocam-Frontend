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
 * - Permite bloquear o habilitar la edicion.
 * - Permite configurar el teclado.
 *
 * Importante:
 * - Este componente ya no maneja fechas.
 * - Para fechas se debe usar DateInput.jsx por separado.
 */

import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";

import { COLORS } from "../../theme/colors";

export default function Input({
  label = "",
  value = "",
  onChangeText,
  placeholder = "",
  multiline = false,
  editable = true,
  keyboardType = "default",
  style,
  containerStyle,
  labelStyle,
  ...props
}) {
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
        placeholderTextColor={COLORS.textQuaternary}
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
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.white,
  },

  multiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  disabledInput: {
    backgroundColor: COLORS.surface,
    color: COLORS.textQuaternary,
  },
});