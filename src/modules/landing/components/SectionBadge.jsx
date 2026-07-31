/**
 * ============================================================
 * COMPONENTE DE IDENTIFICADOR DE SECCIÓN
 * ============================================================
 *
 * Muestra una etiqueta visual reutilizable para identificar las
 * diferentes secciones de la página principal de CAPROCAM.
 *
 * Funcionalidad:
 * - Recibe y presenta el texto correspondiente a cada sección.
 * - Incluye el ícono representativo de camarón.
 * - Mantiene una apariencia uniforme en las secciones del landing.
 * - Reutiliza los colores, íconos y estilos definidos en el proyecto.
 */

import { Text, View } from "react-native";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/LandingStyle";

export default function SectionBadge({ texto }) {
  return (
    <View style={styles.sectionBadge}>
      <Icon
        icon={ICONS.shrimp}
        size={13}
        color={COLORS.primary}
      />
      <Text style={styles.sectionBadgeText}>{texto}</Text>
    </View>
  );
}
