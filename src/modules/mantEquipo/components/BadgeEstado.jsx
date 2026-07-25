/**
 * ============================================================
 * COMPONENTE: BadgeEstado
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Renderiza una etiqueta visualmente diferenciada por colores suaves para
 *   identificar el estado actual del ticket de mantenimiento.
 * 
 * DATOS / PROPS:
 * - estado: string ("en_espera", "en_mantenimiento", "Terminado")
 * 
 * VALIDACIONES:
 * - Mapea colores suaves y texto descriptivo según el valor recibido.
 * 
 * NAVEGACIÓN:
 * - Ninguna.
 * 
 * DEPENDENCIAS:
 * - CustomText de shared, COLORS de theme.
 * ============================================================
 */

import React from "react";
import { View } from "react-native";
import CustomText from "../../../shared/components/Text.jsx";
import { COLORS } from "../../../theme/colors.js";

export default function BadgeEstado({ estado }) {
  let label = "En espera";
  let bg = COLORS.warningLight;
  let fg = COLORS.warning;

  if (estado === "en_mantenimiento") {
    label = "En mantenimiento";
    bg = COLORS.primaryLight;
    fg = COLORS.primary;
  } else if (estado === "Terminado") {
    label = "Terminado";
    bg = COLORS.successLight;
    fg = COLORS.success;
  }

  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: "flex-start" }}>
      <CustomText style={{ fontSize: 11, fontWeight: "700", color: fg }}>{label}</CustomText>
    </View>
  );
}
