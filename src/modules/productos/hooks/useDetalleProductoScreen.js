/**
 * ============================================================
 * HOOK: USEDETALLEPRODUCTO
 * ============================================================
 * Módulo: Productos
 *
 * Maneja la lógica de la pantalla de detalle de un producto.
 *
 * FUNCIONALIDAD:
 * 1. Obtiene el producto por id desde InventarioService.
 * 2. Calcula si el producto tiene stock bajo (cantidad < stock mínimo).
 * 3. Resuelve el color de la categoría para pintar el badge.
 * 4. Formatea precio unitario y valor total en stock en colones (₡).
 * 5. Controla la apertura/cierre del modal de confirmación de eliminar.
 * 6. Expone la navegación hacia Editar y hacia atrás (Inventarios).
 *
 * IMPORTANTE:
 * - Si no existe un producto con ese id, "producto" llega null 
 * - confirmarEliminar() borra el producto de forma inmediata al
 *   confirmar (no hay deshacer).
 * ============================================================
 */

import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProductoById, deleteProducto } from "../../inventarios/services/InventarioService";

import { colorCategoria, colorCategoriaDefault } from "../styles/DetalleProductScreenStyles";

export function useDetalleProducto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const productoActual = getProductoById(id);
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [eliminado, setEliminado] = useState(false);
  const [productoEliminado, setProductoEliminado] = useState(null);

  // Mientras se muestra el alert de "eliminado", el producto ya no existe
  // en el store (deleteProducto lo borra de verdad). Usamos la copia
  // guardada justo antes de borrar para no perder los datos en pantalla.
  const producto = productoActual || productoEliminado;

  const tieneStockBajo = producto ? producto.cantidad < producto.stockMinimo : false;
  const colores = producto ? colorCategoria[producto.categoria] || colorCategoriaDefault: colorCategoriaDefault;
  const precioFormateado = producto ? `₡${producto.precioUnidad.toLocaleString("es-CR")}` : "";
  const stockTotalFormateado = producto ? `₡${(producto.precioUnidad * producto.cantidad).toLocaleString("es-CR")}`  : "";

  function handleEditar() {
    router.replace({ pathname: "/(drawer)/inventarios/productForm", params: {productoParam: JSON.stringify(producto)}, });
  }

  function handleEliminar() {
    setModalEliminarVisible(true);
  }

  function confirmarEliminar() {
    setProductoEliminado(producto);
    deleteProducto(producto.id);
    setModalEliminarVisible(false);
    setEliminado(true);
    setTimeout(() => {
      router.replace("/(drawer)/inventarios");
    }, 900);
  }

  function handleBack() {
    router.replace("/(drawer)/inventarios");//00000000000000000000000000000000000000000000000
  }

  function handleCerrarModal() {
    setModalEliminarVisible(false);
  }

  return {
    producto,
    tieneStockBajo,
    colores,
    precioFormateado,
    stockTotalFormateado,
    modalEliminarVisible,
    eliminado,
    handleEditar,
    handleEliminar,
    confirmarEliminar,
    handleBack,
    handleCerrarModal,
  };
}
