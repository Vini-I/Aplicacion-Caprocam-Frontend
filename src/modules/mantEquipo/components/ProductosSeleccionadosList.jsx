/**
 * ============================================================
 * COMPONENTE: ProductosSeleccionadosList
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Desplegar la lista de insumos/productos seleccionados con diseño 100% responsivo.
 * - Estructura en 2 filas internas por tarjeta para evitar solapamientos en dispositivos móviles:
 *   - Fila 1: Nombre/Detalles a la izquierda, Botón Eliminar a la derecha.
 *   - Fila 2: Selector de Cantidad (- / +) a la izquierda, Subtotal a la derecha.
 * 
 * DATOS / PROPS:
 * - productosSeleccionados: Array<ProductObject> (Insumos agregados actualmente)
 * - onQuitar: function (Callback para remover un producto por su ID)
 * - onCambiarCantidad: function (Callback para actualizar la cantidad de un producto)
 * ============================================================
 */

import React from "react";
import { View, Pressable, TextInput } from "react-native";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";

const ICON_MINUS = { provider: "FontAwesome6", name: "minus" };

export default function ProductosSeleccionadosList({
  productosSeleccionados = [],
  onQuitar,
  onCambiarCantidad,
}) {
  if (!productosSeleccionados || productosSeleccionados.length === 0) return null;

  return (
    <View style={{ gap: 10, marginBottom: 12 }}>
      {productosSeleccionados.map((p) => {
        const cant = parseInt(p.cantidad || 1, 10);
        const pu = parseFloat(p.precioUnidad) || 0;
        const subtotal = cant * pu;

        return (
          <View
            key={p.id}
            style={{
              backgroundColor: "#f8fafc",
              borderWidth: 1,
              borderColor: COLORS.secondary,
              borderRadius: 12,
              padding: 12,
              gap: 12,
            }}
          >
            {/* Fila 1 (Superior): Nombre / Detalles (Izquierda) y Botón Eliminar a la misma altura (Derecha) */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <CustomText style={{ fontSize: 13, fontWeight: "700", color: COLORS.textSecondary }}>
                  {p.nombre}
                </CustomText>
                <CustomText style={{ fontSize: 11, color: COLORS.textTertiary, marginTop: 2 }}>
                  Categoría: {p.categoria || "General"}
                </CustomText>
              </View>

              <Button
                variant="outline"
                onPress={() => onQuitar && onQuitar(p.id)}
                style={{
                  borderColor: COLORS.error,
                  height: 32,
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Icon icon={ICONS.delete} size={13} color={COLORS.error} />
                <CustomText style={{ color: COLORS.error, fontSize: 11, fontWeight: "600" }}>
                  Eliminar
                </CustomText>
              </Button>
            </View>

            {/* Fila 2 (Inferior): Selector de Cantidad (Izquierda) y Subtotal (Derecha) */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Selector de Cantidad */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <CustomText style={{ fontSize: 12, fontWeight: "600", color: COLORS.textSecondary }}>
                  Cantidad:
                </CustomText>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: COLORS.surface,
                    borderRadius: 8,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    gap: 4,
                  }}
                >
                  <Pressable
                    onPress={() => onCambiarCantidad && onCambiarCantidad(p.id, Math.max(1, cant - 1))}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      backgroundColor: COLORS.white,
                      borderWidth: 1,
                      borderColor: COLORS.secondary,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon icon={ICON_MINUS} size={14} color={COLORS.primary} />
                  </Pressable>

                  <TextInput
                    value={String(cant)}
                    onChangeText={(val) => onCambiarCantidad && onCambiarCantidad(p.id, val.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    style={{
                      width: 55,
                      height: 32,
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: "700",
                      color: COLORS.textSecondary,
                      backgroundColor: COLORS.white,
                      borderWidth: 1,
                      borderColor: "#e2e8f0",
                      borderRadius: 6,
                      paddingVertical: 0,
                      paddingHorizontal: 4,
                    }}
                  />

                  <Pressable
                    onPress={() => onCambiarCantidad && onCambiarCantidad(p.id, cant + 1)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      backgroundColor: COLORS.white,
                      borderWidth: 1,
                      borderColor: COLORS.secondary,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon icon={ICONS.add} size={14} color={COLORS.primary} />
                  </Pressable>
                </View>
              </View>

              {/* Subtotal */}
              <View style={{ alignItems: "flex-end" }}>
                <CustomText style={{ fontSize: 10, color: COLORS.textTertiary }}>
                  Subtotal:
                </CustomText>
                <CustomText style={{ fontSize: 13, fontWeight: "700", color: COLORS.primary }}>
                  ₡{subtotal.toLocaleString("es-CR")}
                </CustomText>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
