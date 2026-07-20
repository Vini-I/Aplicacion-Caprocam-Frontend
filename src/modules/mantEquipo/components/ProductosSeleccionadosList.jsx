/**
 * ============================================================
 * COMPONENTE: ProductosSeleccionadosList
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Renderiza la lista de insumos/productos seleccionados en el formulario
 *   de tickets de mantenimiento en forma de tarjetas, permitiendo quitarlos.
 * 
 * DATOS / PROPS:
 * - productosSeleccionados: Array<ProductObject> (Insumos agregados actualmente)
 * - onQuitar: function (Callback para remover un producto, recibe el ID del producto)
 * 
 * VALIDACIONES / REGLAS:
 * - Presenta nombre del producto, categoría, proveedor y el precio unitario.
 * - Incluye botón outline de eliminación de acuerdo con los estándares visuales.
 * 
 * NAVEGACIÓN:
 * - Ninguna.
 * 
 * DEPENDENCIAS:
 * - CustomText, Button, Icon de shared
 * - COLORS, ICONS de theme, styles de mantEquipoStyles
 * ============================================================
 */

import React from "react";
import { View } from "react-native";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";

export default function ProductosSeleccionadosList({ productosSeleccionados, onQuitar }) {
  if (!productosSeleccionados || productosSeleccionados.length === 0) return null;

  return (
    <View style={{ gap: 8, marginBottom: 12 }}>
      {productosSeleccionados.map((p) => (
        <View
          key={p.id}
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
              {p.nombre}
            </CustomText>
            <CustomText style={{ fontSize: 11, color: COLORS.textTertiary, marginTop: 2 }}>
              Categoría: {p.categoria} | Proveedor: {p.proveedor}
            </CustomText>
            <CustomText style={{ fontSize: 11, color: COLORS.textTertiary, marginTop: 1 }}>
              Precio Unitario: ₡{(p.precioUnidad || 0).toLocaleString("es-CR")}
            </CustomText>
          </View>
          <Button
            variant="outline"
            onPress={() => onQuitar(p.id)}
            style={{
              borderColor: COLORS.error,
              width: 90,
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
      ))}
    </View>
  );
}
