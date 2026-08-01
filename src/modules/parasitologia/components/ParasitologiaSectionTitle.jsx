/**
 * ============================================================
 * COMPONENTE: TITULO DE SECCION DE PARASITOLOGIA
 * ============================================================
 *
 * Renderiza el titulo y el icono de cada seccion del formulario.
 */

import { View } from "react-native";

import Icon from "../../../shared/components/Icons";
import Title from "../../../shared/components/Title";

import { styles } from "../styles/ParasitologiaStyle";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function ParasitologiaSectionTitle({ title, icon }) {
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