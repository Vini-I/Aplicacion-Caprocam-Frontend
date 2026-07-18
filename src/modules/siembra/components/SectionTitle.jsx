/**
 * ============================================================
 * COMPONENTE: SECTION TITLE
 * ============================================================
 *
 * Componente reutilizable para mostrar el título de una sección
 * dentro de las tarjetas del módulo de Siembra.
 *
 * FUNCIONALIDAD:
 * - Muestra icono y título.
 * - Mantiene un formato visual consistente.
 *
 * DATOS:
 * - Recibe icon y title como props. No mantiene estado propio.
 *
 * DEPENDENCIAS:
 * - Icon (shared/components).
 * - COLORS (theme).
 */
import { View, Text } from "react-native";

import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/SiembraSectionStyles";

export default function SectionTitle({ icon, title }) {
  return (
    <View style={styles.sectionTitleContainer}>
      <Icon icon={icon} color={COLORS.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}