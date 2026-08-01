/**
 * ============================================================
 * COMPONENTE: MantenimientoEquipoSelect
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Renderiza el selector de equipos (máquinas) para el formulario de tickets,
 *   excluyendo el equipo seleccionado actual de las opciones disponibles y
 *   utilizando el componente Select compartido de shared.
 * 
 * DATOS / PROPS:
 * - value: string (ID del equipo seleccionado)
 * - onChange: function (Callback invocado al seleccionar un equipo, recibe el objeto del equipo)
 * - error: boolean (Indica si hay un error de validación)
 * 
 * VALIDACIONES / REGLAS:
 * - Obtiene los equipos disponibles de EQUIPOS_MOCK.
 * - Filtra las opciones para no incluir el equipoId seleccionado.
 * 
 * NAVEGACIÓN:
 * - Ninguna.
 * 
 * DEPENDENCIAS:
 * - Select de shared
 * - equiposService de services
 * - TEXTOS_MODAL_AGREGAR de mantEquipoMensajes
 * - COLORS de theme, styles de mantEquipoStyles
 * ============================================================
 */

import React, { useState, useEffect } from "react";
import Select from "../../../shared/components/Select.jsx";
import { equiposService } from "../services/equiposService.js";
import { TEXTOS_MODAL_AGREGAR } from "../constants/mantEquipoMensajes.js";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/mantEquipoStyles.js";

export default function MantenimientoEquipoSelect({ value, onChange, error }) {
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    equiposService.getEquipos().then(data => {
      setEquipos(data || []);
    });
  }, []);

  // Filtrar el equipo actual de las opciones y mapearlas
  const opcionesEquipos = equipos
    .filter(e => e.id !== value)
    .map(e => ({
      label: `${e.nombre} (${e.serie})`,
      value: e.id
    }));

  const handleSelect = (id) => {
    const eq = equipos.find(e => e.id === id);
    if (eq && onChange) {
      onChange(eq);
    }
  };

  return (
    <Select
      label={TEXTOS_MODAL_AGREGAR.labelEquipo}
      value={value}
      options={opcionesEquipos}
      onChange={handleSelect}
      placeholder={TEXTOS_MODAL_AGREGAR.placeholderEquipo}
      containerStyle={{ marginBottom: 12 }}
      selectStyle={[
        styles.comboInput,
        { minHeight: 45 },
        error && { borderColor: COLORS.error }
      ]}
      labelStyle={styles.comboLabel}
      showsVerticalScrollIndicator={false}
    />
  );
}
