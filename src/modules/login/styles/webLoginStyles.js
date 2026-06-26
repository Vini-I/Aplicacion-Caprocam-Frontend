/**
 * ESTILOS: WebLoginScreen
 *
 * Solo contiene lo exclusivo de esta pantalla. Los estilos de
 * encabezado, separador y error de campo viven ahora en sus
 * componentes compartidos (Header, Separator, FormField).
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  formSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  serverErrorContainer: {
    backgroundColor: COLORS.errorLight,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
});

export default styles;