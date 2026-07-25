/**
 * ============================================================
 * COMPONENTE: EquipoStats
 * ============================================================
 *
 * Muestra estadísticas de actividad de un equipo
 * (horas de uso, mantenimiento, estado operativo y encendido).
 *
 * Nota: el backend no registra un historial de encendidos
 * (no existe "registrosEncendido"), por lo que este componente
 * ya no cuenta eventos individuales, solo el estado actual.
 *
 * Props:
 * - equipo: objeto con los datos del equipo
 * - estadisticas: objeto con campos adicionales de estadísticas
 *
 * Ejemplo:
 * <EquipoStats equipo={equipo} />
 */

// ============================================================
// IMPORTS
// ============================================================
import React from "react";
import { View } from "react-native";
import Card from "../../../shared/components/Card";
import CustomText from "../../../shared/components/Text";
import { styles } from "../styles/equiposListStyles";
import { COLORS } from "../../../theme/colors";

const ESTADO_OPERATIVO_LABELS = {
  activo: "Activo",
  inactivo: "Inactivo",
  mantenimiento: "Mantenimiento",
};

// ============================================================
// COMPONENTE
// ============================================================
export default function EquipoStats({ equipo, estadisticas }) {
  if (!equipo) return null;

  const horasUsoFormateado = equipo.horasUso < 1
    ? `${Math.round(equipo.horasUso * 60)} min`
    : `${Math.round(equipo.horasUso)} h`;

  const horasRestantes = Math.max(0, Math.round(equipo.horasMantenimiento - equipo.horasUso));
  const necesitaMant = horasRestantes === 0;

  const estadoOperativoLabel = ESTADO_OPERATIVO_LABELS[equipo.estado] || equipo.estado;

  return (
    <Card title="Estadísticas del equipo" style={styles.statsCard}>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <CustomText style={styles.statValue}>{horasUsoFormateado}</CustomText>
          <CustomText style={styles.statLabel}>Horas de uso</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={[styles.statValue, necesitaMant && styles.statValueCritico]}>
            {necesitaMant ? "⚠️" : `${horasRestantes} h`}
          </CustomText>
          <CustomText style={styles.statLabel}>
            {necesitaMant ? "Mantenimiento requerido" : "Horas restantes"}
          </CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.statValue}>{estadoOperativoLabel}</CustomText>
          <CustomText style={styles.statLabel}>Estado operativo</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={[styles.statValue, equipo.encendido && styles.statValueEncendido]}>
            {equipo.encendido ? "🔴" : "⚪"}
          </CustomText>
          <CustomText style={styles.statLabel}>
            {equipo.encendido ? "Encendido" : "Apagado"}
          </CustomText>
        </View>
      </View>

      {estadisticas && (
        <View style={styles.statsExtra}>
          {estadisticas.ultimoMantenimiento && (
            <CustomText style={styles.statsExtraText}>
              Último mantenimiento: {estadisticas.ultimoMantenimiento}
            </CustomText>
          )}
          {estadisticas.proximoMantenimiento && (
            <CustomText style={styles.statsExtraText}>
              Próximo mantenimiento: {estadisticas.proximoMantenimiento}
            </CustomText>
          )}
        </View>
      )}
    </Card>
  );
}