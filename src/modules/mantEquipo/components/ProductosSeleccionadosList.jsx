/**
 * ============================================================
 * COMPONENTE: ProductosSeleccionadosList
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado que reutiliza elementos de shared/components.
 * - Desplegar la lista de insumos/productos seleccionados con diseño responsivo.
 *
 * @dependencies - Text.jsx, Button.jsx, Icons.jsx (shared/components), ProductosSeleccionadosListStyles.js (styles)
 * @validations  - Cantidad mínima: 1.
 * @navigation   - Ninguna
 */

import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import { styles } from "../styles/ProductosSeleccionadosListStyles.js";

const ICON_MINUS = { provider: "FontAwesome6", name: "minus" };

export default function ProductosSeleccionadosList({
  productosSeleccionados = [],
  onQuitar,
  onCambiarCantidad,
}) {
  if (!productosSeleccionados || productosSeleccionados.length === 0) return null;

  return (
    <View style={styles.listContainer}>
      {productosSeleccionados.map((p) => {
        const cant = parseInt(p.cantidad || 1, 10);
        const pu = parseFloat(p.precioUnidad) || 0;
        const subtotal = cant * pu;

        return (
          <View key={p.id} style={styles.productoCard}>
            {/* Fila 1: Nombre + Eliminar */}
            <View style={styles.fila1}>
              <View style={styles.infoCol}>
                <CustomText style={styles.nombreText}>
                  {p.nombre}
                </CustomText>
                <CustomText style={styles.categoriaText}>
                  Categoría: {p.categoria || "General"}
                </CustomText>
              </View>

              <Button
                variant="outline"
                onPress={() => onQuitar && onQuitar(p.id)}
                style={styles.btnEliminar}
              >
                <Icon icon={ICONS.delete} size={13} color={COLORS.error} />
                <CustomText style={styles.btnEliminarText}>
                  Eliminar
                </CustomText>
              </Button>
            </View>

            {/* Fila 2: Cantidad ± + Subtotal */}
            <View style={styles.fila2}>
              <View style={styles.cantidadGroup}>
                <CustomText style={styles.cantidadLabel}>
                  Cantidad:
                </CustomText>
                <View style={styles.cantidadControl}>
                  <TouchableOpacity
                    onPress={() => onCambiarCantidad && onCambiarCantidad(p.id, Math.max(1, cant - 1))}
                    activeOpacity={0.7}
                    style={styles.cantidadBtn}
                  >
                    <Icon icon={ICON_MINUS} size={14} color={COLORS.primary} />
                  </TouchableOpacity>

                  <TextInput
                    value={String(cant)}
                    onChangeText={(val) => onCambiarCantidad && onCambiarCantidad(p.id, val.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    style={styles.cantidadInput}
                  />

                  <TouchableOpacity
                    onPress={() => onCambiarCantidad && onCambiarCantidad(p.id, cant + 1)}
                    activeOpacity={0.7}
                    style={styles.cantidadBtn}
                  >
                    <Icon icon={ICONS.add} size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.subtotalCol}>
                <CustomText style={styles.subtotalLabel}>
                  Subtotal:
                </CustomText>
                <CustomText style={styles.subtotalValor}>
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
