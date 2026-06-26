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
import { View, TouchableOpacity } from "react-native";
import CustomText from "../../../shared/components/Text";
import { styles } from "../styles/trabajadoresExternosListStyles";

// ============================================================
// COMPONENTE
// ============================================================
export default function TrabajadoresExternosList({ trabajadores, onSelectTrabajador }) {
  if (!trabajadores || trabajadores.length === 0) {
    return (
      <View style={styles.card}>
        <CustomText style={styles.cardTitle}>👥 Colaboradores a Cargo</CustomText>
        <CustomText style={styles.emptyText}>No hay Colaboradores externos registrados</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <CustomText style={styles.cardTitle}>Colaboradores a Cargo ({trabajadores.length})</CustomText>

      {trabajadores.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => onSelectTrabajador?.(item.id)}>
          <View style={styles.item}>
            <CustomText style={styles.itemName}>{item.nombre}</CustomText>
            <CustomText style={styles.itemDetail}>📞 {item.telefono}</CustomText>
            <CustomText style={styles.itemDetail}>✉️ {item.email}</CustomText>
            <CustomText style={styles.itemDetail}>Cédula: {item.cedula}</CustomText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}