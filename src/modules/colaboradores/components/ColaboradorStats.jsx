/**
 * ============================================================
 * COMPONENTE: ColaboradorStats
 * ============================================================
 *
 * Muestra estadísticas de actividad de un colaborador
 * (alimentaciones, estanques creados, siembras registradas,
 * y última actividad). Diseñado para ser usado dentro de
 * tarjetas o pantallas de detalle.
 *
 * Props:
 * - estadisticas: objeto con campos alimentaciones, estanquesCreados,
 *   siembrasRegistradas, ultimaActividad
 *
 * Ejemplo:
 * <ColaboradorStats estadisticas={data.estadisticas} />
 */

// ============================================================
// IMPORTS
// ============================================================
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "../../../shared/components/Card";

// ============================================================
// COMPONENTE
// ============================================================
export default function ColaboradorStats({ estadisticas }) {
  if (!estadisticas) return null;

  return (
    <Card title="Actividad del colaborador" style={styles.card}>
      <View style={styles.row}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{estadisticas.alimentaciones}</Text>
          <Text style={styles.statLabel}>Alimentaciones</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{estadisticas.estanquesCreados}</Text>
          <Text style={styles.statLabel}>Estanques creados</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{estadisticas.siembrasRegistradas}</Text>
          <Text style={styles.statLabel}>Siembras registradas</Text>
        </View>
      </View>
      {estadisticas.ultimaActividad && (
        <Text style={styles.lastActive}>
          Última actividad: {estadisticas.ultimaActividad}
        </Text>
      )}
    </Card>
  );
}

// ============================================================
// ESTILOS
// ============================================================
const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#009EF5",
  },
  statLabel: {
    fontSize: 12,
    color: "#4E6482",
    marginTop: 4,
  },
  lastActive: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 8,
  },
});