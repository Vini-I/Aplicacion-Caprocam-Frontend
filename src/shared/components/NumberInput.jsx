import React from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";

/**
 * ============================================================
 * COMPONENTE NUMBERINPUT
 * ============================================================
 *
 * Campo numerico reutilizable con botones para aumentar
 * y disminuir valores.
 *
 * Funcionalidad:
 * - Permite ingresar numeros manualmente.
 * - Filtra cualquier caracter que no sea numerico.
 * - Permite incrementar el valor mediante una flecha superior.
 * - Permite disminuir el valor mediante una flecha inferior.
 * - Respeta limites minimos y maximos configurables.
 * - Puede deshabilitarse mediante la prop editable.
 *
 * Props:
 * - label: texto mostrado encima del campo.
 * - value: valor actual del input.
 * - onChangeText: funcion que recibe el nuevo valor.
 * - min: valor minimo permitido.
 * - max: valor maximo permitido.
 * - step: cantidad que aumenta o disminuye por cada clic.
 * - editable: habilita o deshabilita la edicion.
 * - containerStyle: estilos personalizados para el contenedor.
 * - labelStyle: estilos personalizados para la etiqueta.
 * - style: estilos personalizados para la fila principal.
 */

export default function NumberInput({
  label = "",
  value = "0",
  onChangeText,
  min = 0,
  max = 9999,
  step = 1,
  editable = true,
  containerStyle,
  labelStyle,
  style,
}) {

  /**
   * Incrementa el valor actual utilizando el valor definido en step.
   * Si el nuevo valor supera el maximo permitido, no realiza cambios.
   */
  function aumentar() {
    const actual = Number(value);
    const nuevo = actual + step;

    if (nuevo > max) return;

    if (onChangeText) onChangeText(String(nuevo));
  }

  /**
   * Disminuye el valor actual utilizando el valor definido en step.
   * Si el nuevo valor es menor al minimo permitido, no realiza cambios.
   */
  function disminuir() {
    const actual = Number(value);
    const nuevo = actual - step;

    if (nuevo < min) return;

    if (onChangeText) onChangeText(String(nuevo));
  }

  /**
   * Maneja la escritura manual dentro del TextInput.
   *
   * Validaciones:
   * - Elimina cualquier caracter que no sea un numero.
   * - Evita ingresar valores mayores al maximo permitido.
   * - Actualiza el valor mediante onChangeText.
   */
  function handleChange(text) {
    const numero = text.replace(/[^0-9]/g, "");

    if (numero !== "" && Number(numero) > max) return;

    if (onChangeText) onChangeText(numero);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Etiqueta opcional mostrada encima del campo */}
      {label !== "" && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}

      {/* Contenedor principal del input y botones */}
      <View style={[styles.row, !editable && styles.rowDisabled, style]}>
        
        {/* Campo para ingreso manual de numeros */}
        <TextInput
          style={styles.input}
          value={String(value)}
          onChangeText={handleChange}
          keyboardType="numeric"
          editable={editable}
        />

        {/* Contenedor de botones para aumentar y disminuir */}
        <View style={styles.flechas}>
          
          {/* Boton para incrementar */}
          <Pressable
            style={({ pressed }) => [
              styles.flecha,
              pressed && styles.flechaPressed,
            ]}
            onPress={aumentar}
            disabled={!editable}
          >
            <Text style={styles.flechaTexto}>▲</Text>
          </Pressable>

          {/* Separador visual entre ambos botones */}
          <View style={styles.separador} />

          {/* Boton para disminuir */}
          <Pressable
            style={({ pressed }) => [
              styles.flecha,
              pressed && styles.flechaPressed,
            ]}
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
  /**
   * Contenedor principal del componente.
   */
  container: {
    marginBottom: 12,
  },

  /**
   * Estilo de la etiqueta superior.
   */
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  /**
   * Contenedor que agrupa el input y las flechas.
   */
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    height: 50,
  },

  /**
   * Estilo aplicado cuando el componente esta deshabilitado.
   */
  rowDisabled: {
    backgroundColor: COLORS.secondary,
    opacity: 0.7,
  },

  /**
   * Campo de texto donde se muestra y edita el valor.
   */
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    paddingHorizontal: 12,
  },

  /**
   * Contenedor lateral de los botones de incremento y decremento.
   */
  flechas: {
    width: 36,
    height: 50,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.secondary,
    backgroundColor: COLORS.surface,
  },

  /**
   * Estilo base de cada boton.
   */
  flecha: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  /**
   * Color temporal mostrado al presionar una flecha.
   */
  flechaPressed: {
    backgroundColor: COLORS.secondary,
  },

  /**
   * Linea divisoria entre ambas flechas.
   */
  separador: {
    height: 5,
    backgroundColor: COLORS.secondary,
  },

  /**
   * Estilo del simbolo de flecha.
   */
  flechaTexto: {
    fontSize: 11,
    color: COLORS.textTertiary,
    lineHeight: 13,
  },
});