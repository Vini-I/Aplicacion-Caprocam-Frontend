/**
 * ============================================================
 * COMPONENTE: ColaboradorCard
 * ============================================================
 *
 * Tarjeta que muestra información resumida de un colaborador.
 * Permite navegar al detalle (onPress), editar (onEdit) y eliminar (onDelete).
 *
 * Props:
 * - colaborador: objeto con los datos del colaborador
 * - onPress: función que recibe el id al hacer clic en la tarjeta
 * - onEdit: función que recibe el objeto completo al presionar "Editar"
 * - onDelete: función que recibe el id al presionar "Eliminar"
 *
 * Ejemplo:
 * <ColaboradorCard
 *   colaborador={colab}
 *   onPress={(id) => verDetalle(id)}
 *   onEdit={(colab) => abrirFormulario(colab)}
 *   onDelete={(id) => confirmarEliminacion(id)}
 * />
 */

// ============================================================
// IMPORTS
// ============================================================
import React from "react";
import { View, TouchableOpacity } from "react-native";
import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import { styles } from "../styles/colaboradorCardStyles";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

// ============================================================
// COMPONENTE
// ============================================================
export default function ColaboradorCard({ colaborador, onPress, onEdit, onDelete }) {
  // --------------------------------------------------------
  // CONSTANTES DE VISUALIZACIÓN
  // --------------------------------------------------------
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

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------
  return (
    <TouchableOpacity onPress={() => onPress?.(colaborador.id)} activeOpacity={0.7}>
      <Card style={styles.card}>
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
        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={() => onEdit?.(colaborador)}
            style={[styles.actionBtn, { borderColor: COLORS.primary }]}
            textStyle={{ color: COLORS.primary }}
          >
            <Icon icon={ICONS.edit} size={16} color={COLORS.primary} />
            <CustomText style={{ color: COLORS.primary, marginLeft: 4, fontSize: 12 }}>Editar</CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={() => onDelete?.(colaborador.id)}
            style={[styles.actionBtn, { borderColor: COLORS.error }]}
            textStyle={{ color: COLORS.error }}
          >
            <Icon icon={ICONS.delete} size={16} color={COLORS.error} />
            <CustomText style={{ color: COLORS.error, marginLeft: 4, fontSize: 12 }}>Eliminar</CustomText>
          </Button>
        </View>
      </Card>
    </TouchableOpacity>
  );
}