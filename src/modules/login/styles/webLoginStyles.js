/**
 * ============================================================
 * ESTILOS: WebLoginScreen
 * ============================================================
 *
 * Estilos exclusivos de la pantalla WebLoginScreen.
 * Esta es la versión web del login con usuario y contraseña.
 *
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

const styles = StyleSheet.create({

  // CONTENEDOR PRINCIPAL
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  // HEADER 
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    alignItems: 'center',
  },

  headerSubtitle: {
    marginTop: 8,
    opacity: 0.9,
  },

  logoCard: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
    padding: 12,
  },

  logoImage: {
    width: 50,
    height: 50,
  },

  // SECCIÓN DEL FORMULARIO
  formSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  // ERRORES DE CAMPO 
  fieldError: {
    marginTop: -6,
    marginBottom: 8,
    marginLeft: 2,
  },

  // ERROR DEL SERVIDOR 
  serverErrorContainer: {
    backgroundColor: COLORS.errorLight,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },

  // SEPARADOR ENTRE BOTONES
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },

  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.secondary,
  },

  separatorText: {
    marginHorizontal: 10,
  },
});

export default styles;