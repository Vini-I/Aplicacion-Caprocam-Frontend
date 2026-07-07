/**
 * ============================================================
 * COMPONENTE CARD
 * ============================================================
 *
 * Tarjeta reutilizable para agrupar informacion.
 *
 * Funcionalidad:
 * - Puede mostrar titulo opcional.
 * - Recibe children para colocar cualquier contenido dentro.
 * - Permite estilos personalizados.
 *
 * Props principales:
 * - title: titulo opcional de la tarjeta.
 * - children: contenido interno de la tarjeta.
 * - style: estilos extra para la tarjeta.
 * - titleStyle: estilos extra para el titulo.
 *
 * Ejemplo:
 * <CardPress title="Informacion del estanque">
 *     <Text>Contenido</Text>
 * </CardPress>
 */

import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors.js";

export default function Card({ 
    title = "", 
    children, 
    style, 
    titleStyle,
    onPress, 
}) {
  const cardStyles = [styles.card];

  if (style) {
    cardStyles.push(style);
  }

  return (
    <Pressable
        style={({ pressed }) => [
            ...cardStyles,
            pressed && styles.pressed,
        ]}
        onPress={onPress}
    >
      {title !== "" && <Text style={[styles.title, titleStyle]}>{title}</Text>}

      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
});