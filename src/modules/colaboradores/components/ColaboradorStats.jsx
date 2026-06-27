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
import { View } from "react-native";
import Card from "../../../shared/components/Card";
import CustomText from "../../../shared/components/Text";
import { styles } from "../styles/colaboradorStatsStyles";

// ============================================================
// COMPONENTE
// ============================================================
export default function ColaboradorStats({ estadisticas }) {
  if (!estadisticas) return null;

  return (
    <Card title="Actividad del colaborador" style={styles.card}>
      <View style={styles.row}>
        <View style={styles.statItem}>
          <CustomText style={styles.statValue}>{estadisticas.alimentaciones}</CustomText>
          <CustomText style={styles.statLabel}>Alimentaciones</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.statValue}>{estadisticas.estanquesCreados}</CustomText>
          <CustomText style={styles.statLabel}>Estanques creados</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.statValue}>{estadisticas.siembrasRegistradas}</CustomText>
          <CustomText style={styles.statLabel}>Siembras registradas</CustomText>
        </View>
      </View>
      {estadisticas.ultimaActividad && (
        <CustomText style={styles.lastActive}>
          Última actividad: {estadisticas.ultimaActividad}
        </CustomText>
      )}
    </Card>
  );
}