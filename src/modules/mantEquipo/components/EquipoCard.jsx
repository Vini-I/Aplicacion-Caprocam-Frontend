/**
 * ============================================================
 * COMPONENTE: EquipoCard
 * ============================================================
 *
 * Tarjeta que muestra información resumida de un equipo.
 * Permite navegar al detalle (onPress) y encender/apagar (onToggle).
 *
 * Props:
 * - equipo: objeto con los datos del equipo
 * - onPress: función que recibe el id al hacer clic en la tarjeta
 * - onToggle: función que recibe el id al presionar encender/apagar
 *
 * Ejemplo:
 * <EquipoCard
 *   equipo={equipo}
 *   onPress={(id) => verDetalle(id)}
 *   onToggle={(id) => toggleEquipo(id)}
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
import { styles } from "../styles/equiposListStyles";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

// ============================================================
// CONSTANTES AUXILIARES
// ============================================================
const TIPOS_LABELS = {
  aireacion: "Aireación",
  bombeo: "Bombeo",
  alimentacion: "Alimentación",
  monitoreo: "Monitoreo",
  mantenimiento: "Mantenimiento",
  otro: "Otro",
};

const TIPOS_ICONS = {
  aireacion: ICONS.wind,
  bombeo: ICONS.waterFlow,
  alimentacion: ICONS.food,
  monitoreo: ICONS.chemicalContainer,
  mantenimiento: ICONS.tools,
  otro: ICONS.gear,
};

const ESTADO_LABELS = {
  activo: "Activo",
  inactivo: "Inactivo",
  mantenimiento: "Mantenimiento",
};

const ESTADO_VARIANTS = {
  activo: "success",
  inactivo: "danger",
  mantenimiento: "warning",
};

// ============================================================
// COMPONENTE
// ============================================================
export default function EquipoCard({
  equipo,
  onPress,
  onToggle,
}) {
  const tipoLabel = TIPOS_LABELS[equipo.tipo] || equipo.tipo;
  const tipoIcon = TIPOS_ICONS[equipo.tipo] || ICONS.gear;
  const estadoLabel = ESTADO_LABELS[equipo.estado] || equipo.estado;
  const estadoVariant = ESTADO_VARIANTS[equipo.estado] || "info";

  const horasUsoFormateado = equipo.horasUso < 1
    ? `${Math.round(equipo.horasUso * 60)} min`
    : `${Math.round(equipo.horasUso)} h`;

  const necesitaMantenimiento = equipo.horasUso >= equipo.horasMantenimiento;

  return (
    <TouchableOpacity onPress={() => onPress?.(equipo.id)} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon icon={tipoIcon} size={24} color={COLORS.primary} />
          </View>
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <CustomText style={styles.nombre} numberOfLines={1}>
                {equipo.nombre}
              </CustomText>
              <Badge
                label={estadoLabel}
                variant={estadoVariant}
                style={styles.estadoBadge}
              />
            </View>
            <View style={styles.details}>
              <CustomText style={styles.detailText}>
                {tipoLabel} · {equipo.codigo}
              </CustomText>
              <CustomText style={styles.detailText}>
                 {equipo.ubicacion || "Sin ubicación"}
              </CustomText>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <CustomText style={styles.infoLabel}>Horas de uso:</CustomText>
            <CustomText style={styles.infoValue}>{horasUsoFormateado}</CustomText>
          </View>
          <View style={styles.infoItem}>
            <CustomText style={styles.infoLabel}>Mantenimiento:</CustomText>
            <CustomText style={[
              styles.infoValue,
              necesitaMantenimiento && styles.infoValueCritico
            ]}>
              {necesitaMantenimiento
                ? "⚠️ Requiere mantenimiento"
                : `${Math.round(equipo.horasMantenimiento - equipo.horasUso)} h restantes`}
            </CustomText>
            <CustomText style={styles.infoLabel}>.</CustomText>
          </View>
        </View>

        {/* Botón de encender/apagar con colores verde/rojo */}
        <View style={styles.actions}>
          <Button
            onPress={() => onToggle?.(equipo.id)}
            style={[
              styles.toggleBtn,
              equipo.encendido ? styles.toggleBtnOn : styles.toggleBtnOff
            ]}
          >
            <CustomText style={styles.toggleBtnText}>
              {equipo.encendido ? "Apagar" : "Encender"}
            </CustomText>
          </Button>
        </View>
      </Card>
    </TouchableOpacity>
  );
}