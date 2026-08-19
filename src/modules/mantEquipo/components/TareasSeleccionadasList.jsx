/**
 * ============================================================
 * COMPONENTE: TareasSeleccionadasList
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado que reutiliza elementos de shared/components.
 * - Desplegar las tarjetas de tareas seleccionadas con botones de estado "Realizado" y "Eliminar".
 *
 * @dependencies - Text.jsx, Button.jsx, Icons.jsx (shared/components), tareasService.js (services), TareasSeleccionadasListStyles.js (styles)
 * @validations  - Toggle del estado realizada por tarea.
 * @navigation   - Ninguna
 */

import React, { useState, useEffect } from "react";
import { View } from "react-native";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import { obtenerTareas } from "../services/tareasService.js";
import { styles } from "../styles/TareasSeleccionadasListStyles.js";

export default function TareasSeleccionadasList({ tareasSeleccionadas, setTareasSeleccionadas, mostrarToggleEstado = true }) {
  const [tareasCatalog, setTareasCatalog] = useState([]);

  useEffect(() => {
    obtenerTareas().then(data => setTareasCatalog(data || []));
  }, []);

  if (tareasSeleccionadas.length === 0) return null;

  const renderTareaCard = (t, idx) => {
    const itemKey = String(t.value || t.tareaId || t.id || idx);
    return (
      <View key={itemKey} style={styles.tareaCard}>
        <View style={styles.infoCol}>
          <CustomText style={styles.nombreText}>Título: {t.nombre || t.label}</CustomText>
          {t.categoria ? (
            <CustomText style={styles.categoriaText}>Categoría: {t.categoria === 'preventivo' || t.categoria === 'Preventivo' ? 'Preventivo' : 'Correctivo'}</CustomText>
          ) : null}
          {t.duracionEstimada !== undefined && t.duracionEstimada > 0 ? (
            <CustomText style={styles.duracionText}>Duración estimada: {t.duracionEstimada} hrs</CustomText>
          ) : null}
          {t.descripcion ? (
            <CustomText style={styles.descripcionText}>Descripción: {t.descripcion}</CustomText>
          ) : null}
        </View>
        <View style={styles.accionesCol}>
          {mostrarToggleEstado ? (
            <Button
              variant="outline"
              onPress={() => {
                setTareasSeleccionadas(prev =>
                  prev.map(x => String(x.value || x.tareaId || x.id) === itemKey ? { ...x, realizada: !x.realizada } : x)
                );
              }}
              style={[styles.btnAccion, t.realizada ? styles.btnRealizado : styles.btnPendiente]}
            >
              <Icon icon={t.realizada ? ICONS.check : ICONS.clock} size={12} color={t.realizada ? COLORS.success : COLORS.textTertiary} />
              <CustomText style={t.realizada ? styles.textRealizado : styles.textPendiente}>{t.realizada ? "Realizado" : "Pendiente"}</CustomText>
            </Button>
          ) : null}
          <Button
            variant="outline"
            onPress={() => {
              setTareasSeleccionadas(prev => prev.filter(x => String(x.value || x.tareaId || x.id) !== itemKey));
            }}
            style={[styles.btnAccion, styles.btnEliminar]}
          >
            <Icon icon={ICONS.delete} size={12} color={COLORS.error} />
            <CustomText style={styles.textEliminar}>Eliminar</CustomText>
          </Button>
        </View>
      </View>
    );
  };

  return <View style={styles.listContainer}>{tareasSeleccionadas.map((t, idx) => renderTareaCard(t, idx))}</View>;
}
