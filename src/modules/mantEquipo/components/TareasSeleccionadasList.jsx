/**
 * ============================================================
 * COMPONENTE: TareasSeleccionadasList
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Desplegar las tarjetas de tareas seleccionadas en los formularios de
 *   agregado y modificación, con botones "Realizado" y "Eliminar".
 *
 * @dependencies - CustomText, Button, Icon de shared/components
 *               - COLORS, ICONS de theme
 *               - obtenerTareas de tareasService
 *               - TareasSeleccionadasListStyles
 * @validations  - Toggle de realizada por tarea
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

export default function TareasSeleccionadasList({ tareasSeleccionadas, setTareasSeleccionadas }) {
  const [tareasCatalog, setTareasCatalog] = useState([]);

  useEffect(() => {
    obtenerTareas().then(data => setTareasCatalog(data || []));
  }, []);

  if (tareasSeleccionadas.length === 0) return null;

  return (
    <View style={styles.listContainer}>
      {tareasSeleccionadas.map((t, idx) => {
        const itemKey = String(t.value || t.tareaId || t.id || idx);
        return (
          <View key={itemKey} style={styles.tareaCard}>
            <View style={styles.infoCol}>
              <CustomText style={styles.nombreText}>
                {t.nombre || t.label}
              </CustomText>
              {t.categoria && (
                <CustomText style={styles.categoriaText}>
                  Categoría: {t.categoria === 'preventivo' || t.categoria === 'Preventivo' ? 'Preventivo' : 'Correctivo'}
                </CustomText>
              )}
              {t.duracionEstimada !== undefined && t.duracionEstimada > 0 && (
                <CustomText style={styles.duracionText}>
                  Duración estimada: {t.duracionEstimada} hrs
                </CustomText>
              )}
              {t.descripcion && (
                <CustomText style={styles.descripcionText}>
                  {t.descripcion}
                </CustomText>
              )}
            </View>
            <View style={styles.accionesCol}>
              <Button
                variant="outline"
                onPress={() => {
                  setTareasSeleccionadas(prev =>
                    prev.map(x => String(x.value || x.tareaId || x.id) === itemKey ? { ...x, realizada: !x.realizada } : x)
                  );
                }}
                style={[
                  styles.btnAccion,
                  t.realizada ? styles.btnRealizado : styles.btnPendiente,
                ]}
              >
                <Icon icon={t.realizada ? ICONS.check : ICONS.clock} size={12} color={t.realizada ? COLORS.success : COLORS.textTertiary} />
                <CustomText style={t.realizada ? styles.textRealizado : styles.textPendiente}>
                  {t.realizada ? "Realizado" : "Pendiente"}
                </CustomText>
              </Button>

              <Button
                variant="outline"
                onPress={() => {
                  setTareasSeleccionadas(prev => prev.filter(x => String(x.value || x.tareaId || x.id) !== itemKey));
                }}
                style={[styles.btnAccion, styles.btnEliminar]}
              >
                <Icon icon={ICONS.delete} size={12} color={COLORS.error} />
                <CustomText style={styles.textEliminar}>
                  Eliminar
                </CustomText>
              </Button>
            </View>
          </View>
        );
      })}
    </View>
  );
}
