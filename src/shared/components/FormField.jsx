/**
 * ============================================================
 * COMPONENTE FORMFIELD
 * ============================================================
 *
 * Envuelve el Input global añadiendo visualización de mensaje
 * de error debajo del campo. Soluciona que Input no tiene prop
 * nativa de error, evitando repetir ese patrón en cada pantalla.
 *
 * Props principales:
 * - error: string — mensaje de error. Si está vacío no se muestra nada.
 * - errorColor: color del texto de error (default: COLORS.error).
 * - errorSize: tamaño del texto de error (default: 12).
 * - errorStyle: estilos extra para el texto de error.
 * - ...props: cualquier prop de Input (label, value, placeholder, etc.)
 *
 * Ejemplo:
 * <FormField
 *   label="Correo"
 *   value={email}
 *   onChangeText={setEmail}
 *   error={errors.email}
 * />
 */

import { View, StyleSheet } from 'react-native';
import Input from './Input';
import CustomText from './Text';
import { COLORS } from '../../theme/colors';

export default function FormField({
  error = '',
  errorColor = COLORS.error,
  errorSize = 12,
  errorStyle,
  ...inputProps
}) {
  return (
    <View>
      <Input {...inputProps} />
      {error !== '' && (
        <CustomText
          size={errorSize}
          color={errorColor}
          style={[styles.errorText, errorStyle]}
        >
          {error}
        </CustomText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    marginTop: -6,
    marginBottom: 8,
    marginLeft: 2,
  },
});