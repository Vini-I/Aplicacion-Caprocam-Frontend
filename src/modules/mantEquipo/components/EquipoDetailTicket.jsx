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

export default function EquipoDetail({ equipo, onQuitar, horasUsoIngreso }) {
  if (!equipo) return null;
  return (
    <View style={styles.equipoDetailCard}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <CustomText style={{ fontSize: 13, fontWeight: "700", color: COLORS.textSecondary }}>
          {onQuitar ? "Detalles del equipo seleccionado" : "Detalles de la máquina"}
        </CustomText>
        {onQuitar && (
          <Button
            variant="outline"
            onPress={onQuitar}
            style={{
              borderColor: COLORS.error,
              width: 90,
              height: 32,
              paddingVertical: 0,
              paddingHorizontal: 10,
              marginTop: 0,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 4
            }}
          >
            <Icon icon={ICONS.delete} size={12} color={COLORS.error} />
            <CustomText style={{ color: COLORS.error, fontSize: 11, fontWeight: "600" }}>
              Eliminar
            </CustomText>
          </Button>
        )}
      </View>

      {LABELS_EQUIPO_DETALLE.filter(([campo]) => campo !== "horasUso" && campo !== "horasMantenimiento").map(([campo, etiqueta]) => (
        <View key={campo} style={styles.equipoDetailRow}>
          <CustomText style={styles.equipoDetailLabel}>{etiqueta}:</CustomText>
          <CustomText style={styles.equipoDetailVal} numberOfLines={2}>{equipo[campo] ?? "—"}</CustomText>
        </View>
      ))}

      {/* Si se pasa horasUsoIngreso o si mostramos el valor por defecto */}
      {horasUsoIngreso !== undefined ? (
        <View style={[styles.equipoDetailRow, { borderTopWidth: 1, borderTopColor: COLORS.secondary, paddingTop: 6, marginTop: 4 }]}>
          <CustomText style={[styles.equipoDetailLabel, { width: 145 }]}>Horas de uso al ingresar:</CustomText>
          <CustomText style={styles.equipoDetailVal}>{horasUsoIngreso} hrs</CustomText>
        </View>
      ) : (
        <View style={styles.equipoDetailRow}>
          <CustomText style={styles.equipoDetailLabel}>Horas de uso actual:</CustomText>
          <CustomText style={styles.equipoDetailVal}>{equipo.horasUso ?? 0} hrs</CustomText>
        </View>
      )}

      {/* Horas para mantenimiento del equipo (restantes) */}
      <View style={styles.equipoDetailRow}>
        <CustomText style={styles.equipoDetailLabel}>Horas para mantenimiento:</CustomText>
        <CustomText style={styles.equipoDetailVal}>
          {Math.max(0, Math.round((equipo.horasMantenimiento ?? 500) - (equipo.horasUso ?? 0)))} hrs
        </CustomText>
      </View>
    </View>
  );
}
