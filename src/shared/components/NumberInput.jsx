/**
 * ============================================================
 * COMPONENTE NUMBERINPUT
 * ============================================================
 *
 * Campo numerico reutilizable con botones para aumentar
 * y disminuir valores.
 *
 * Responsabilidad:
 * - Permite ingresar numeros manualmente.
 * - Filtra cualquier caracter que no sea numerico.
 * - Soporta required, submitted, error y helperText.
 */

import React from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";

export default function NumberInput({
  label = "",
  value = "0",
  onChangeText,
  min = 0,
  max = 9999,
  step = 1,
  editable = true,
  required = false,
  submitted = false,
  error = "",
  helperText = "",
  containerStyle,
  labelStyle,
  style,
}) {
  let showError = false;

  if (error !== "") {
    showError = true;
  }

  if (submitted === true && required === true && String(value).trim() === "") {
    showError = true;
  }

  function aumentar() {
    const actual = Number(value);
    const nuevo = actual + step;

    if (nuevo > max) {
      return;
    }

    if (onChangeText) {
      onChangeText(String(nuevo));
    }
  }

  function disminuir() {
    const actual = Number(value);
    const nuevo = actual - step;

    if (nuevo < min) {
      return;
    }

    if (onChangeText) {
      onChangeText(String(nuevo));
    }
  }

  function handleChange(text) {
    const numero = text.replace(/[^0-9]/g, "");

    if (numero !== "" && Number(numero) > max) {
      return;
    }

    if (onChangeText) {
      onChangeText(numero);
    }
  }

  const rowStyles = [styles.row];

  if (editable === false) {
    rowStyles.push(styles.rowDisabled);
  }

  if (showError === true) {
    rowStyles.push(styles.rowError);
  }

  if (style) {
    rowStyles.push(style);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label !== "" && (
        <Text style={[styles.label, labelStyle]}>
          {label}

          {required === true && <Text style={styles.requiredMark}> *</Text>}
        </Text>
      )}

      <View style={rowStyles}>
        <TextInput
          style={styles.input}
          value={String(value)}
          onChangeText={handleChange}
          keyboardType="numeric"
          editable={editable}
        />

        <View style={styles.flechas}>
          <Pressable
            style={styles.flecha}
            onPress={aumentar}
            disabled={!editable}
          >
            <Text style={styles.flechaTexto}>▲</Text>
          </Pressable>

          <View style={styles.separador} />

          <Pressable
            style={styles.flecha}
            onPress={disminuir}
            disabled={!editable}
          >
            <Text style={styles.flechaTexto}>▼</Text>
          </Pressable>
        </View>
      </View>

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

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.inputBorder || COLORS.secondary,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    height: 50,
  },

  rowError: {
    borderColor: COLORS.error,
  },

  rowDisabled: {
    backgroundColor: COLORS.surface,
    opacity: 0.7,
  },

  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    paddingHorizontal: 12,
  },

  flechas: {
    width: 36,
    height: 50,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.inputBorder || COLORS.secondary,
    backgroundColor: COLORS.surface,
  },

  flecha: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  separador: {
    height: 5,
    backgroundColor: COLORS.inputBorder || COLORS.secondary,
  },

  flechaTexto: {
    fontSize: 11,
    color: COLORS.textTertiary,
    lineHeight: 13,
  },

  helperText: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  errorText: {
    color: COLORS.error,
  },
});
