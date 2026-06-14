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
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";

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
          <Text style={styles.nombre}>{colaborador.nombre}</Text>
          <Badge
            label={rolLabels[colaborador.rol] || colaborador.rol}
            variant={rolVariant[colaborador.rol] || "info"}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>📞 {colaborador.telefono}</Text>
          <Text style={styles.detailText}>✉️ {colaborador.email}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit?.(colaborador)} style={styles.editBtn}>
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete?.(colaborador.id)} style={styles.deleteBtn}>
            <Text style={styles.btnText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

// ============================================================
// ESTILOS
// ============================================================
const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A5F",
  },
  details: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    color: "#4E6482",
    marginBottom: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  editBtn: {
    backgroundColor: "#009EF5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: "#DC3545",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 12,
  },
});