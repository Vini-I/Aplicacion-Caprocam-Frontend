/**
 * ============================================================
 * COMPONENTE: EquipoDetailTicket
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado que reutiliza elementos de shared/components.
 * - Mostrar una tarjeta detallada del equipo seleccionado en el formulario de ticket, permitiendo desvincularlo.
 *
 * @dependencies - Text.jsx, Button.jsx, Icons.jsx (shared/components), mantEquipoStyles.js (styles), mantEquipoMensajes.js (constants)
 * @validations  - Renderizado condicional si existe equipo seleccionado.
 * @navigation   - Recibe callback onQuitar para desvincular el equipo.
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
