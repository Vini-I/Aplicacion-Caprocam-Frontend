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
 * - Alineación perfecta de "Horas de uso al ingresar" y "Horas para mantenimiento" sin saltos de línea.
 * 
 * Navegación:
 * - Permite ejecutar callback para desvincular el equipo seleccionado.
 * 
 * DEPENDENCIAS:
 * - CustomText, Button, Icon
 * - theme/icons, theme/colors, mantEquipoStyles, mantEquipoMensajes
 * ============================================================
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
      <View style={styles.equipoDetailHeader}>
        <CustomText style={styles.equipoDetailTitle}>
          {onQuitar ? "Detalles del equipo seleccionado" : "Detalles de la máquina"}
        </CustomText>
        {onQuitar && (
          <Button
            variant="outline"
            onPress={onQuitar}
            style={styles.btnQuitarEquipo}
          >
            <Icon icon={ICONS.delete} size={12} color={COLORS.error} />
            <CustomText style={styles.btnQuitarEquipoText}>
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

      {/* Horas de uso al ingresar o actual */}
      <View style={styles.equipoDetailRowTop}>
        <CustomText style={styles.equipoDetailLabel}>
          {horasUsoIngreso !== undefined ? "Horas de uso al ingresar:" : "Horas de uso actual:"}
        </CustomText>
        <CustomText style={styles.equipoDetailVal}>
          {horasUsoIngreso !== undefined ? horasUsoIngreso : (equipo.horasUso ?? 0)} hrs
        </CustomText>
      </View>

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
