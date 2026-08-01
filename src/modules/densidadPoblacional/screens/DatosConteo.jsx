/**
 * ============================================================
 * SCREEN DATOSCONTEO
 * ============================================================
 *
 * Envoltorio de presentación (Card + Title) para el formulario
 * de datos de conteo. No contiene lógica de negocio propia:
 * reenvía tal cual todas las props que recibe de su padre
 * (densidadPoblacionalScreen) hacia FormularioConteo.
 *
 * Props principales:
 * - numeroCamarones, tirosAtarraya, areaAtarraya, promedioPorTiro,
 *   supervivencia, notasConteo y sus setters.
 * - submitted / errores: estado de validación, reenviados tal
 *   cual a FormularioConteo.
 *
 * Ejemplo:
 * <DatosConteo
 *   numeroCamarones={numeroCamarones}
 *   setNumeroCamarones={setNumeroCamarones}
 *   submitted={submitted}
 *   errores={errores}
 * />
 */

import React from "react";
import { View } from "react-native";
import Card from "../../../shared/components/Card";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import FormularioConteo from "./FormularioConteo";
import { styles } from "../styles/DensidadPoblacionalStyles";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

export default function DatosConteo(props) {
  return (
    <View>
      <Card>
        <View style={styles.sectionTitleRow}>
        <Icon icon={ICONS.shrimp} size={18} color={COLORS.primary} style={styles.sectionIcon} />
                  <Text size={18} weight="700" color={COLORS.textSecondary}>
                    Datos de conteo
                  </Text>
      </View>
        <FormularioConteo {...props} />
      </Card>
    </View>
  );
}
