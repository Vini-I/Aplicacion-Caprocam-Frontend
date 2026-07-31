/**
 * ============================================================
 * PANTALLA PRINCIPAL DE CAPROCAM
 * ============================================================
 *
 * Organiza y presenta la página principal de CAPROCAM, integrando
 * sus diferentes secciones y conectándolas con los hooks que
 * controlan la navegación, el carrusel y las interacciones.
 *
 * Funcionalidad:
 * - Integra el encabezado, carrusel, información institucional,
 *   servicios, comunidad de agremiados y pie de página.
 * - Permite desplazarse entre las secciones mediante el encabezado.
 * - Controla el cambio automático y manual del carrusel principal.
 * - Gestiona la apertura y el cierre de las preguntas frecuentes.
 * - Permite abrir el medio de contacto mediante WhatsApp.
 * - Controla el menú de navegación para dispositivos móviles.
 * - Adapta la distribución de los componentes para móviles y tabletas.
 * - Utiliza un área segura y desplazamiento vertical para mostrar
 *   correctamente todo el contenido de la pantalla.
 */

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import LandingAbout from "../components/LandingAbout";
import LandingCommunity from "../components/LandingCommunity";
import LandingFooter from "../components/LandingFooter";
import LandingHeader from "../components/LandingHeader";
import LandingHero from "../components/LandingHero";
import LandingServices from "../components/LandingServices";

import { HERO_SLIDES } from "../data/landing.data";
import {
  useLandingCarousel,
  useLandingFaq,
  useLandingMobileMenu,
  useLandingNavigation,
  useLandingResponsive,
  useWhatsapp,
} from "../hooks/useLanding";
import { styles } from "../styles/LandingStyle";

export default function LandingScreen({ onLogin }) {
  const router = useRouter();

  const { esMovil, esTablet } = useLandingResponsive();

  const { indiceHero, opacity, cambiarSlide } =
    useLandingCarousel(HERO_SLIDES.length);

  const { preguntaAbierta, alternarPregunta } =
    useLandingFaq();

  const {
    scrollRef,
    guardarPosicion,
    irASeccion,
    irAlInicio,
  } = useLandingNavigation();

  const { abrirWhatsapp } = useWhatsapp();

  const { menuAbierto, alternarMenu, cerrarMenu } =
    useLandingMobileMenu();

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <View style={styles.screen}>
        <LandingHeader
          esMovil={esMovil}
          menuAbierto={menuAbierto}
          alternarMenu={alternarMenu}
          cerrarMenu={cerrarMenu}
          irAlInicio={irAlInicio}
          irASeccion={irASeccion}
          iniciarSesion={() => onLogin()}
        />
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LandingHero
            esMovil={esMovil}
            esTablet={esTablet}
            indiceHero={indiceHero}
            opacity={opacity}
            cambiarSlide={cambiarSlide}
            irASeccion={irASeccion}
          />
          <LandingAbout
            esMovil={esMovil}
            guardarPosicion={guardarPosicion}
          />
          <LandingServices
            esMovil={esMovil}
            guardarPosicion={guardarPosicion}
            preguntaAbierta={preguntaAbierta}
            alternarPregunta={alternarPregunta}
          />
          <LandingCommunity
            esMovil={esMovil}
            esTablet={esTablet}
            guardarPosicion={guardarPosicion}
            abrirWhatsapp={abrirWhatsapp}
          />
          <LandingFooter
            esMovil={esMovil}
            guardarPosicion={guardarPosicion}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
