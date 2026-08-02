/**
 * COMPONENTE: MantenimientoEquipoSelect
 * Renderiza el selector de equipos (máquinas) para el formulario de tickets,
 * utilizando el componente Select compartido.
 *
 * @dependencies - Select, CustomText (shared)
 *               - equiposService (services)
 *               - TEXTOS_MODAL_AGREGAR (mantEquipoMensajes), mantEquipoStyles
 * @validations  - Filtra las opciones obtenidas para no incluir el equipoId seleccionado.
 *               - Muestra Spinner de shared/components mientras realiza el fetch inicial.
 * @navigation   - N/A (componente selector).
 */

import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Spinner from "../../../shared/components/Spinner.jsx";
import Select from "../../../shared/components/Select.jsx";
import CustomText from "../../../shared/components/Text.jsx";
import { equiposService } from "../services/equiposService.js";
import { TEXTOS_MODAL_AGREGAR } from "../constants/mantEquipoMensajes.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { styles as selectStyles } from "../styles/MantenimientoTareaSelectStyles.js";

export default function MantenimientoEquipoSelect({ value, onChange, error }) {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    equiposService.getEquipos()
      .then(data => {
        setEquipos(data || []);
      })
      .catch((err) => {
        console.warn("MantenimientoEquipoSelect: error al cargar equipos:", err?.message || err);
        setEquipos([]);
      })
      .finally(() => setCargando(false));
  }, []);

  // Filtrar el equipo actual de las opciones y mapearlas
  const opcionesEquipos = equipos
    .filter(e => e.id !== value)
    .map(e => ({
      label: `${e.nombre} (${e.codigo || e.id})`,
      value: e.id
    }));

  const handleSelect = (id) => {
    const eq = equipos.find(e => String(e.id) === String(id));
    if (eq && onChange) {
      onChange(eq);
    }
  };

  if (cargando) {
    return (
      <View style={selectStyles.loadingRow}>
        <Spinner size="small" />
        <CustomText style={selectStyles.loadingText}>
          Cargando equipos...
        </CustomText>
      </View>
    );
  }

  return (
    <Select
      label={TEXTOS_MODAL_AGREGAR.labelEquipo}
      value={value}
      options={opcionesEquipos}
      onChange={handleSelect}
      placeholder={equipos.length === 0 ? "No hay equipos en el sistema" : TEXTOS_MODAL_AGREGAR.placeholderEquipo}
      containerStyle={selectStyles.selectContainer}
      selectStyle={[
        styles.comboInput,
        styles.selectMinHeight,
        error && selectStyles.selectError
      ]}
      labelStyle={styles.comboLabel}
      showsVerticalScrollIndicator={false}
    />
  );
}

