/**
 * ============================================================
 * COMPONENTE HEADER
 * ============================================================
 *
 * Encabezado de pantalla con logo, título y subtítulo
 * parametrizables. Agnóstico del módulo que lo usa: no tiene
 * hardcoded ningún asset, color o texto específico.
 *
 * Props principales:
 * - title: texto del título (usa el componente Title).
 * - subtitle: texto del subtítulo (usa CustomText).
 * - logo: source de imagen (require o uri). Opcional.
 * - logoWidth / logoHeight: dimensiones del logo (default 64).
 * - backgroundColor: color de fondo del header (default COLORS.primary).
 * - titleLevel: nivel del título 1-6 (default 1).
 * - titleColor: color del título (default COLORS.white).
 * - subtitleColor: color del subtítulo (default COLORS.white).
 * - subtitleSize: tamaño del subtítulo (default 14).
 * - style: estilos extra para el contenedor externo.
 * - logoStyle: estilos extra para la imagen del logo.
 *
 * Ejemplo:
 * <Header
 *   title="Caprocam"
 *   subtitle="Ingresa tus credenciales"
 *   logo={require('../../assets/shrimp-solid.png')}
 * />
 */

import { View, StyleSheet } from 'react-native';
import Title from './Title';
import CustomText from './Text';
import Images from './Images';
import Card from './Card';
import { COLORS } from '../../theme/colors';

export default function Header({
  title,
  subtitle,
  logo,
  logoWidth = 64,
  logoHeight = 64,
  backgroundColor = COLORS.primary,
  titleLevel = 1,
  titleColor = COLORS.white,
  subtitleColor = COLORS.white,
  subtitleSize = 14,
  style,
  logoStyle,
}) {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>

      {logo && (
        <Card style={styles.logoCard}>
          <Images
            source={logo}
            width={logoWidth}
            height={logoHeight}
            borderRadius={0}
            resizeMode="contain"
            style={logoStyle}
          />
        </Card>
      )}

      {title && (
        <Title level={titleLevel} color={titleColor} align="center">
          {title}
        </Title>
      )}

      {subtitle && (
        <CustomText size={subtitleSize} color={subtitleColor} align="center" style={styles.subtitle}>
          {subtitle}
        </CustomText>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoCard: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
    padding: 12,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.9,
  },
});