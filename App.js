import React, { useState } from "react";
import { View } from "react-native";
import FisicoQuimica from "./src/modules/mantAgua/screens/fisicoQuimica";

/**
 * App.js temporal para probar FisicoQuimica con expo start.
 *
 * Cuando integres navegación real (React Navigation o Expo Router),
 * reemplaza este archivo y pasa `onBack` con navigation.goBack().
 */
export default function App() {
  const [pantalla, setPantalla] = useState("fisicoQuimica");

  return (
    <View style={{ flex: 1 }}>
      {pantalla === "fisicoQuimica" && (
        <FisicoQuimica onBack={() => console.log("← volver a módulos")} />
      )}
    </View>
  );
}
