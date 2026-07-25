/**
 * ============================================================
 * COMPONENTE: BadgeEstado
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Renderiza la etiqueta de estado de un ticket consumiendo el componente
 *   reutilizable Badge de shared/components/Badge.jsx.
 * - Aplica variantes y clases de estilo definidas centralizadamente en mantEquipoStyles.js.
 * 
 * DATOS / PROPS:
 * - estado: string ("en_espera", "en_mantenimiento", "Terminado")
 * 
 * DEPENDENCIAS:
 * - Badge de shared
 * - styles de mantEquipoStyles
 * ============================================================
 */

import React from "react";
import Badge from "../../../shared/components/Badge.jsx";
import { styles } from "../styles/mantEquipoStyles.js";

export default function BadgeEstado({ estado }) {
  let label = "En espera";
  let variant = "warning";
  let badgeStyle = styles.badgeEnEspera;
  let textStyle = styles.badgeEnEsperaText;

  if (estado === "en_mantenimiento") {
    label = "En mantenimiento";
    variant = "info";
    badgeStyle = styles.badgeEnMantenimiento;
    textStyle = styles.badgeEnMantenimientoText;
  } else if (estado === "Terminado") {
    label = "Terminado";
    variant = "success";
    badgeStyle = styles.badgeTerminado;
    textStyle = styles.badgeTerminadoText;
  }

  return (
    <Badge
      label={label}
      variant={variant}
      style={badgeStyle}
      textStyle={textStyle}
    />
  );
}
