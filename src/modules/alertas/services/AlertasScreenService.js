/**
 * ============================================================
 * SERVICE: ALERTAS SCREEN
 * ============================================================
 *
 * Funciones auxiliares de presentacion para AlertasScreen.
 * Se separan de la pantalla para mantener el componente enfocado
 * en renderizar la interfaz.
 */

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/AlertasStyle";

export function obtenerEstiloAlerta(tipo) {
  const estilos = [styles.alertItem];

  if (tipo === "critica") {
    estilos.push(styles.alertCritical);
  }

  if (tipo === "advertencia") {
    estilos.push(styles.alertWarning);
  }

  if (tipo === "info") {
    estilos.push(styles.alertInfo);
  }

  return estilos;
}

export function obtenerColorTipo(tipo) {
  let color = COLORS.primary;

  if (tipo === "critica") {
    color = COLORS.error;
  }

  if (tipo === "advertencia") {
    color = COLORS.warning;
  }

  return color;
}

export function obtenerTituloTipo(tipo) {
  let titulo = "Informativas";

  if (tipo === "critica") {
    titulo = "Criticas";
  }

  if (tipo === "advertencia") {
    titulo = "Advertencias";
  }

  return titulo;
}

export function obtenerIconoTipo(tipo) {
  let icono = ICONS.info;

  if (tipo === "critica") {
    icono = ICONS.shieldAlert;
  }

  if (tipo === "advertencia") {
    icono = ICONS.alertTriangle;
  }

  return icono;
}

export function agruparPorCategoria(alertas) {
  const grupos = {};

  alertas.forEach(function (alerta) {
    if (grupos[alerta.categoria] === undefined) {
      grupos[alerta.categoria] = [];
    }

    grupos[alerta.categoria].push(alerta);
  });

  return grupos;
}

export function obtenerEstadoInicialDropdowns() {
  return {
    critica: true,
    advertencia: true,
    info: false,
  };
}
