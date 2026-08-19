/**
 * ============================================================
 * COMPONENTE: BadgeEstado
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado que reutiliza elementos de shared/components.
 * - Renderizar la etiqueta de estado de un ticket consumiendo el componente Badge.
 *
 * @dependencies - Badge.jsx (shared/components), mantEquipoStyles.js (styles)
 * @validations  - Mapea variante y estilos según estado ("en_espera", "en_mantenimiento", "Terminado").
 * @navigation   - Ninguna
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
