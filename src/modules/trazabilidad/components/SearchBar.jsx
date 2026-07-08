/**
 * ============================================================
 * COMPONENTE SEARCHBAR (módulo Trazabilidad)
 * ============================================================
 *
 * Barra de búsqueda reutilizable dentro del módulo Trazabilidad.
 *
 * Funcionalidad:
 * - Busca por finca, estanque o colaborador responsable.
 * - Devuelve el texto ingresado mediante onChangeText.
 *
 * Props principales:
 * - value: texto actual de búsqueda.
 * - onChangeText: función que recibe el nuevo texto.
 * - placeholder: texto de ayuda.
 * - editable: habilita o bloquea el campo.
 * - containerStyle: estilos extra para el contenedor.
 *
 * Ejemplo:
 * <SearchBar
 *   value={search}
 *   onChangeText={setSearch}
 *   placeholder="Buscar por finca, estanque o responsable..."
 * />
 */

import { View, StyleSheet } from "react-native";

import Input from "../../../shared/components/Input";

import { COLORS } from "../../../theme/colors";

export default function SearchBar({
  value = "",
  onChangeText,
  placeholder = "",
  editable = true,
  containerStyle,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
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
