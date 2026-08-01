/**
 * ============================================================
 * COMPONENTE PRINCIPAL DE PRESENTACIÓN
 * ============================================================
 *
 * Presenta la sección inicial de la página mediante un carrusel
 * de imágenes con información destacada sobre CAPROCAM y su
 * compromiso con la acuicultura sostenible.
 *
 * Funcionalidad:
 * - Muestra las imágenes configuradas para el carrusel principal.
 * - Aplica una animación de opacidad al cambiar de imagen.
 * - Incorpora un degradado y capas visuales sobre las fotografías.
 * - Presenta el mensaje principal y la descripción de CAPROCAM.
 * - Permite navegar directamente a la sección “Quiénes somos”.
 * - Muestra estadísticas relacionadas con productores, hectáreas
 *   y años de experiencia.
 * - Permite cambiar manualmente la imagen mediante indicadores.
 * - Muestra la descripción correspondiente a la imagen activa.
 * - Adapta el contenido para móviles y tabletas.
 */

import {
  Animated,
  Pressable,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { HERO_SLIDES } from "../data/landing.data";
import { styles } from "../styles/LandingStyle";

const rgba = (hex, opacity) => {
  const color = hex.replace("#", "");
  return `rgba(${parseInt(color.slice(0, 2), 16)}, ${parseInt(color.slice(2, 4), 16)}, ${parseInt(color.slice(4, 6), 16)}, ${opacity})`;
};

const gradient = [
  rgba(COLORS.textSecondary, 0.97),
  rgba(COLORS.primary, 0.8),
  rgba(COLORS.primary, 0.52),
];

export default function LandingHero({
  esMovil,
  esTablet,
  indiceHero,
  opacity,
  cambiarSlide,
  irASeccion,
}) {
  const slide = HERO_SLIDES[indiceHero];
  const title = [
    styles.heroTitle,
    esTablet && styles.heroTitleTablet,
    esMovil && styles.heroTitleMobile,
  ];
  return (
    <View
      style={[styles.hero, esMovil && styles.heroMobile]}
    >
      <Animated.Image
        source={slide.imagen}
        resizeMode="cover"
        style={[styles.heroImage, { opacity }]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={gradient}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.heroGradient}
      />
      <View
        pointerEvents="none"
        style={styles.heroDarkLayer}
      />
      <View
        style={[
          styles.heroContent,
          esMovil && styles.heroContentMobile,
        ]}
      >
        <View style={styles.heroBadge}>
          <Icon
            icon={ICONS.shrimp}
            size={14}
            color={COLORS.white}
          />
          <Text style={styles.heroBadgeText}>
            Cámara Nacional de Productores de Camarón
          </Text>
        </View>
        <Text style={title}>Impulsando la</Text>
        <View style={styles.heroTitleRow}>
          <Text style={[...title, styles.heroAccent]}>
            acuicultura
          </Text>
          <Text style={title}> sostenible</Text>
        </View>
        <Text style={styles.heroSubtitle}>
          Unidos por el crecimiento responsable del cultivo
          de camarón en Costa Rica.
        </Text>
        <Button
          style={styles.heroButton}
          onPress={() => irASeccion("quienes")}
        >
          <Text style={styles.heroButtonText}>
            Conócenos
          </Text>
        </Button>
        <View
          style={[
            styles.statsPanel,
            esMovil && styles.statsPanelMobile,
          ]}
        >
          {[
            ["+40", "Productores"],
            ["+200", "Hectáreas"],
            ["15", "Años de experiencia"],
          ].map(([numero, etiqueta], index) => (
            <View
              key={etiqueta}
              style={styles.statGroup}
            >
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {numero}
                </Text>
                <Text style={styles.statLabel}>
                  {etiqueta}
                </Text>
              </View>
              {index < 2 && (
                <View
                  style={[
                    styles.statDivider,
                    esMovil && styles.statDividerMobile,
                  ]}
                />
              )}
            </View>
          ))}
        </View>
        <View style={styles.carouselIndicators}>
          {HERO_SLIDES.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => cambiarSlide(index)}
              style={styles.carouselIndicatorButton}
            >
              <View
                style={[
                  styles.carouselDot,
                  index === indiceHero &&
                    styles.carouselDotActive,
                ]}
              />
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.heroPhotoCaption}>
        <Text style={styles.heroPhotoCaptionText}>
          {slide.descripcion}
        </Text>
      </View>
      <View
        pointerEvents="none"
        style={styles.heroBottomCurve}
      />
    </View>
  );
}
