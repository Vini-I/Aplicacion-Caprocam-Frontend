/**
 * ============================================================
 * COMPONENTE: SectionTitle
 * ============================================================
 *
 * Encabezado de sección (icono + texto en mayúsculas) usado en las
 * cabeceras de cada Card de los formularios y del detalle de
 * mantenimiento.
 *
 * @dependencies - Title, Icon (shared/components)
 *               - mantEquipoStyles.js (styles)
 */

import React from "react";
import { View } from "react-native";
import Title from "../../../shared/components/Title.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/mantEquipoStyles.js";

export default function SectionTitle({ icon, title }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Icon icon={icon} size={18} color={COLORS.primary} style={styles.sectionTitleIcon} />
      <Title level={5} style={styles.sectionTitleText}>{title}</Title>
    </View>
  );
}
