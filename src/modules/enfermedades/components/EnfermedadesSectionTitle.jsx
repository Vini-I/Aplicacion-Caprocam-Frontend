/**
 * ============================================================
 * COMPONENTE: TITULO DE SECCION DE ENFERMEDADES
 * ============================================================
 *
 * Renderiza el icono y el titulo de cada seccion
 * del formulario de enfermedades.
 */

import { View } from "react-native";

import Icon from "../../../shared/components/Icons";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { styles } from "../styles/EnfermedadesStyle";

export default function EnfermedadesSectionTitle({ title, icon }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Icon icon={icon} size={18} color={COLORS.primary} />

      <Title
        level={5}
        color={COLORS.textSecondary}
        fuente={TYPOGRAPHY.fontFamily.bold}
        style={styles.sectionTitle}
      >
        {title}
      </Title>
    </View>
  );
}