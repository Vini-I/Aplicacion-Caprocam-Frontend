/**
 * ============================================================
 * COMPONENTE AVATAR
 * ============================================================
 *
 * Avatar reutilizable para React Native.
 *
 * Funcionalidad:
 * - Muestra una imagen de perfil si se recibe source.
 * - Si no hay imagen, muestra iniciales.
 * - Permite personalizar tamano, color de fondo y color del texto.
 * - Puede usarse para usuarios, colaboradores, perfiles o responsables.
 *
 * Props principales:
 * - source: imagen local o URL remota.
 * - name: nombre usado para generar iniciales.
 * - size: tamano del avatar.
 * - backgroundColor: color de fondo cuando no hay imagen.
 * - textColor: color de las iniciales.
 * - style: estilos extra para el contenedor.
 * - imageStyle: estilos extra para la imagen.
 * - textStyle: estilos extra para el texto.
 *
 * Ejemplo:
 * <Avatar name="Juan Perez" />
 *
 * Ejemplo con imagen:
 * <Avatar source="https://imagen.com/perfil.png" name="Juan Perez" />
 */

import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { ICONS } from "../../theme/icons";

function getInitials(name) {
  if (!name) {
    return "";
  }

  const words = name.trim().split(" ");
  let initials = "";

  if (words.length >= 1 && words[0] !== "") {
    initials = initials + words[0].charAt(0).toUpperCase();
  }

  if (words.length >= 2 && words[1] !== "") {
    initials = initials + words[1].charAt(0).toUpperCase();
  }

  return initials;
}

export default function Avatar({
  source,
  name = "",
  size = 48,
  backgroundColor = COLORS.primary,
  textColor = COLORS.white,
  style,
  imageStyle,
  textStyle,
}) {
  let imageSource = source;

  if (typeof source === "string") {
    imageSource = { uri: source };
  }

  const avatarStyles = [
    styles.avatar,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: backgroundColor,
    },
  ];

  if (style) {
    avatarStyles.push(style);
  }

  const imageStyles = [
    styles.image,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
  ];

  if (imageStyle) {
    imageStyles.push(imageStyle);
  }

  const initialsStyles = [
    styles.initials,
    {
      color: textColor,
      fontSize: size * 0.38,
    },
  ];

  if (textStyle) {
    initialsStyles.push(textStyle);
  }

  if (source) {
    return <Image source={imageSource} style={imageStyles} />;
  }

  return (
    <View style={avatarStyles}>
      <Text style={initialsStyles}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    backgroundColor: COLORS.surface,
  },
  initials: {
    fontWeight: "700",
  },
});
