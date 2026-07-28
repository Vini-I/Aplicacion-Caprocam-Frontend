/**
 * ============================================================
 * COMPONENTE: TareasSeleccionadasList
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Desplegar el listado de tarjetas de tareas seleccionadas en los formularios de
 *   agregado y modificación, proveyendo los botones de "Realizado" y "Eliminar".
 * 
 * DATOS / PROPS:
 * - tareasSeleccionadas: Array<{value: string, label: string, realizada: boolean}>
 * - setTareasSeleccionadas: function (Setter reactivo del listado de tareas)
 * 
 * VALIDACIONES:
 * - Permite alternar (toggle) la propiedad de realizada sobre la tarea y removerla del arreglo.
 * 
 * NAVEGACIÓN:
 * - Ninguna.
 * 
 * DEPENDENCIAS:
 * - CustomText, Button, Icon de shared
 * - COLORS, ICONS de theme
 * - obtenerTareas de tareasService
 * ============================================================
 */

import React, { useState, useEffect } from "react";
import { View } from "react-native";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import { obtenerTareas } from "../services/tareasService.js";

export default function TareasSeleccionadasList({ tareasSeleccionadas, setTareasSeleccionadas }) {
  const [tareasCatalog, setTareasCatalog] = useState([]);

  useEffect(() => {
    obtenerTareas().then(data => setTareasCatalog(data || []));
  }, []);

  if (tareasSeleccionadas.length === 0) return null;

  return (
    <View style={{ gap: 8, marginBottom: 12 }}>
      {tareasSeleccionadas.map((t) => {
        const fullTask = tareasCatalog.find(x => x.id === t.value) || t;
        return (
          <View
            key={t.value}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: COLORS.surface,
              borderWidth: 1,
              borderColor: COLORS.secondary,
              borderRadius: 8,
              padding: 12,
            }}
          >
            <View style={{ flex: 1, marginRight: 12 }}>
              <CustomText style={{ fontSize: 13, fontWeight: "700", color: COLORS.textSecondary }}>
                {fullTask.nombre || fullTask.label}
              </CustomText>
              {fullTask.categoria && (
                <CustomText style={{ fontSize: 11, color: COLORS.textTertiary, marginTop: 2 }}>
                  Categoría: {fullTask.categoria === "preventivo" ? "Preventivo" : "Correctivo"}
                </CustomText>
              )}
              {fullTask.duracionEstimada !== undefined && (
                <CustomText style={{ fontSize: 11, color: COLORS.textTertiary, marginTop: 1 }}>
                  Duración estimada: {fullTask.duracionEstimada} hrs
                </CustomText>
              )}
              {fullTask.descripcion && (
                <CustomText style={{ fontSize: 11, color: COLORS.textTertiary, marginTop: 4, lineHeight: 16 }}>
                  {fullTask.descripcion}
                </CustomText>
              )}
            </View>
            <View style={{ gap: 6, width: 90 }}>
              <Button
                variant="outline"
                onPress={() => {
                  setTareasSeleccionadas(prev =>
                    prev.map(x => x.value === t.value ? { ...x, realizada: !x.realizada } : x)
                  );
                }}
                style={{
                  borderColor: t.realizada ? COLORS.success : COLORS.textTertiary,
                  backgroundColor: t.realizada ? COLORS.successLight : "transparent",
                  width: "100%",
                  height: 32,
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                  marginTop: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4
                }}
              >
                <Icon icon={t.realizada ? ICONS.check : ICONS.clock} size={12} color={t.realizada ? COLORS.success : COLORS.textTertiary} />
                <CustomText style={{ color: t.realizada ? COLORS.success : COLORS.textTertiary, fontSize: 11, fontWeight: "600" }}>
                  {t.realizada ? "Realizado" : "Pendiente"}
                </CustomText>
              </Button>

              <Button
                variant="outline"
                onPress={() => {
                  setTareasSeleccionadas(prev => prev.filter(x => x.value !== t.value));
                }}
                style={{
                  borderColor: COLORS.error,
                  width: "100%",
                  height: 32,
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                  marginTop: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4
                }}
              >
                <Icon icon={ICONS.delete} size={12} color={COLORS.error} />
                <CustomText style={{ color: COLORS.error, fontSize: 11, fontWeight: "600" }}>
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
