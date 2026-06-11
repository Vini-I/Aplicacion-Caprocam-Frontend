/**
 * ============================================================
 * COMPONENTE FOOTER
 * ============================================================
 *
 * Pie de pagina reutilizable para React Native.
 *
 * Funcionalidad:
 * - Muestra informacion inferior de una pantalla.
 * - Puede mostrar texto principal, texto secundario y children.
 * - Permite colocar acciones o contenido personalizado.
 * - Sirve para creditos, versiones, botones finales o informacion legal.
 *
 * Props principales:
 * - text: texto principal.
 * - subText: texto secundario.
 * - children: contenido personalizado.
 * - fixedBottom: aplica estilo para colocarlo al final del contenedor padre.
 * - style: estilos extra para el contenedor.
 * - textStyle: estilos extra para el texto principal.
 * - subTextStyle: estilos extra para el texto secundario.
 *
 * Ejemplo:
 * <Footer text="Caprocam" subText="Version 1.0.0" />
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Footer({
  text = "",
  subText = "",
  children,
  fixedBottom = false,
  style,
  textStyle,
  subTextStyle,
}) {
  const footerStyles = [styles.footer];

  if (fixedBottom === true) {
    footerStyles.push(styles.fixedBottom);
  }

  if (style) {
    footerStyles.push(style);
  }

  return (
    <View style={footerStyles}>
      {text !== "" && <Text style={[styles.text, textStyle]}>{text}</Text>}

      {subText !== "" && (
        <Text style={[styles.subText, subTextStyle]}>{subText}</Text>
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#ffffff",
  },
  fixedBottom: {
    marginTop: "auto",
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212529",
    textAlign: "center",
  },
  subText: {
    marginTop: 4,
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
  },
});
