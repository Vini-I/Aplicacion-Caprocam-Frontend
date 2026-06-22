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
import CustomText from "../../../shared/components/Text";
import { styles } from "../styles/colaboradorCardStyles";
import { COLORS } from "../../../theme/colors";

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
          <CustomText style={styles.detailText}>📞 {colaborador.telefono}</CustomText>
          <CustomText style={styles.detailText}>✉️ {colaborador.email}</CustomText>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit?.(colaborador)} style={styles.editBtn}>
            <CustomText style={styles.btnText}>Editar</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete?.(colaborador.id)} style={styles.deleteBtn}>
            <CustomText style={styles.btnText}>Eliminar</CustomText>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}