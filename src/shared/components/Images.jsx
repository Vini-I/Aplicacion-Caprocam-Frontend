/**
 * ============================================================
 * COMPONENTE IMAGES
 * ============================================================
 *
 * Imagen reutilizable para React Native.
 *
 * Funcionalidad:
 * - Permite mostrar imagen local o remota.
 * - Permite definir ancho, alto, borderRadius y resizeMode.
 *
 * Props principales:
 * - source: imagen local o url.
 * - width: ancho.
 * - height: alto.
 * - borderRadius: redondeo.
 * - resizeMode: forma de ajustar la imagen.
 * - style: estilos extra.
 *
 * Ejemplo:
 * <Images source="https://imagen.com/foto.png" width={100} height={100} />
 */

import React from "react";
import { Image, StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors";

export default function Images({
  source,
  width = 100,
  height = 100,
  borderRadius = 8,
  resizeMode = "cover",
  style,
}) {
  let imageSource = source;

  if (typeof source === "string") {
    imageSource = { uri: source };
  }

  return (
    <Image
      source={imageSource}
      style={[
        styles.image,
        {
          width: width,
          height: height,
          borderRadius: borderRadius,
        },
        style,
      ]}
      resizeMode={resizeMode}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: COLORS.surface,
  },
});
