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
 * - Toda la fila es presionable (Pressable) y también expone el botón "Ver detalles".
 * - Ejecuta el callback onVerDetalle al presionar la fila o el botón.
 *
 * Dependencias:
 * - Badge, BadgeEstado, Button
 * - mantEquipoStyles, mantEquipoUtils, tareasService, mantEquipoService
 */

import React from "react";
import { Pressable, View, Text } from "react-native";
import Button from "../../../shared/components/Button.jsx";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { formatearFechaCorta, etiquetaPorEstado, variantePorEstado } from "../utils/mantEquipoUtils.js";
import * as MantService from "../services/mantEquipoService.js";
import BadgeEstado from "./BadgeEstado.jsx";

export default function FilaTicket({ ticket, onVerDetalle }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: COLORS.surface }]}
      onPress={() => onVerDetalle(ticket)}
    >
      {/* Ticket ID */}
      <View style={styles.colTicket}>
        <Text style={styles.ticketLink}>{ticket.id}</Text>
      </View>

      {/* Fecha creación */}
      <View style={styles.colDue}>
        <Text style={styles.cellText}>{formatearFechaCorta(ticket.fechaCreacion)}</Text>
      </View>

      {/* Estado */}
      <View style={styles.colStatus}>
        <BadgeEstado estado={ticket.estado} />
      </View>

      {/* Título */}
      <View style={styles.colTitle}>
        <Text style={styles.cellText} numberOfLines={1}>{ticket.titulo}</Text>
      </View>

      {/* Descripción */}
      <View style={styles.colDesc}>
        <Text style={styles.cellText} numberOfLines={2}>{ticket.descripcion}</Text>
      </View>

      {/* Creado por */}
      <View style={styles.colBy}>
        <Text style={styles.cellText}>{ticket.creadoPor}</Text>
        <Text style={styles.cellTextSub}>{MantService.EMPLEADOS_MOCK[ticket.creadoPor]?.id || "—"}</Text>
      </View>

      {/* Acciones */}
      <View style={styles.colActions}>
        <Button
          variant="outline"
          onPress={() => onVerDetalle(ticket)}
          style={styles.btnActionOutline}
          textStyle={styles.btnActionOutlineText}
        >
          Ver detalles
        </Button>
      </View>
    </Pressable>
  );
}
