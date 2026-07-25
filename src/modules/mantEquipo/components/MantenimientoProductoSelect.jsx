/**
 * ============================================================
 * COMPONENTE: MantenimientoProductoSelect
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Renderiza el selector de insumos/productos sin mostrar los precios en las opciones.
 * - Valida si el producto seleccionado tiene stock disponible.
 * - Muestra un Alert si no hay stock suficiente para agregar el producto.
 * 
 * DATOS / PROPS:
 * - productosList: Array<ProductObject> (Catálogo general de insumos)
 * - productosSeleccionados: Array<ProductObject> (Insumos agregados actualmente)
 * - onAgregarProducto: function (Callback al seleccionar un producto)
 * - alertaStock: string (Mensaje de alerta si aplica)
 * - setAlertaStock: function (Setter para limpiar o establecer alerta de stock)
 * ============================================================
 */

import React from "react";
import { View } from "react-native";
import Select from "../../../shared/components/Select.jsx";
import Alert from "../../../shared/components/Alert.jsx";
import { styles } from "../styles/mantEquipoStyles.js";

export default function MantenimientoProductoSelect({
  productosList = [],
  productosSeleccionados = [],
  onAgregarProducto,
  alertaStock = "",
  setAlertaStock,
}) {
  // Las opciones NO muestran el precio del producto
  const opcionesDisponibles = productosList
    .filter((p) => !productosSeleccionados.some((x) => x.id === p.id))
    .map((p) => ({
      label: p.nombre,
      value: String(p.id),
    }));

  const handleSelect = (val) => {
    if (!val) return;
    if (setAlertaStock) setAlertaStock("");

    const prod = productosList.find((p) => String(p.id) === String(val));
    if (!prod) return;

    // Verificar si el stock del producto es 0 o insuficiente
    const stockDisponible = prod.stockMaximo !== undefined ? prod.stockMaximo : (prod.cantidad !== undefined ? prod.cantidad : 999);

    if (stockDisponible <= 0) {
      if (setAlertaStock) {
        setAlertaStock(`El producto "${prod.nombre}" no tiene stock disponible en inventario.`);
      }
      return;
    }

    if (onAgregarProducto) {
      onAgregarProducto({ ...prod, stockMaximo: stockDisponible, cantidad: 1 });
    }
  };

  return (
    <View style={{ marginBottom: 12 }}>
      {/* Selector de productos sin precios */}
      <Select
        label="Productos utilizados"
        value=""
        options={opcionesDisponibles}
        onChange={handleSelect}
        placeholder="Seleccione productos..."
        containerStyle={{ marginBottom: alertaStock ? 4 : 0 }}
        selectStyle={[styles.comboInput, styles.selectMinHeight]}
        labelStyle={styles.comboLabel}
        showsVerticalScrollIndicator={false}
      />

      {/* Alerta de Stock insuficiente */}
      {alertaStock ? (
        <Alert
          variant="danger"
          message={alertaStock}
          style={{ marginTop: 8 }}
        />
      ) : null}
    </View>
  );
}
