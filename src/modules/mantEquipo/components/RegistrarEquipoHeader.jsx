/**
 * ============================================================
 * COMPONENTE: RegistrarEquipoHeader
 * ============================================================
 *
 * Encabezado compacto para la pantalla de registro de equipos.
 * Replica el patrón visual del dashboard: icono a la izquierda,
 * textos a la derecha y bloque celeste con el color principal.
 * Ruta: src/modules/mantEquipo/components/RegistrarEquipoHeader.jsx
 */

import React from "react";
import { View } from "react-native";

import Card from "../../../shared/components/Card.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import CustomText from "../../../shared/components/Text.jsx";
import Title from "../../../shared/components/Title.jsx";

import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import { styles } from "../styles/RegistrarEquipoHeaderStyles.js";

export default function RegistrarEquipoHeader({ title, subtitle }) {
  return (
    <Card style={styles.headerCard}>
      <View style={styles.headerIconBox}>
        <Icon icon={ICONS.dashboard} size={24} color={COLORS.primary} />
      </View>

      <View style={styles.headerTextBox}>
        <Title level={5} color={COLORS.white} style={styles.headerTitle}>
          {title}
        </Title>

        <CustomText
          size={12}
          color={COLORS.white}
          style={styles.headerSubtitle}
          numberOfLines={1}
        >
          {subtitle}
        </CustomText>
      </View>
    </Card>
  );
}