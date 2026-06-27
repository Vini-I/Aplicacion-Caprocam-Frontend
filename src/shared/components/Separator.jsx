/**
 * ============================================================
 * COMPONENTE SEPARATOR
 * ============================================================
 *
 * Divisor horizontal con texto central opcional. Útil para
 * separar secciones de un formulario o pantalla con un texto
 * como "o", "y", etc.
 *
 * Props principales:
 * - text: texto central del separador.
 * - lineColor: color de las líneas (default: COLORS.secondary).
 * - textColor: color del texto central (default: COLORS.textTertiary).
 * - textSize: tamaño del texto central (default: 12).
 * - style: estilos extra para el contenedor externo.
 *
 * Ejemplo:
 * <Separator text="o" />
 * <Separator text="¿No tienes cuenta?" lineColor={COLORS.primary} />
 */

import { View, StyleSheet } from 'react-native';
import CustomText from './Text';
import { COLORS } from '../../theme/colors';

export default function Separator({
  text = '',
  lineColor = COLORS.secondary,
  textColor = COLORS.textTertiary,
  textSize = 12,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
      {text !== '' && (
        <CustomText size={textSize} color={textColor} style={styles.text}>
          {text}
        </CustomText>
      )}
      <View style={[styles.line, { backgroundColor: lineColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: 10,
  },
});