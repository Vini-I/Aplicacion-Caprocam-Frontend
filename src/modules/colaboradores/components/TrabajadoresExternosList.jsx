/**
 * ============================================================
 * COMPONENTE: TrabajadoresExternosList
 * ============================================================
 *
 * Lista simple para mostrar trabajadores externos asociados a un dueño.
 * Cada elemento es un TouchableOpacity que permite seleccionar al trabajador
 * para ver su detalle.
 *
 * Props:
 * - trabajadores: array de objetos colaborador (rol external_worker)
 * - onSelectTrabajador: función que recibe el id del trabajador al hacer clic
 *
 * Ejemplo:
 * <TrabajadoresExternosList
 *   trabajadores={lista}
 *   onSelectTrabajador={(id) => navegarADetalle(id)}
 * />
 */

// ============================================================
// IMPORTS
// ============================================================
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// ============================================================
// COMPONENTE
// ============================================================
export default function TrabajadoresExternosList({ trabajadores, onSelectTrabajador }) {
  if (!trabajadores || trabajadores.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👥 Colaboradores a Cargo</Text>
        <Text style={styles.emptyText}>No hay Colaboradores externos registrados</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Colaboradores a Cargo ({trabajadores.length})</Text>

      {trabajadores.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => onSelectTrabajador?.(item.id)}>
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.nombre}</Text>
            <Text style={styles.itemDetail}>📞 {item.telefono}</Text>
            <Text style={styles.itemDetail}>✉️ {item.email}</Text>
            <Text style={styles.itemDetail}>Cédula: {item.cedula}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1E3A5F", marginBottom: 12 },
  item: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 12,
  },
  itemName: { fontWeight: "bold", color: "#1E3A5F", fontSize: 15, marginBottom: 4 },
  itemDetail: { fontSize: 13, color: "#4E6482", marginBottom: 2 },
  emptyText: { textAlign: "center", color: "#6c757d", paddingVertical: 16 },
});