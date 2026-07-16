/**
 * ============================================================
 * ESTILOS: WorkerSearchBar
 * ============================================================
 *
 * Reúne el estilo visual del campo de búsqueda de trabajadores
 * para mantener la lógica del componente separada de la vista.
 */

import { StyleSheet } from 'react-native';

import { COLORS } from '../../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    paddingLeft: 12,
    paddingRight: 10,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    borderWidth: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    outlineStyle: 'none',
  },
  iconWrap: {
    marginLeft: 8,
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
});

export default styles;