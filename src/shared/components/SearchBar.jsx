/**
 * ============================================================
 * COMPONENTE SEARCHBAR
 * ============================================================
 *
 * Barra de busqueda reutilizable para React Native.
 *
 * Funcionalidad:
 * - Busca por nombre de producto, categoria o proveedor.
 * - Devuelve el texto ingresado mediante onChangeText.
 * - Preparada para conectar al backend.
 *
 * Props principales:
 * - value: texto actual de busqueda.
 * - onChangeText: funcion que recibe el nuevo texto.
 * - placeholder: texto de ayuda.
 * - editable: habilita o bloquea el campo.
 * - containerStyle: estilos extra para el contenedor.
 *
 * Ejemplo:
 * <SearchBar
 *   value={search}
 *   onChangeText={setSearch}
 * />
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import Input from "./Input";
import Icon from "./Icons";

import { COLORS } from "../../theme/colors";
import { ICONS } from "../../theme/icons";


export default function SearchBar({
  value = "",
  onChangeText,
  placeholder = "",
  editable = true,
  containerStyle,
}) {

  return (
    <View style={[styles.container, containerStyle]}>
      <Input value={value}
        onChangeText={onChangeText}
        placeholder = {placeholder}
        editable = {editable}
        containerStyle={styles.inputContainer}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.textTertiary,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
  },
  iconWrap: {
    marginRight: 6,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    borderWidth: 0,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    outlineStyle: "none",
  },
});
