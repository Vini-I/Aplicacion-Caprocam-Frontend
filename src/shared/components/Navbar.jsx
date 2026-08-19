/**
 * ============================================================
 * COMPONENTE NAVBAR
 * ============================================================
 *
 * Responsabilidad:
 * - Header global celeste para pantallas del proyecto.
 * - Muestra nombre de pantalla y ruta contextual.
 * - Permite contenido izquierdo, derecho y children.
 * - Evita headers blancos o headers locales innecesarios.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";

export default function Navbar({
  title = "Caprocam",
  breadcrumb = "caprocam",
  subtitle = "",
  leftContent,
  rightContent,
  children,
  style,
  titleStyle,
  breadcrumbStyle,
}) {
  let secondaryText = breadcrumb;

  if (subtitle !== "") {
    secondaryText = subtitle;
  }

  return (
    <View style={[styles.navbar, style]}>
      <View style={styles.row}>
        <View style={styles.side}>{leftContent}</View>

        <View style={styles.center}>
          <Text style={[styles.brand, titleStyle]} numberOfLines={1}>
            {title}
          </Text>

          {secondaryText !== "" && (
            <Text
              style={[styles.breadcrumb, breadcrumbStyle]}
              numberOfLines={1}
            >
              {secondaryText}
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
    paddingTop: 18,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryDark,
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

  brand: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.white,
    textAlign: "center",
  },

  breadcrumb: {
    marginTop: 3,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: "center",
  },

  childrenContainer: {
    marginTop: 10,
  },
});
