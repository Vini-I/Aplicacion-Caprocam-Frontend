/**
 * ============================================================
 * COMPONENTE: RegistrarEquipoHeader
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado que reutiliza elementos de shared/components.
 * - Renderizar el encabezado compacto con título e ícono para formularios del módulo de equipos.
 *
 * @dependencies - Card.jsx, Icons.jsx, Text.jsx, Title.jsx (shared/components), RegistrarEquipoHeaderStyles.js (styles)
 * @validations  - Muestra dinámicamente título y subtítulo recibidos por props.
 * @navigation   - Ninguna
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