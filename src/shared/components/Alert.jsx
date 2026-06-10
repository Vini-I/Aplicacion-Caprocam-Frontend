import React from "react";
import { View, Text } from "react-native";

// Componente Alert reutilizable
export default function Alert({
  alertWidth,      // Ancho de la alerta
  alertHeight,     // Alto de la alerta
  alertColor,      // Color de fondo de la alerta
  borderColor,     // Color del borde
  borderWidth,     // Grosor del borde
  borderRadius,    // Curvatura de las esquinas
  alertMessage,    // Mensaje que se mostrará en la alerta
  textColor,       // Color del texto
  textSize,        // Tamaño del texto
  textFontFamily,  // Tipo de fuente
  textFontWeight,  // Grosor del texto (normal, bold, etc.)
}) {
  return (
    <View
      style={{
        // Tamaño de la alerta
        width: alertWidth,
        height: alertHeight,

        // Apariencia de la alerta
        backgroundColor: alertColor,
        borderColor: borderColor,
        borderWidth: borderWidth,
        borderRadius: borderRadius,

        // Centra el contenido horizontal y verticalmente
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          // Estilos del texto
          color: textColor,
          fontSize: textSize,
          fontFamily: textFontFamily,
          fontWeight: textFontWeight,
        }}
      >
        {/* Muestra el mensaje recibido por parámetro */}
        {alertMessage}
      </Text>
    </View>
  );
}