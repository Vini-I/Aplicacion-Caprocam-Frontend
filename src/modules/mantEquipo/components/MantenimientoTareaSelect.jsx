/**
 * ============================================================
 * COMPONENTE: MantenimientoTareaSelect
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Carga el catálogo de tareas desde el backend (GET /tareas).
 * - Renderiza el selector excluyendo las tareas ya asignadas al ticket.
 * - Muestra loading mientras carga y mensaje si no hay tareas disponibles.
 *
 * @dependencies - Select, CustomText de shared/components
 *               - obtenerTareas de tareasService
 *               - MantenimientoTareaSelectStyles, mantEquipoStyles
 *               - COLORS de theme/colors
 * @validations  - Al menos una tarea debe seleccionarse (prop error)
 * @navigation   - Ninguna
 */

import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Spinner from "../../../shared/components/Spinner.jsx";
import Select from "../../../shared/components/Select.jsx";
import CustomText from "../../../shared/components/Text.jsx";
import { obtenerTareas, obtenerCatalogoTareas } from "../services/tareasService.js";
import { TEXTOS_MODAL_AGREGAR } from "../constants/mantEquipoMensajes.js";
import { styles as sharedStyles } from "../styles/mantEquipoStyles.js";
import { styles } from "../styles/MantenimientoTareaSelectStyles.js";

export default function MantenimientoTareaSelect({ tareasSeleccionadas = [], onAgregarTarea, error }) {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    setCargando(true);

    async function cargarTareas() {
      try {
        let list = await obtenerTareas();
        if ((!Array.isArray(list) || list.length === 0) && obtenerCatalogoTareas) {
          const cat = await obtenerCatalogoTareas();
          if (Array.isArray(cat) && cat.length > 0) {
            list = cat;
          }
        }
        if (activo) {
          setTareas(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.warn("MantenimientoTareaSelect: error al cargar tareas:", err?.message || err);
        if (activo) {
          setTareas([]);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarTareas();

    return () => {
      activo = false;
    };
  }, []);

  const safeSeleccionadas = Array.isArray(tareasSeleccionadas) ? tareasSeleccionadas : [];

  const idsSeleccionados = new Set(
    safeSeleccionadas.map(x =>
      String(x.tareaId || x.value || x.id || '')
    ).filter(Boolean)
  );

  const opcionesTareas = tareas
    .map(t => {
      const idVal = t.id ?? t.value ?? t.tareaId ?? t.codigoTarea;
      const labelVal = t.nombre ?? t.label ?? t.nombreTarea ?? `Tarea ${idVal}`;
      return {
        ...t,
        id: idVal,
        nombre: labelVal,
        label: labelVal,
        value: String(idVal),
      };
    })
    .filter(t => t.id !== undefined && t.id !== null && !idsSeleccionados.has(String(t.id)))
    .map(t => ({
      label: t.label,
      value: t.value,
    }));

  const handleSelect = (val) => {
    if (!val) return;
    const taskObj = tareas.find(t => String(t.id ?? t.value ?? t.tareaId ?? t.codigoTarea) === String(val));
    if (taskObj && onAgregarTarea) {
      onAgregarTarea(taskObj);
    }
  };

  if (cargando) {
    return (
      <View style={styles.loadingRow}>
        <Spinner size="small" />
        <CustomText style={styles.loadingText}>
          Cargando tareas...
        </CustomText>
      </View>
    );
  }

  return (
    <Select
      label={TEXTOS_MODAL_AGREGAR.labelTarea}
      value=""
      options={opcionesTareas}
      onChange={handleSelect}
      placeholder={
        cargando
          ? "Cargando tareas..."
          : (tareas.length === 0
            ? "No hay tareas en el sistema"
            : (opcionesTareas.length === 0
              ? "Todas las tareas han sido agregadas"
              : "Seleccione una tarea..."))
      }
      containerStyle={styles.selectContainer}
      selectStyle={[
        sharedStyles.comboInput,
        sharedStyles.selectMinHeight,
        error && styles.selectError
      ]}
      labelStyle={sharedStyles.comboLabel}
      showsVerticalScrollIndicator={false}
    />
  );
}
