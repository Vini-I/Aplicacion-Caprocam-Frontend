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
 * - isMobile: si es true, usa anchos fijos (colTitleMobile/colDescMobile)
 *   en vez de columnas flex, para que coincida con el encabezado dentro
 *   del scroll horizontal de teléfono.
 *
 * Validaciones:
 * - Truncamiento estricto a 1 línea (numberOfLines={1}, ellipsizeMode="tail")
 *   para garantizar que los textos largos no invadan celdas contiguas.
 *
 * Navegación:
 * - Toda la fila es presionable (Pressable) y también expone el botón "Ver detalles".
 * - Ejecuta el callback onVerDetalle al presionar la fila o el botón.
 *
 * DEPENDENCIAS:
 * - BadgeEstado, Button
 * - styles de mantEquipoStyles
 * ============================================================
 */

import React from "react";
import { Pressable, View, Text } from "react-native";
import Button from "../../../shared/components/Button.jsx";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { formatearFechaCorta } from "../utils/mantEquipoUtils.js";
import * as MantService from "../services/mantEquipoService.js";
import BadgeEstado from "./BadgeEstado.jsx";

export default function FilaTicket({ ticket, onVerDetalle, isMobile = false }) {
  const styleTitle = isMobile ? styles.colTitleMobile : styles.colTitle;
  const styleDesc  = isMobile ? styles.colDescMobile  : styles.colDesc;

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: COLORS.surface }]}
      onPress={() => onVerDetalle(ticket)}
    >
      {/* Ticket ID */}
      <View style={styles.colTicket}>
        <Text style={styles.ticketLink} numberOfLines={1} ellipsizeMode="tail">{ticket.id}</Text>
      </View>

      {/* Fecha creación */}
      <View style={styles.colDue}>
        <Text style={styles.cellText} numberOfLines={1} ellipsizeMode="tail">{formatearFechaCorta(ticket.fechaCreacion)}</Text>
      </View>

      {/* Estado */}
      <View style={styles.colStatus}>
        <BadgeEstado estado={ticket.estado} />
      </View>

      {/* Título */}
      <View style={styleTitle}>
        <Text style={styles.cellText} numberOfLines={1} ellipsizeMode="tail">{ticket.titulo}</Text>
      </View>

      {/* Descripción */}
      <View style={styleDesc}>
        <Text style={styles.cellText} numberOfLines={1} ellipsizeMode="tail">{ticket.descripcion}</Text>
      </View>

      {/* Creado por */}
      <View style={styles.colBy}>
        <Text style={styles.cellText} numberOfLines={1} ellipsizeMode="tail">{ticket.creadoPor}</Text>
        <Text style={styles.cellTextSub} numberOfLines={1} ellipsizeMode="tail">{MantService.EMPLEADOS_MOCK[ticket.creadoPor]?.id || "—"}</Text>
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