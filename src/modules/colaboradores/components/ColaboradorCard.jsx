// src/modules/colaboradores/components/ColaboradorCard.jsx

import React from "react";
import { View } from "react-native";
import CardPress from "../../../shared/components/CardPress";
import Badge from "../../../shared/components/Badge";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import { styles } from "../styles/colaboradorCardStyles";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

export default function ColaboradorCard({ colaborador, onPress, onEdit, onDelete }) {
  const rolLabels = {
    camprocam_worker: "Trabajador Camprocam",
    external_owner: "Dueño Externo",
    external_worker: "Trabajador Externo",
  };

  const rolVariant = {
    camprocam_worker: "info",
    external_owner: "warning",
    external_worker: "success",
  };

  return (
    <CardPress onPress={() => onPress?.(colaborador.id)} style={styles.card}>
      <View style={styles.header}>
        <CustomText style={styles.nombre}>{colaborador.nombre}</CustomText>
        <Badge
          label={rolLabels[colaborador.rol] || colaborador.rol}
          variant={rolVariant[colaborador.rol] || "info"}
        />
      </View>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Icon icon={ICONS.phone} size={14} color={COLORS.textTertiary} style={{ marginRight: 6 }} />
          <CustomText style={styles.detailText}>{colaborador.telefono}</CustomText>
        </View>
        <View style={styles.detailRow}>
          <Icon icon={ICONS.user} size={14} color={COLORS.textTertiary} style={{ marginRight: 6 }} />
          <CustomText style={styles.detailText}>{colaborador.email}</CustomText>
        </View>
      </View>
    </CardPress>
  );
}