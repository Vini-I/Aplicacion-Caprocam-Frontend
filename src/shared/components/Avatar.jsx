import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFonts, Roboto_500Medium } from "@expo-google-fonts/roboto";

// ─── Design System ─────────────────────────────────────────────────
const DS = {
  colorPrimary: "#009EF5",
  colorBg:      "#F8FAFC",
  colorBorder:  "#E2E8F0",
};

/**
 * Avatar — Componente reutilizable
 *
 * Prioridad de contenido: source (imagen) → icon → iniciales de name
 * Si la imagen falla al cargar, cae automáticamente al siguiente nivel.
 *
 * @param {string}    source       URI de imagen (http, https, require)
 * @param {string}    name         Nombre completo → genera iniciales y color de fallback
 * @param {ReactNode} icon         Componente ícono sólido (prioridad sobre iniciales)
 * @param {number}    size         Tamaño en px (default: 48)
 * @param {string}    bgColor      Color de fondo (default: #F8FAFC)
 * @param {string}    fgColor      Color texto/ícono (default: #009EF5)
 * @param {string}    borderColor  Color del borde (default: "transparent")
 * @param {number}    borderWidth  Grosor del borde (default: 0)
 * @param {boolean}   rounded      true = círculo | false = cuadrado redondeado (default: true)
 * @param {function}  onPress      Callback al presionar (opcional)
 * @param {object}    style        Estilos extra al contenedor (opcional)
 *
 * Ejemplos:
 *   <Avatar source="https://..." name="Carlos Mendoza" size={48} />
 *   <Avatar icon={<Ionicons name="person" size={22} color="#009EF5" />} size={48} />
 *   <Avatar name="Carlos Mendoza" size={48} />
 */

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({
  source,
  name = "",
  icon = null,
  size = 48,
  bgColor = DS.colorBg,
  fgColor = DS.colorPrimary,
  borderColor = "transparent",
  borderWidth = 0,
  rounded = true,
  onPress,
  style,
}) {
  const [fontsLoaded] = useFonts({ Roboto_500Medium });
  const [imgError, setImgError]   = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  const borderRadius = rounded ? size / 2 : size * 0.2;
  const fontSize     = size * 0.36;
  const showImage    = !!source && !imgError;

  const containerStyle = [
    styles.base,
    {
      width: size,
      height: size,
      borderRadius,
      backgroundColor: bgColor,
      borderColor,
      borderWidth,
    },
    style,
  ];

  // ── Contenido: imagen → ícono → iniciales ──────────────────────
  let content;

  if (showImage) {
    content = (
      <>
        {imgLoading && (
          <ActivityIndicator
            style={StyleSheet.absoluteFill}
            size="small"
            color={fgColor}
          />
        )}
        <Image
          source={typeof source === "string" ? { uri: source } : source}
          style={[
            styles.image,
            { borderRadius, opacity: imgLoading ? 0 : 1 },
          ]}
          resizeMode="cover"
          onLoad={() => setImgLoading(false)}
          onError={() => { setImgError(true); setImgLoading(false); }}
        />
      </>
    );
  } else if (icon) {
    content = icon;
  } else {
    content = (
      <Text
        style={[
          styles.initials,
          {
            fontSize,
            color: fgColor,
            fontFamily: fontsLoaded ? "Roboto_500Medium" : undefined,
            fontWeight: fontsLoaded ? undefined : "600",
          },
        ]}
        numberOfLines={1}
        allowFontScaling={false}
      >
        {getInitials(name)}
      </Text>
    );
  }

  // ── Wrapper: presionable o estático ───────────────────────────
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={containerStyle}
        accessibilityRole="button"
        accessibilityLabel={name ? `Avatar de ${name}` : "Avatar"}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={containerStyle}
      accessibilityLabel={name ? `Avatar de ${name}` : "Avatar"}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initials: {
    includeFontPadding: false,
    textAlignVertical: "center",
    letterSpacing: 0.5,
  },
});
