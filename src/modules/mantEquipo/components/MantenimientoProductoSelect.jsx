/**
 * ============================================================
 * COMPONENTE: MantenimientoProductoSelect
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado que reutiliza elementos de shared/components.
 * - Obtener el catálogo de productos del inventario y renderizar el selector validando stock.
 *
 * @dependencies - Select.jsx, Alert.jsx (shared/components), InventarioService.js (services), mantEquipoStyles.js (styles)
 * @validations  - Valida stock disponible (> 0) antes de agregar un producto.
 * @navigation   - Ninguna
 */

import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Select from "../../../shared/components/Select.jsx";
import Alert from "../../../shared/components/Alert.jsx";
import { getProductosInventario } from "../../inventarios/services/InventarioService.js";
import { styles } from "../styles/mantEquipoStyles.js";

export default function MantenimientoProductoSelect({
  productosSeleccionados = [],
  onAgregarProducto,
  alertaStock = "",
  setAlertaStock,
}) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    getProductosInventario()
      .then((data) => {
        const raw = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        const lista = raw.map((p) => ({
          ...p,
          id: p.id ?? p.producto_id ?? p.productoId,
          nombre: p.nombre ?? p.nombreProducto ?? p.producto?.nombre ?? `Producto ${p.id}`,
          precioUnidad: p.precioUnidad ?? p.precio_unidad ?? p.precio ?? 0,
          stockMaximo: p.cantidad ?? p.stock ?? 999,
        }));
        setProductos(lista);
      })
      .catch((err) => {
        console.warn("MantenimientoProductoSelect: error al cargar inventario:", err?.message || err);
        setProductos([]);
      })
      .finally(() => setCargando(false));
  }, []);

  const safeSeleccionados = Array.isArray(productosSeleccionados) ? productosSeleccionados : [];

  const opcionesDisponibles = productos
    .filter((p) => !safeSeleccionados.some((x) => String(x.id) === String(p.id)))
    .map((p) => ({
      label: p.nombre,
      value: String(p.id),
    }));

  const handleSelect = (val) => {
    if (!val) return;
    if (setAlertaStock) setAlertaStock("");

    const prod = productos.find((p) => String(p.id) === String(val));
    if (!prod) return;

    const stockDisponible = prod.stockMaximo !== undefined
      ? prod.stockMaximo
      : (prod.cantidad !== undefined ? prod.cantidad : 999);

    if (stockDisponible <= 0) {
      if (setAlertaStock) {
        setAlertaStock(`El producto "${prod.nombre}" no tiene stock disponible en inventario.`);
      }
      return;
    }

    if (onAgregarProducto) {
      const realProdId = prod.productoId || prod.producto_id || prod.id;
      onAgregarProducto({
        ...prod,
        id: realProdId,
        productoId: realProdId,
        stockMaximo: stockDisponible,
        cantidad: 1,
      });
    }
  };

  return (
    <View style={styles.productoSelectWrapper}>
      <Select
        label="Productos utilizados"
        value=""
        options={opcionesDisponibles}
        onChange={handleSelect}
        placeholder={
          cargando
            ? "Cargando productos..."
            : (productos.length === 0
              ? "No hay productos en el sistema"
              : (opcionesDisponibles.length === 0
                ? "Todos los productos han sido agregados"
                : "Seleccione productos..."))
        }
        containerStyle={alertaStock ? styles.productoSelectContainerWithAlert : undefined}
        selectStyle={[styles.comboInput, styles.selectMinHeight]}
        labelStyle={styles.comboLabel}
        showsVerticalScrollIndicator={false}
      />

      {alertaStock ? (
        <Alert
          variant="danger"
          message={alertaStock}
          style={styles.alertTopMargin}
        />
      ) : null}
    </View>
  );
}
