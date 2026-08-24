/**
 * ============================================================
 * HOOKS DE LA PÁGINA PRINCIPAL
 * ============================================================
 *
 * Centraliza la lógica y los estados utilizados por la pantalla
 * principal de CAPROCAM.
 */

import { Animated, Linking, useWindowDimensions } from "react-native";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "expo-router";

import { useError } from "../../../shared/context/ErrorContext";

import { CONTACTO, HERO_SLIDES } from "../data/landing.data";

// ==============
// Funcion Carrusel: controla el cambio automatico y la animacion de las imagenes principales.
// ==============

export function useLandingCarousel(slides = HERO_SLIDES) {
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
    const totalSlides = slides.length;

    if (totalSlides === 0) {
      return undefined;
    }

    const timer = setTimeout(
      () => cambiarSlide((indiceHero + 1) % totalSlides),
      5000,
    );

    return () => clearTimeout(timer);
  }, [cambiarSlide, indiceHero, slides]);

  return {
    indiceHero,
    opacity,
    cambiarSlide,
  };
}

// ==============
// Funcion Navegacion: guarda las posiciones y desplaza la pantalla a cada seccion.
// ==============

export function useLandingNavigation() {
  const scrollRef = useRef(null);

  const posicionesRef = useRef({});

  function guardarPosicion(nombre, event) {
    posicionesRef.current[nombre] = event.nativeEvent.layout.y;
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
// Funcion Preguntas Frecuentes: abre o cierra la respuesta seleccionada.
// ==============

export function useLandingFaq() {
  const [preguntaAbierta, setPreguntaAbierta] = useState("");

  function alternarPregunta(id) {
    setPreguntaAbierta((preguntaActual) => (preguntaActual === id ? "" : id));
  }

  return {
    preguntaAbierta,
    alternarPregunta,
  };
}

// ==============
// Funcion WhatsApp: construye y abre el enlace de contacto y envia los errores al modal global.
// ==============

export function useWhatsapp() {
  const { mostrarError } = useError();

  async function abrirWhatsapp() {
    const mensaje = encodeURIComponent(CONTACTO.mensajeWhatsapp);

    const enlace = `https://wa.me/${CONTACTO.numeroWhatsapp}?text=${mensaje}`;

    try {
      const disponible = await Linking.canOpenURL(enlace);

      if (disponible === false) {
        mostrarError("No fue posible abrir WhatsApp.");

        return;
      }

      await Linking.openURL(enlace);
    } catch {
      mostrarError("Ocurrió un error al abrir WhatsApp.");
    }
  }

  return {
    abrirWhatsapp,
  };
}

// ==============
// Funcion Responsive: identifica si la vista actual es movil o tablet.
// ==============

export function useLandingResponsive() {
  const { width } = useWindowDimensions();

  return {
    esMovil: width < 900,
    esTablet: width >= 900 && width < 1100,
  };
}

// ==============
// Funcion Menu Movil: abre y cierra las opciones de navegacion en pantallas pequenas.
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

// ==============
// Funcion Navegacion del Header: navega a una seccion y cierra el menu cuando la vista es movil.
// ==============

export function useLandingHeaderNavigation({
  esMovil,
  irASeccion,
  cerrarMenu,
}) {
  function navegarA(nombre) {
    irASeccion(nombre);

    if (esMovil) {
      cerrarMenu();
    }
  }

  return {
    navegarA,
  };
}

// ==============
// Funcion Accesos: controla la navegacion hacia inicio de sesion y creditos.
// ==============

export function useLandingAccess() {
  const router = useRouter();

  function iniciarSesion() {
    router.push("/loginWeb");
  }

  function irACreditos() {
    router.push("/creditos");
  }

  return {
    iniciarSesion,
    irACreditos,
  };
}

// ==============
// Funcion Enlace de Creditos: controla el estado visual del enlace del pie de pagina.
// ==============

export function useLandingCreditsLink() {
  const [enlaceActivo, setEnlaceActivo] = useState(false);

  function activarEnlace() {
    setEnlaceActivo(true);
  }

  function desactivarEnlace() {
    setEnlaceActivo(false);
  }

  return {
    enlaceActivo,
    activarEnlace,
    desactivarEnlace,
  };
}

// ==============
// Funcion Landing: agrupa todos los hooks necesarios por la pantalla principal.
// ==============

export function useLanding() {
  const responsive = useLandingResponsive();

  const carrusel = useLandingCarousel();

  const faq = useLandingFaq();

  const navegacion = useLandingNavigation();

  const whatsapp = useWhatsapp();

  const menu = useLandingMobileMenu();

  const accesos = useLandingAccess();

  const enlaceCreditos = useLandingCreditsLink();

  const header = useLandingHeaderNavigation({
    esMovil: responsive.esMovil,
    irASeccion: navegacion.irASeccion,
    cerrarMenu: menu.cerrarMenu,
  });

  return {
    ...responsive,
    ...carrusel,
    ...faq,
    ...navegacion,
    ...whatsapp,
    ...menu,
    ...accesos,
    ...enlaceCreditos,
    ...header,
  };
}
