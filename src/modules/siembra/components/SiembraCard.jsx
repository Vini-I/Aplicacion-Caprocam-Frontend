/**
 * Componente: SiembraCard
 *
 * Tarjeta de resumen para mostrar una siembra activa.
 *
 * Funcionalidades principales:
 * - Mostrar estanque, finca, número de siembra y cantidad sembrada.
 * - Mostrar el avance del ciclo mediante días de cultivo y duración estimada.
 * - Indicar el estado actual de la siembra mediante un badge.
 * - Permitir acceder al detalle o edición de la siembra.
 *
 * Componentes utilizados:
 * - Card: contenedor visual de la información.
 * - Badge: etiqueta para el estado de la siembra.
 * - Button: acción para ver detalles o editar.
 */
import { View, Text, StyleSheet } from "react-native";

import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import Icon from "../../../shared/components/Icons";
import { ICONS } from "../../../theme/icons";

export default function SiembraCard({
  siembraId,
  estanque,
  finca,
  diasCultivo,
  diasMaduracion,
  cantidadSembrada,
  estado = "Activa",
  onPress,
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.diasText}>
          Día {diasCultivo} de {diasMaduracion}
        </Text>

        <Badge
          label={estado}
          variant="success"
          style={styles.estadoBadge}
          textStyle={styles.estadoText}
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.estanqueText}>{estanque}</Text>

        <Text style={styles.fincaText}>{finca}</Text>

        <Text style={styles.siembraText}>Siembra #{siembraId}</Text>

        <Text style={styles.cantidadText}>
          {(cantidadSembrada ?? 0).toLocaleString()} camarones
        </Text>
      </View>

      <Button onPress={onPress} style={styles.actionButton}>
        <View style={styles.actionButtonContent}>
          <Icon icon={ICONS.edit} size={16} color={COLORS.white} />

          <Text style={styles.actionButtonText}>Ver detalles / editar</Text>
        </View>
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  diasText: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  body: {
    marginBottom: 16,
  },

  estanqueText: {
    color: COLORS.textSecondary,
    fontSize: 30,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  estadoBadge: {
    backgroundColor: COLORS.success,
  },

  estadoText: {
    color: COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  fincaText: {
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginBottom: 10,
  },

  siembraText: {
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginBottom: 6,
  },

  cantidadText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },

  actionButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
});
