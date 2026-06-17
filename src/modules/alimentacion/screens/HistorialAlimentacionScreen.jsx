import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import useAlimentacion from '../hooks/useAlimentacion';
import AlimentacionList from '../components/AlimentacionList';
import CustomText from '../../../shared/components/Text';
import Spinner from '../../../shared/components/spinner';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography'

export default function HistorialAlimentacionScreen({ navigation }) {
  const { alimentaciones, loading, error } = useAlimentacion();

  if (loading) return <Spinner />;
  if (error)   return <CustomText tamano="sm" color={COLORS.error} alineacion="center">{error}</CustomText>;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <CustomText tamano="xs" color={COLORS.tertiaryTxt} fuente={TYPOGRAPHY.fontFamily.regular} estilo={styles.total}>
          {alimentaciones.length} registros en total
        </CustomText>
        <AlimentacionList alimentaciones={alimentaciones} />
        <View style={styles.spacer} />
      </ScrollView>
      <Pressable
        style={({ pressed }) => [styles.btnVolver, pressed && styles.pressed]}
        onPress={() => navigation?.goBack()}
      >
        <FontAwesome6 name="arrow-left" size={14} color={COLORS.primary} solid />
        <CustomText tamano="sm" color={COLORS.primary} fuente={TYPOGRAPHY.fontFamily.regular}>VOLVER</CustomText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: COLORS.surface },
  contenido: { padding: 16, gap: 12, paddingBottom: 100 },
  total:     { textTransform: 'uppercase', letterSpacing: 0.5 },
  spacer:    { height: 20 },
  btnVolver: {
    position: 'absolute',
    bottom: 20, left: 16, right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});