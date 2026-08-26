/**
 * ============================================================
 * COMPONENTE: MantenimientoProductoSelect
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Combo de "barra de búsqueda unida a un select": un solo campo de texto
 *   que funciona como buscador (por nombre, letras o números) y que al
 *   enfocarse o escribir despliega, justo debajo, una lista tipo select
 *   con las opciones que coinciden. La lista muestra un máximo de 6
 *   productos visibles; si hay más, se activa el scroll dentro de ella.
 * - Obtener el catálogo de productos del grupo de datos del usuario y validar stock antes
 *   de agregar un producto a la lista de seleccionados.
 *
 * @dependencies - Alert, CustomText, Input, Button (shared/components)
 *               - getProductosCatalogo (services), mantEquipoStyles.js (styles)
 * @validations  - Valida stock disponible (> 0) antes de agregar un producto.
 * @navigation   - Ninguna
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, ScrollView } from "react-native";
import Alert from "../../../shared/components/Alert.jsx";
import CustomText from "../../../shared/components/Text.jsx";
import Input from "../../../shared/components/Input.jsx";
import Button from "../../../shared/components/Button.jsx";
import { COLORS } from "../../../theme/colors.js";
import { getProductosCatalogo } from "../services/mantEquipoService.js";
import { styles } from "../styles/mantEquipoStyles.js";

// Cantidad máxima de opciones visibles antes de que la lista active su scroll.
const MAX_OPCIONES_VISIBLES = 6;

export default function MantenimientoProductoSelect({
  productosSeleccionados = [],
  onAgregarProducto,
  alertaStock = "",
  setAlertaStock,
}) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const cierreTimeoutRef = useRef(null);

  useEffect(() => {
    setCargando(true);
    getProductosCatalogo()
      .then((data) => {
        const raw = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        const lista = raw
          .filter((p) => {
            const cat = String(p.categoria ?? "")
              .trim()
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            return cat === "equipos" || cat === "equipo" || cat === "mantenimiento";
          })
          .map((p) => {
            const prodId = String(p.id ?? p.producto_id ?? p.productoId ?? "");
            const price = Number(p.precioUnidad ?? p.precio_unidad ?? p.precio) || 0;
            return {
              ...p,
              id: prodId,
              productoId: prodId,
              nombre: p.nombre ?? p.nombreProducto ?? p.producto?.nombre ?? `Producto ${prodId}`,
              precioUnidad: price,
              costoUnitario: price,
              stockMaximo: p.cantidad !== undefined ? Number(p.cantidad) : (p.stock !== undefined ? Number(p.stock) : 999),
            };
          });
        setProductos(lista);
      })
      .catch((err) => {
        console.warn("MantenimientoProductoSelect: error al cargar inventario:", err?.message || err);
        setProductos([]);
      })
      .finally(() => setCargando(false));
  }, []);

  // Limpia el timeout de cierre pendiente si el componente se desmonta.
  useEffect(() => {
    return () => {
      if (cierreTimeoutRef.current) clearTimeout(cierreTimeoutRef.current);
    };
  }, []);

  const safeSeleccionados = Array.isArray(productosSeleccionados) ? productosSeleccionados : [];

  // ── Filtrado por búsqueda (letras o números) sobre el catálogo ─────
  const productosFiltrados = useMemo(() => {
    const disponibles = productos.filter(
      (p) => !safeSeleccionados.some((x) => String(x.productoId || x.id) === String(p.productoId || p.id))
    );
    const q = busquedaProducto.trim().toLowerCase();
    if (!q) return disponibles;
    return disponibles.filter((p) => String(p.nombre ?? "").toLowerCase().includes(q));
  }, [productos, safeSeleccionados, busquedaProducto]);

  const opcionesDisponibles = productosFiltrados.map((p) => {
    const stockVal = p.stockMaximo !== undefined ? p.stockMaximo : (p.cantidad !== undefined ? Number(p.cantidad) : 999);
    const stockText = stockVal < 999 ? ` (Stock: ${stockVal})` : '';
    return {
      label: `${p.nombre}${stockText}`,
      value: String(p.productoId || p.id),
      stockMaximo: stockVal,
    };
  });

  const hayResultados = opcionesDisponibles.length > 0;
  const puedeBuscar = !cargando && productos.length > 0;

  // ── Apertura / cierre de la lista ───────────────────────────────
  const abrirOpciones = () => {
    if (cierreTimeoutRef.current) {
      clearTimeout(cierreTimeoutRef.current);
      cierreTimeoutRef.current = null;
    }
    setMostrarOpciones(true);
  };

  // Retraso para que el onPress / touch de una opción alcance a registrarse
  // antes de que el blur del input cierre la lista desplegable.
  const cerrarOpcionesConRetraso = () => {
    cierreTimeoutRef.current = setTimeout(() => setMostrarOpciones(false), 350);
  };

  const handleSelect = (val) => {
    if (!val) return;
    if (setAlertaStock) setAlertaStock("");

    const prod = productos.find((p) => String(p.productoId || p.id) === String(val));
    if (!prod) return;

    const stockDisponible = prod.stockMaximo !== undefined ? prod.stockMaximo : 999;

    if (stockDisponible <= 0) {
      if (setAlertaStock) {
        setAlertaStock(`El producto "${prod.nombre}" no tiene stock disponible en inventario.`);
      }
      return;
    }

    if (onAgregarProducto) {
      const realProdId = String(prod.productoId || prod.producto_id || prod.id);
      onAgregarProducto({
        ...prod,
        id: realProdId,
        productoId: realProdId,
        stockMaximo: stockDisponible,
        cantidad: 1,
      });
    }

    // Limpiar la búsqueda y cerrar la lista tras agregar.
    setBusquedaProducto("");
    setMostrarOpciones(false);
  };

  const placeholderInput = cargando
    ? "Cargando productos..."
    : (productos.length === 0
      ? "No hay productos en el sistema"
      : "Seleccione productos...");

  const mensajeVacio = cargando
    ? "Cargando productos..."
    : (productos.length === 0
      ? "No hay productos en el sistema"
      : "No hay productos que coincidan");

  return (
    <View style={styles.productoSelectWrapper}>
      <CustomText style={styles.comboLabel}>Productos utilizados</CustomText>

      <View style={styles.productoComboWrapper}>
        <Input
          value={busquedaProducto}
          onChangeText={(texto) => {
            setBusquedaProducto(texto);
            abrirOpciones();
          }}
          onFocus={abrirOpciones}
          onBlur={cerrarOpcionesConRetraso}
          placeholder={placeholderInput}
          editable={puedeBuscar}
          containerStyle={{ marginBottom: 0 }}
          style={styles.productoComboInput}
        />
        <CustomText style={styles.productoComboArrow} pointerEvents="none">▾</CustomText>

        {mostrarOpciones && puedeBuscar && (
          <View style={styles.productoDropdown}>
            <ScrollView
              style={styles.productoDropdownScroll}
              nestedScrollEnabled
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={opcionesDisponibles.length > MAX_OPCIONES_VISIBLES}
            >
              {hayResultados ? (
                opcionesDisponibles.map((op) => (
                  <Button
                    key={op.value}
                    variant="ghost"
                    style={[styles.productoDropdownOption, { alignItems: "flex-start", marginTop: 0 }]}
                    onPress={() => handleSelect(op.value)}
                  >
                    <CustomText style={styles.productoDropdownOptionText} numberOfLines={1}>
                      {op.label}
                    </CustomText>
                  </Button>
                ))
              ) : (
                <View style={styles.productoDropdownEmpty}>
                  <CustomText style={styles.productoDropdownEmptyText}>{mensajeVacio}</CustomText>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>

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