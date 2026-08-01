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

import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { productoService, mapProducto } from "../services/producto.service";
import { getProveedorPorId } from "../services/proveedoresLookup";
import { useError } from "../../../shared/context/ErrorContext";

import { colorCategoria, colorCategoriaDefault } from "../styles/DetalleProductScreenStyles";

export function useDetalleProducto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { mostrarError } = useError();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [eliminado, setEliminado] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  // Carga el producto activo desde la API por su id, y resuelve el
  // nombre real del proveedor a partir de su proveedorId.
  const cargarProducto = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await productoService.getProductoPorId(id);
      const productoMapeado = mapProducto(data);

      if (productoMapeado?.proveedorId) {
        try {
          const proveedor = await getProveedorPorId(productoMapeado.proveedorId);
          productoMapeado.proveedor = proveedor?.nombre ?? "Sin proveedor asignado";
        } catch {
          // Si /proveedores no está disponible, no bloqueamos el
          // detalle del producto por eso -- solo se muestra vacío.
          productoMapeado.proveedor = "";
        }
      } else if (productoMapeado) {
        productoMapeado.proveedor = "Sin proveedor asignado";
      }

      setProducto(productoMapeado);
    } catch (err) {
      setProducto(null);
      setError("No se pudo cargar el producto.");
      mostrarError(err);
    } finally {
      setCargando(false);
    }
  }, [id, mostrarError]);

  useEffect(() => {
    if (id) cargarProducto();
  }, [id, cargarProducto]);

  const tieneStockBajo = producto ? producto.cantidad < producto.stockMinimo : false;
  const colores = producto ? colorCategoria[producto.categoria] || colorCategoriaDefault : colorCategoriaDefault;
  const precioFormateado = producto ? `₡${producto.precioUnidad.toLocaleString("es-CR")}` : "";
  const stockTotalFormateado = producto ? `₡${(producto.precioUnidad * producto.cantidad).toLocaleString("es-CR")}` : "";

  function handleEditar() {
    router.replace({ pathname: "/(drawer)/inventarios/editarProducto", params: { productoParam: JSON.stringify(producto) } });
  }

  function handleEliminar() {
    setModalEliminarVisible(true);
  }

  // Confirma la eliminación: desactiva el producto en el back y vuelve al listado
  async function confirmarEliminar() {
    if (!producto) return;
    setEliminando(true);
    setError(null);
    try {
      await productoService.desactivarProducto(producto.id);
      setModalEliminarVisible(false);
      setEliminado(true);
      setTimeout(() => {
        router.replace("/(drawer)/inventarios");
      }, 900);
    } catch (err) {
      setModalEliminarVisible(false);
      setError("No se pudo eliminar el producto. Intenta de nuevo.");
      mostrarError(err);
    } finally {
      setEliminando(false);
    }
  }

  function handleBack() {
    router.replace("/(drawer)/inventarios");
  }

  function handleCerrarModal() {
    setModalEliminarVisible(false);
  }

  return {
    producto,
    cargando,
    error,
    tieneStockBajo,
    colores,
    precioFormateado,
    stockTotalFormateado,
    modalEliminarVisible,
    eliminado,
    eliminando,
    handleEditar,
    handleEliminar,
    confirmarEliminar,
    handleBack,
    handleCerrarModal,
  };
}
