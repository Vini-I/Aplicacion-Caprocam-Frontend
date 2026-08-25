/**
 * ============================================================
 * HOOKS DE CRÉDITOS DE LA LANDING
 * ============================================================
 *
 * Centraliza la lógica utilizada por la pantalla de créditos.
 */

import { useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

// ==============
// Funcion Responsive: calcula la distribucion de la pantalla de creditos segun el ancho disponible.
// ==============
export function useLandingCreditsResponsive() {
  const { width } = useWindowDimensions();

  return {
    esMovil: width < 650,
    esTablet: width >= 650 && width < 900,
    esPantallaMediana: width >= 900 && width < 1200,
  };
}

// ==============
// Funcion Navegacion: permite regresar desde creditos a la pantalla anterior.
// ==============
export function useLandingCreditsNavigation() {
  const router = useRouter();

  function volver() {
    router.back();
  }

  return {
    volver,
  };
}

// ==============
// Funcion Creditos: agrupa los hooks necesarios por la pantalla de creditos.
// ==============
export function useLandingCredits() {
  const responsive = useLandingCreditsResponsive();
  const navegacion = useLandingCreditsNavigation();

  return {
    ...responsive,
    ...navegacion,
  };
}
