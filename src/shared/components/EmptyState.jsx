/**
 * ============================================================
 * COMPONENTE EMPTYSTATE
 * ============================================================
 *
 * Estado vacio reutilizable para React Native.
 *
 * Funcionalidad:
 * - Muestra un mensaje cuando no hay datos.
 * - Puede mostrar titulo, descripcion, imagen y accion.
 * - Recibe children para colocar contenido personalizado.
 * - Sirve para listas vacias, errores suaves o pantallas sin registros.
 *
 * Props principales:
 * - title: titulo principal.
 * - description: texto descriptivo.
 * - image: imagen local o URL remota.
 * - action: elemento opcional, normalmente un Button.
 * - children: contenido personalizado adicional.
 * - style: estilos extra para el contenedor.
 * - titleStyle: estilos extra para el titulo.
 * - descriptionStyle: estilos extra para la descripcion.
 *
 * Ejemplo:
 * <EmptyState
 *     title="No hay estanques"
 *     description="Agrega un nuevo estanque para empezar"
 *     action={<Button>Agregar</Button>}
 * />
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export default function EmptyState({
  title = "Sin informacion",
  description = "",
  image,
  action,
  children,
  style,
  titleStyle,
  descriptionStyle,
  imageStyle,
}) {
  let imageSource = image;

  if (typeof image === "string") {
    imageSource = { uri: image };
  }

  return (
    <View style={[styles.container, style]}>
      {image && (
        <Image
          source={imageSource}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
        />
      )}

      <Text style={[styles.title, titleStyle]}>{title}</Text>

      {description !== "" && (
        <Text style={[styles.description, descriptionStyle]}>
          {description}
        </Text>
      )}

      {children}

      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  actionContainer: {
    marginTop: 16,
    width: "100%",
  },
});
