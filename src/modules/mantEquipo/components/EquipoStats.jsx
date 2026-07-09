/**
 * ============================================================
 * COMPONENTE: EquipoStats
 * ============================================================
 *
 * Muestra estadísticas de actividad de un equipo
 * (horas de uso, mantenimiento, registros de encendido, etc.).
 * Diseñado para ser usado dentro de tarjetas o pantallas de detalle.
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

  // Contar registros de encendido
  const totalEncendidos = equipo.registrosEncendido?.length || 0;
  const encendidosActivos = equipo.registrosEncendido?.filter(r => !r.fin).length || 0;

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
          <CustomText style={styles.statValue}>{totalEncendidos}</CustomText>
          <CustomText style={styles.statLabel}>Registros de uso</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={[styles.statValue, encendidosActivos > 0 && styles.statValueEncendido]}>
            {encendidosActivos > 0 ? "🔴" : "⚪"}
          </CustomText>
          <CustomText style={styles.statLabel}>
            {encendidosActivos > 0 ? "En uso" : "Apagado"}
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