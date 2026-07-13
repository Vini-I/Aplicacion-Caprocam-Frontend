/**
 * ============================================================
 * COMPONENTE: FilaTicket
 * ============================================================
 * 
 * Responsabilidad: Renderizar una fila interactiva dentro de la tabla
 * de tickets en el panel principal de mantenimiento.
 * 
 * Datos:
 * - ticket: Datos del ticket de mantenimiento.
 * 
 * Validaciones:
 * - Manejo alternativo seguro si el ticket no contiene tareas asignadas.
 * 
 * Navegación:
 * - Ejecuta callback para abrir la vista de detalles de este ticket.
 * 
 * Dependencias:
 * - Badge, BadgeEstado
 * - mantEquipoStyles, mantEquipoUtils, mantEquipoMensajes, mantEquipoService
 */

import React from "react";
import { Pressable, View, Text } from "react-native";
import Badge from "../../../shared/components/Badge.jsx";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { formatearFechaCorta, etiquetaPorEstado, variantePorEstado } from "../utils/mantEquipoUtils.js";
import { TAREAS_DEMO } from "../constants/mantEquipoMensajes.js";
import * as MantService from "../services/mantEquipoService.js";

function BadgeEstado({ ticket }) {
  const label = etiquetaPorEstado(ticket.estado);
  const variant = variantePorEstado(ticket.estado);

  let textColor = COLORS.textSecondary;
  if (variant === "success") {
    textColor = COLORS.success;
  } else if (variant === "warning") {
    textColor = COLORS.warning;
  } else if (variant === "info") {
    textColor = COLORS.primary;
  }

  return (
    <Badge
      label={label}
      variant={variant}
      textStyle={{ color: textColor, fontWeight: "600", fontSize: 11 }}
      style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start", marginTop: 0 }}
    />
  );
}



export default function FilaTicket({ ticket, onVerDetalle }) {
  return (
    <Pressable style={styles.row} onPress={() => onVerDetalle(ticket)}>
      <View style={styles.colTicket}><Text style={styles.ticketLink}>{ticket.id}</Text></View>
      <View style={styles.colDue}><Text style={styles.cellText}>{formatearFechaCorta(ticket.fechaCreacion)}</Text></View>
      <View style={styles.colStatus}><BadgeEstado ticket={ticket} /></View>
      <View style={styles.colTool}><Text style={styles.cellText}>{ticket.herramienta}</Text></View>
      <View style={styles.colTareas}>
        {ticket.tareas && ticket.tareas.length > 0 ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
            {ticket.tareas.map((t, idx) => {
              const fullTask = TAREAS_DEMO.find((d) => d.value === t.value) || t;
              return (
                <Badge key={idx} label={fullTask.nombre || fullTask.label} variant="info" 
                  style={{ paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, maxWidth: "100%" }} 
                  textStyle={{ fontSize: 10, flexShrink: 1, flexWrap: "wrap" }} />
              );
            })}
          </View>
        ) : (
          <Text style={styles.cellText}>—</Text>
        )}
      </View>
      <View style={styles.colDesc}><Text style={styles.cellText} numberOfLines={2}>{ticket.descripcion}</Text></View>
      <View style={styles.colBy}>
        <Text style={styles.cellText}>{ticket.creadoPor}</Text>
        <Text style={styles.cellTextSub}>{MantService.EMPLEADOS_MOCK[ticket.creadoPor]?.id || "—"}</Text>
      </View>
    </Pressable>
  );
}
