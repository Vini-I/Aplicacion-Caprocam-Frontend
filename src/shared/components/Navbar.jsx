/**
 * ============================================================
 * COMPONENTE NAVBAR
 * ============================================================
 *
 * Barra superior reutilizable para React Native.
 *
 * Funcionalidad:
 * - Muestra titulo de pantalla.
 * - Permite agregar boton izquierdo y boton derecho.
 * - Permite usar children para contenido personalizado.
 * - Sirve como encabezado para pantallas principales o secundarias.
 *
 * Props principales:
 * - title: titulo de la barra.
 * - leftContent: contenido opcional al lado izquierdo.
 * - rightContent: contenido opcional al lado derecho.
 * - children: contenido personalizado debajo del titulo.
 * - style: estilos extra para el contenedor.
 * - titleStyle: estilos extra para el titulo.
 *
 * Ejemplo:
 * <Navbar
 *     title="Estanques"
 *     leftContent={<Button>Volver</Button>}
 *     rightContent={<Avatar name="Admin" />}
 * />
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Navbar({
  title = "",
  leftContent,
  rightContent,
  children,
  style,
  titleStyle,
}) {
  return (
    <View style={[styles.navbar, style]}>
      <View style={styles.row}>
        <View style={styles.side}>{leftContent}</View>

        <View style={styles.center}>
          {title !== "" && (
            <Text style={[styles.title, titleStyle]} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        <View style={styles.side}>{rightContent}</View>
      </View>

      {children && <View style={styles.childrenContainer}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  side: {
    width: 70,
    minHeight: 32,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212529",
    textAlign: "center",
  },
  childrenContainer: {
    marginTop: 10,
  },
});
