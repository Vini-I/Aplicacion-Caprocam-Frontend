/**
 * ============================================================
 * COMPONENTE: EquipoDetailTicket
 * ============================================================
 * 
 * Responsabilidad: Mostrar una tarjeta detallada del equipo seleccionado
 * en el formulario de ticket, permitiendo desvincularlo.
 * 
 * Datos:
 * - equipo: Datos del equipo seleccionado.
 * 
 * Validaciones:
 * - Renderizado condicional si no hay equipo seleccionado.
 * 
 * Navegación:
 * - Permite ejecutar callback para desvincular el equipo seleccionado.
 * 
 * Dependencias:
 * - CustomText, Button, Icon
 * - theme/icons, theme/colors, mantEquipoStyles, mantEquipoMensajes
 */

import React from "react";
import { View } from "react-native";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { LABELS_EQUIPO_DETALLE } from "../constants/mantEquipoMensajes.js";

export default function EquipoDetail({ equipo, onQuitar }) {
  if (!equipo) return null;
  return (
    <View style={styles.equipoDetailCard}>
      {LABELS_EQUIPO_DETALLE.map(([campo, etiqueta], idx) => (
        <View key={campo} style={[styles.equipoDetailRow, idx === 0 && { alignItems: "center" }]}>
          <CustomText style={styles.equipoDetailLabel}>{etiqueta}</CustomText>
          <CustomText style={styles.equipoDetailVal} numberOfLines={2}>{equipo[campo] ?? "—"}</CustomText>
          {idx === 0 && (
            <Button onPress={onQuitar} variant="outline"
              style={{ marginTop: 0, width: 28, height: 28, borderRadius: 99, paddingVertical: 0, paddingHorizontal: 0, justifyContent: "center", alignItems: "center", borderColor: COLORS.error }}
            >
              <Icon icon={ICONS.delete} size={13} color={COLORS.error} />
            </Button>
          )}
        </View>
      ))}
    </View>
  );
}
