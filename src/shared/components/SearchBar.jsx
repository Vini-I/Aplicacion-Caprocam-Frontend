/**
 * ============================================================
 * COMPONENTE SEARCHBAR
 * ============================================================
 *
 * Responsabilidad:
 * - Barra de busqueda global para listados y filtros.
 * - Mantiene borde, icono y placeholder consistente.
 * - Evita SearchBar duplicados en modulos.
 */

import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import Icon from "./Icons";
import { COLORS } from "../../theme/colors";
import { ICONS } from "../../theme/icons";
import { TYPOGRAPHY } from "../../theme/typography";

export default function SearchBar({
  value = "",
  onChangeText,
  placeholder = "Buscar",
  containerStyle,
  inputStyle,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Icon icon={ICONS.filter} size={16} color={COLORS.textTertiary} />

      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textQuaternary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});
