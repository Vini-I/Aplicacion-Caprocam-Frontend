/**
 * ============================================================
 * HOOKS DE LA PÁGINA PRINCIPAL
 * ============================================================
 *
 * Centraliza la lógica y los estados utilizados por la pantalla
 * principal de CAPROCAM, incluyendo el carrusel, la navegación,
 * las preguntas frecuentes, WhatsApp y el diseño responsivo.
 *
 * Funcionalidad:
 * - Controla el cambio automático y manual de las imágenes del carrusel.
 * - Aplica una animación de desvanecimiento al cambiar de imagen.
 * - Guarda las posiciones de las secciones de la página.
 * - Permite desplazarse hacia una sección específica o volver al inicio.
 * - Controla la apertura y el cierre de las preguntas frecuentes.
 * - Construye y abre el enlace de contacto de WhatsApp.
 * - Muestra una alerta cuando no es posible abrir WhatsApp.
 * - Identifica si la pantalla corresponde a un móvil o una tableta.
 * - Controla la apertura y el cierre del menú de navegación móvil.
 */

import {
  Alert,
  Animated,
  Linking,
  useWindowDimensions,
} from "react-native";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CONTACTO } from "../data/landing.data";

// ==============
// Funcion de carrusel: controla el cambio automatico y la animacion de las imagenes principales.
// ==============
export function useLandingCarousel(totalSlides) {
  const opacity = useRef(new Animated.Value(1)).current;

  const [indiceHero, setIndiceHero] = useState(0);

  const cambiarSlide = useCallback(
    (nuevoIndice) => {
      if (nuevoIndice === indiceHero) {
        return;
      }

      Animated.timing(opacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setIndiceHero(nuevoIndice);

        Animated.timing(opacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }).start();
      });
    },
    [indiceHero, opacity],
  );

  useEffect(() => {
    const timer = setTimeout(
      () => cambiarSlide((indiceHero + 1) % totalSlides),
      5000,
    );

    return () => clearTimeout(timer);
  }, [cambiarSlide, indiceHero, totalSlides]);

  return {
    indiceHero,
    opacity,
    cambiarSlide,
  };
}

// ==============
// Funcion de navegacion: guarda las posiciones y desplaza la pantalla a cada seccion.
// ==============
export function useLandingNavigation() {
  const scrollRef = useRef(null);
  const posicionesRef = useRef({});

  function guardarPosicion(nombre, event) {
    posicionesRef.current[nombre] =
      event.nativeEvent.layout.y;
  }

  function irASeccion(nombre) {
    const posicion = posicionesRef.current[nombre];

    if (typeof posicion === "number" && scrollRef.current) {
      scrollRef.current.scrollTo({
        y: posicion,
        animated: true,
      });
    }
  }

  function irAlInicio() {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  return {
    scrollRef,
    guardarPosicion,
    irASeccion,
    irAlInicio,
  };
}

// ==============
// Funcion de preguntas frecuentes: abre o cierra la respuesta seleccionada.
// ==============
export function useLandingFaq() {
  const [preguntaAbierta, setPreguntaAbierta] =
    useState("");

  function alternarPregunta(id) {
    setPreguntaAbierta((preguntaActual) => {
      if (preguntaActual === id) {
        return "";
      }

      return id;
    });
  }

  return {
    preguntaAbierta,
    alternarPregunta,
  };
}

// ==============
// Funcion WhatsApp: construye y abre el enlace de contacto de CAPROCAM.
// ==============
export function useWhatsapp() {
  async function abrirWhatsapp() {
    const mensaje = encodeURIComponent(
      CONTACTO.mensajeWhatsapp,
    );

    const enlace = `https://wa.me/${CONTACTO.numeroWhatsapp}?text=${mensaje}`;

    try {
      const disponible = await Linking.canOpenURL(enlace);

      if (disponible === false) {
        Alert.alert(
          "WhatsApp",
          "No fue posible abrir WhatsApp.",
        );

        return;
      }

      await Linking.openURL(enlace);
    } catch (error) {
      console.error("Error abriendo WhatsApp:", error);

      Alert.alert(
        "WhatsApp",
        "OcurriÃ³ un error al abrir WhatsApp.",
      );
    }
  }

  return {
    abrirWhatsapp,
  };
}

// ==============
// Funcion responsive: identifica si la vista actual es movil o tablet.
// ==============
export function useLandingResponsive() {
  const { width } = useWindowDimensions();

  return {
    esMovil: width < 760,
    esTablet: width >= 760 && width < 1100,
  };
}

// ==============
// Función de menu movil: abre y cierra las opciones de navegacion en pantallas pequeñas.
// ==============
export function useLandingMobileMenu() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  function alternarMenu() {
    setMenuAbierto((estaAbierto) => !estaAbierto);
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return {
    menuAbierto,
    alternarMenu,
    cerrarMenu,
  };
}
