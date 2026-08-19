/**
 * ============================================================
 * COMPONENTE: EquipoCard
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado que reutiliza elementos de shared/components.
 * - Renderizar la tarjeta interactiva con la información resumida de un equipo y sus acciones.
 *
 * @dependencies - CardPress.jsx, Badge.jsx, Button.jsx, Icon.jsx, Text.jsx (shared/components), equiposListStyles.js (styles)
 * @validations  - Muestra badges según estado operativo y habilita/deshabilita el botón según el estado del equipo.
 * @navigation   - Recibe callback onPress para navegar al detalle del equipo.
 */

import React from "react";
import { View } from "react-native";
import CardPress from "../../../shared/components/CardPress";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import { styles } from "../styles/equiposListStyles";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

// Constantes de etiquetas e iconos
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

export default function EquipoCard({ equipo, onPress, onToggle }) {
  const tipoLabel = TIPOS_LABELS[equipo.tipo] || equipo.tipo;
  const tipoIcon = TIPOS_ICONS[equipo.tipo] || ICONS.gear;
  const estadoLabel = ESTADO_LABELS[equipo.estado] || equipo.estado;
  const estadoVariant = ESTADO_VARIANTS[equipo.estado] || "info";

  const horasUsoFormateado =
    equipo.horasUso < 1
      ? `${Math.round(equipo.horasUso * 60)} min`
      : `${Math.round(equipo.horasUso)} h`;

  const necesitaMantenimiento = equipo.horasUso >= equipo.horasMantenimiento;

  return (
    <CardPress onPress={() => onPress?.(equipo.id)} style={styles.card}>
      {/* Cabecera: icono + nombre + estado */}
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

      {/* Información de uso y mantenimiento */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <View style={styles.infoLabelContainer}>
            <Icon
              icon={ICONS.clock}
              size={14}
              color={COLORS.textTertiary}
              style={styles.infoIcon}
            />
            <CustomText style={styles.infoLabel}>Horas de uso:</CustomText>
          </View>
          <CustomText style={styles.infoValue}>{horasUsoFormateado}</CustomText>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoLabelContainer}>
            <Icon
              icon={ICONS.tools}
              size={14}
              color={COLORS.textTertiary}
              style={styles.infoIcon}
            />
            <CustomText style={styles.infoLabel}>Mantenimiento:</CustomText>
          </View>
          <CustomText
            style={[
              styles.infoValue,
              necesitaMantenimiento && styles.infoValueCritico,
            ]}
          >
            {necesitaMantenimiento
              ? "Requiere mantenimiento"
              : `${Math.round(equipo.horasMantenimiento - equipo.horasUso)} h restantes`}
          </CustomText>
        </View>
      </View>

      {/* Botón Encender/Apagar */}
      <View style={styles.actions}>
        <Button
          variant="outline"
          onPress={(e) => {
            e?.stopPropagation?.();
            onToggle?.(equipo.id);
          }}
          style={[styles.toggleBtn, styles.toggleBtnOutline]}
        >
          <Icon
            icon={equipo.encendido ? ICONS.check : ICONS.close}
            size={16}
            color={COLORS.primary}
          />
          <CustomText style={styles.toggleBtnLabel}>
            {equipo.encendido ? "Encendido" : "Apagado"}
          </CustomText>
        </Button>
      </View>
    </CardPress>
  );
}