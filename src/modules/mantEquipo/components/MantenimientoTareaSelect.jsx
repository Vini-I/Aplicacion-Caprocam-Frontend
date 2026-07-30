/**
 * ============================================================
 * COMPONENTE: MantenimientoTareaSelect
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Renderiza el selector de tareas del formulario de tickets utilizando el
 *   componente Select compartido de shared, excluyendo las tareas ya asignadas.
 * 
 * DATOS / PROPS:
 * - tareasSeleccionadas: Array<{value: string, label: string}> (Lista de tareas asociadas actualmente)
 * - onAgregarTarea: function (Callback al seleccionar una tarea, recibe el objeto de la tarea)
 * - error: boolean (Indica si hay un error de validación)
 * 
 * VALIDACIONES / REGLAS:
 * - Filtra las tareas disponibles de TAREAS_DEMO excluyendo las que ya están en tareasSeleccionadas.
 * 
 * NAVEGACIÓN:
 * - Ninguna.
 * 
 * DEPENDENCIAS:
 * - Select de shared
 * - obtenerTareas de tareasService
 * - TEXTOS_MODAL_AGREGAR de mantEquipoMensajes
 * - COLORS de theme, styles de mantEquipoStyles
 * ============================================================
 */

import React, { useState, useEffect } from "react";
import Select from "../../../shared/components/Select.jsx";
import { obtenerTareas } from "../services/tareasService.js";
import { TEXTOS_MODAL_AGREGAR } from "../constants/mantEquipoMensajes.js";
import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/mantEquipoStyles.js";

export default function MantenimientoTareaSelect({ tareasSeleccionadas, onAgregarTarea, error }) {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    obtenerTareas().then(data => {
      setTareas(data || []);
    });
  }, []);

  // Excluir tareas ya seleccionadas (comparando tanto por value como por id)
  const opcionesTareas = tareas
    .filter(t => !tareasSeleccionadas.some(x => x.value === t.id || x.value === t.value))
    .map(t => ({
      label: t.nombre,
      value: t.id
    }));

  const handleSelect = (val) => {
    const taskObj = tareas.find(t => t.id === val);
    if (taskObj && onAgregarTarea) {
      onAgregarTarea(taskObj);
    }
  };

  return (
    <Select
      label={TEXTOS_MODAL_AGREGAR.labelTarea}
      value=""
      options={opcionesTareas}
      onChange={handleSelect}
      placeholder="Seleccione una tarea..."
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
