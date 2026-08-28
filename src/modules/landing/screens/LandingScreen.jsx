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
 * - Permite abrir el medio de contacto mediante correo electrónico.
 * - Controla el menú de navegación para dispositivos móviles.
 * - Adapta la distribución de los componentes para móviles y tabletas.
 * - Utiliza un área segura y desplazamiento vertical para mostrar
 *   correctamente todo el contenido de la pantalla.
 */

import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LandingAbout from "../components/LandingAbout";
import LandingCommunity from "../components/LandingCommunity";
import LandingFooter from "../components/LandingFooter";
import LandingHeader from "../components/LandingHeader";
import LandingHero from "../components/LandingHero";
import LandingServices from "../components/LandingServices";

import { useLanding } from "../hooks/useLanding";
import { styles } from "../styles/LandingStyle";

export default function LandingScreen() {
  const {
    esMovil,
    esTablet,
    indiceHero,
    opacity,
    cambiarSlide,
    preguntaAbierta,
    alternarPregunta,
    scrollRef,
    guardarPosicion,
    irASeccion,
    irAlInicio,
    abrirCorreo,
    menuAbierto,
    alternarMenu,
    navegarA,
    iniciarSesion,
    irACreditos,
    enlaceActivo,
    activarEnlace,
    desactivarEnlace,
  } = useLanding();

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
          irAlInicio={irAlInicio}
          iniciarSesion={iniciarSesion}
          navegarA={navegarA}
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
            esTablet={esTablet}
            guardarPosicion={guardarPosicion}
          />
          <LandingServices
            esMovil={esMovil}
            esTablet={esTablet}
            guardarPosicion={guardarPosicion}
            preguntaAbierta={preguntaAbierta}
            alternarPregunta={alternarPregunta}
          />
          <LandingCommunity
            esMovil={esMovil}
            esTablet={esTablet}
            guardarPosicion={guardarPosicion}
            abrirCorreo={abrirCorreo}
          />
          <LandingFooter
            esMovil={esMovil}
            esTablet={esTablet}
            guardarPosicion={guardarPosicion}
            irACreditos={irACreditos}
            enlaceActivo={enlaceActivo}
            activarEnlace={activarEnlace}
            desactivarEnlace={desactivarEnlace}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
