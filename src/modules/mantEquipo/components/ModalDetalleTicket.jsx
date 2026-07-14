/**
 * ============================================================
 * COMPONENTE: ModalDetalleTicket
 * ============================================================
 * 
 * Responsabilidad: Modal que presenta los datos completos de un ticket
 * de mantenimiento, con opciones para modificarlo o cancelarlo.
 * 
 * Datos:
 * - ticket: El ticket seleccionado (o null para ocultarse).
 * 
 * Validaciones:
 * - Renderizado condicional seguro si no hay ticket seleccionado.
 * 
 * Navegación:
 * - Cierra el modal y opcionalmente abre el flujo de edición del ticket.
 * 
 * Dependencias:
 * - Modal.jsx, CustomText, Button, Icon, BadgeEstado
 * - mantEquipoUtils, mantEquipoMensajes, colors, icons
 */

import React from "react";
import { View, Text, ScrollView } from "react-native";
import Modal from "../../../shared/components/Modal.jsx";
import Button from "../../../shared/components/Button.jsx";
import Badge from "../../../shared/components/Badge.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { TEXTOS_MODAL_DETALLE } from "../constants/mantEquipoMensajes.js";
import { etiquetaPorEstado, variantePorEstado, formatearFechaCorta } from "../utils/mantEquipoUtils.js";

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



export default function ModalDetalleTicket({ ticket, onClose, onModificar, onEliminar }) {
  if (!ticket) return null;

  const T = TEXTOS_MODAL_DETALLE;

  const campos = [
    [T.campoTicketId, ticket.id],
    [T.campoTitulo, ticket.titulo || "—"],
    [T.campoEquipo, ticket.herramienta],
    [T.campoEstado, etiquetaPorEstado(ticket.estado)],
    [T.campoDesc, ticket.descripcion],
    [T.campoCreadoPor, ticket.creadoPor],
    [T.campoFechaC, formatearFechaCorta(ticket.fechaCreacion)],
  ];

  return (
    <Modal visible onClose={onClose} showCloseButton={false} containerStyle={styles.modalContainer}>
      <View style={styles.detalleEncabezado}>
        <Text style={styles.modalTitle}>{T.titulo}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <BadgeEstado ticket={ticket} />
          <Button
            variant="outline"
            onPress={onClose}
            style={{ width: 32, height: 32, borderRadius: 99, alignItems: "center", justifyContent: "center", marginTop: 0, paddingVertical: 0, paddingHorizontal: 0, borderColor: COLORS.primary }}
          >
            <Icon icon={ICONS.exit} size={16} color={COLORS.primary} />
          </Button>
        </View>
      </View>

      <ScrollView style={styles.modalScroll} nestedScrollEnabled>
        {campos.map(([label, valor]) => (
          <View key={label} style={styles.detalleRow}>
            <Text style={styles.equipoDetailLabel}>{label}</Text>
            <Text style={[styles.equipoDetailVal, { flex: 2 }]}>{valor ?? "—"}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.modalFooter}>
        <Button
          variant="outline"
          onPress={() => { onClose(); onModificar(ticket); }}
          style={styles.btnCancel}
        >
          <Icon icon={ICONS.edit} size={15} color={COLORS.primary} />
          <Text style={styles.btnTextPrimary14}>Editar</Text>
        </Button>
        <Button
          variant="outline"
          onPress={() => { onEliminar(ticket.id); onClose(); }}
          style={styles.btnDelete}
        >
          <Icon icon={ICONS.delete} size={15} color={COLORS.error} />
          <Text style={styles.btnTextError14}>Eliminar</Text>
        </Button>
      </View>
    </Modal>
  );
}
