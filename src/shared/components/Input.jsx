/**
 * ============================================================
 * COMPONENTE INPUT
 * ============================================================
 *
 * Campo de entrada reutilizable.
 *
 * Responsabilidad:
 * - Renderiza campos de texto normales y multilinea.
 * - Soporta campos requeridos de forma global.
 * - Muestra asterisco cuando required es true.
 * - Muestra borde rojo cuando submitted es true o llega error.
 */

import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";

import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";

export default function Input({
  label = "",
  numericOnly = false,
  value = "",
  onChangeText,
  placeholder = "",
  multiline = false,
  editable = true,
  keyboardType = "default",
  required = false,
  submitted = false,
  error = "",
  helperText = "",
  style,
  containerStyle,
  labelStyle,
  ...props
}) {
  const inputStyles = [styles.input];
  const containerStyles = [styles.container];

  let showError = false;

  if (error !== "") {
    showError = true;
  }

  if (submitted === true && required === true && String(value).trim() === "") {
    showError = true;
  }

  if (multiline === true) {
    inputStyles.push(styles.multiline);
  }

  if (editable === false) {
    inputStyles.push(styles.disabledInput);
  }

  if (showError === true) {
    inputStyles.push(styles.inputError);
  }

  if (style) {
    inputStyles.push(style);
  }

  if (containerStyle) {
    containerStyles.push(containerStyle);
  }

  const handleChangeText = (text) => {
    let newValue = text;

    if (numericOnly) {
      newValue = text.replace(/[^0-9.]/g, "");
    }

    onChangeText(newValue);
  };

  return (
    <View style={containerStyles}>
      {label !== "" && (
        <Text style={[styles.label, labelStyle]}>
          {label}

          {required === true && <Text style={styles.requiredMark}> *</Text>}
        </Text>
      )}

      <TextInput
        style={inputStyles}
        value={value}
        onChangeText={handleChangeText}
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
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  requiredMark: {
    color: COLORS.error,
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
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  inputError: {
    borderColor: COLORS.error,
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
