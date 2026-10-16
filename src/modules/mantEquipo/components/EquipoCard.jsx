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

import React, { useState, useEffect, useMemo } from "react";
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

export default function EquipoCard({ equipo, onPress, onToggle, isToggling = false }) {
  const tipoLabel = TIPOS_LABELS[equipo.tipo] || equipo.tipo;
  const tipoIcon = TIPOS_ICONS[equipo.tipo] || ICONS.gear;
  const estadoLabel = ESTADO_LABELS[equipo.estado] || equipo.estado;
  const estadoVariant = ESTADO_VARIANTS[equipo.estado] || "info";

  // Refresco reactivo en vivo mientras el equipo esté encendido
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!equipo.encendido || !equipo.fechaUltimoEncendido) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000); // actualiza cada segundo
    return () => clearInterval(interval);
  }, [equipo.encendido, equipo.fechaUltimoEncendido]);

  const horasUsoActuales = useMemo(() => {
    let base = Number(equipo.horasBase ?? equipo.horasActuales ?? equipo.horasUso ?? 0);
    if (equipo.encendido && equipo.fechaUltimoEncendido) {
      const msInicio = new Date(equipo.fechaUltimoEncendido).getTime();
      if (!isNaN(msInicio)) {
        const msTranscurridos = Math.max(0, now - msInicio);
        const horasTranscurridas = msTranscurridos / (1000 * 60 * 60);
        base = parseFloat((base + horasTranscurridas).toFixed(4));
      }
    }
    return base;
  }, [equipo, now]);

  const horasUsoFormateado = useMemo(() => {
    const totalMinutos = Math.max(0, Math.round(horasUsoActuales * 60));

    if (totalMinutos < 60) {
      return `${totalMinutos} min`;
    }

    const horas = Math.floor(totalMinutos / 60);
    const mins = totalMinutos % 60;

    return mins > 0 ? `${horas} h ${mins} min` : `${horas} h`;
  }, [horasUsoActuales]);

  const horasRestantes = useMemo(() => {
    if (!equipo.horasMantenimiento) return 0;
    const restantes = equipo.horasMantenimiento - horasUsoActuales;
    return restantes > 0 ? restantes : 0;
  }, [equipo.horasMantenimiento, horasUsoActuales]);

  const necesitaMantenimiento = equipo.horasMantenimiento ? horasRestantes === 0 : false;

  const bloqueadoParaEncender =
    !equipo.encendido &&
    (equipo.estado === "mantenimiento" || equipo.estado === "inactivo");

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
              : `${Math.round(horasRestantes)} h restantes`}
          </CustomText>
        </View>
      </View>

      {/* Estado actual + Botón de acción */}
      <View style={styles.actions}>
        {/* Indicador de estado actual (pasivo, no clickeable) */}
        <View style={styles.estadoActualRow}>
          <View
            style={[
              styles.estadoDot,
              equipo.encendido ? styles.estadoDotEncendido : styles.estadoDotApagado,
            ]}
          />
          <CustomText
            style={[
              styles.estadoActualText,
              equipo.encendido
                ? styles.estadoActualTextEncendido
                : styles.estadoActualTextApagado,
            ]}
          >
            {equipo.encendido ? "Encendido" : "Apagado"}
          </CustomText>
        </View>

        {/* Botón que muestra la ACCIÓN a ejecutar */}
        <Button
          variant="outline"
          disabled={bloqueadoParaEncender || isToggling}
          onPress={(e) => {
            e?.stopPropagation?.();
            if (bloqueadoParaEncender || isToggling) return;
            onToggle?.(equipo.id);
          }}
          style={[
            styles.toggleBtn,
            bloqueadoParaEncender || isToggling
              ? styles.toggleBtnDeshabilitado
              : equipo.encendido
              ? styles.toggleBtnApagar
              : styles.toggleBtnEncender,
          ]}
        >
          <Icon
            icon={ICONS.engine}
            size={15}
            color={
              bloqueadoParaEncender || isToggling
                ? COLORS.textTertiary
                : equipo.encendido
                ? COLORS.error
                : COLORS.success
            }
          />
          <CustomText
            style={[
              styles.toggleBtnLabel,
              bloqueadoParaEncender
                ? styles.toggleBtnLabelDeshabilitado
                : equipo.encendido
                ? styles.toggleBtnLabelApagar
                : styles.toggleBtnLabelEncender,
            ]}
          >
            {equipo.encendido ? "Apagar" : "Encender"}
          </CustomText>
        </Button>
      </View>
    </CardPress>
  );
}