/**
 * ============================================================
 * COMPONENTE: TablaTicket
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado que reutiliza elementos de shared/components.
 * - Renderizar cada ticket como un CardPress interactivo en la tabla principal.
 *
 * @dependencies - CardPress.jsx (shared/components), BadgeEstado.jsx (components), mantEquipoUtils.js (utils), mantEquipoStyles.js (styles)
 * @validations  - Truncamiento estricto a 1 línea (numberOfLines={1}, ellipsizeMode="tail").
 * @navigation   - Presionar el card ejecuta el callback onVerDetalle(ticket).
 */

import React from "react";
import { View, Text } from "react-native";
import CardPress from "../../../shared/components/CardPress.jsx";
import { styles } from "../styles/mantEquipoStyles.js";
import { formatearFechaCorta } from "../utils/mantEquipoUtils.js";
import BadgeEstado from "./BadgeEstado.jsx";

export default function FilaTicket({ ticket, onVerDetalle, isMobile = false }) {
  const styleTitle = isMobile ? styles.colTitleMobile : styles.colTitle;
  const styleDesc  = isMobile ? styles.colDescMobile  : styles.colDesc;

  return (
    <CardPress
      style={styles.rowCard}
      onPress={() => onVerDetalle(ticket)}
    >
      <View style={styles.rowInner}>
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
        </View>
      </View>
    </CardPress>
  );
}
