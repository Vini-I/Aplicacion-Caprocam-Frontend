/**
 * ============================================================
 * HOOK DETALLE PROVEEDOR
 * ============================================================
 *
 * Logica de la pantalla de detalle de un proveedor.
 *
 * FUNCIONALIDAD:
 * 1. Busca el proveedor por id (parámetro de ruta) en el backend
 *    (getProveedorById).
 * 
 * 2. Expone proveedor (undefined si no existe o aún no cargó) para
 *    que la screen decida si mostrar el EmptyState o el detalle,
 *    incluyendo si muestra o no la sección de notas.
 * 
 * 3. Controla la visibilidad del modal de confirmación de eliminar
 *    (modalVisible, abrirModal, cerrarModal) y expone confirmarEliminar,
 *    que elimina realmente el proveedor contra el backend
 *    (eliminarProveedor).
 * 
 * 4. getTipoLabel traduce el value de tipoProducto a su label legible.
 *
 * 5. Expone cargando y error para que la screen pueda mostrar el
 *    estado de la petición.
 *
 * IMPORTANTE:
 * - No aplica validaciones.
 * - No navega directamente; expone datos y handlers para que la screen
 *   decida la navegación real.
 */
import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  getProveedorById,
  eliminarProveedor,
  getTipoProductoLabel,
} from "../services/proveedor.service";

export function useDetalleProveedorScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [proveedor, setProveedor] = useState(undefined);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarProveedor = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const data = await getProveedorById(id);

      setProveedor(data);
    } catch (err) {
      setProveedor(undefined);
      setError("No fue posible cargar el proveedor.");
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargarProveedor();

    const unsubscribe = navigation.addListener("focus", () => {
      cargarProveedor();
    });
    return unsubscribe;
  }, [navigation, cargarProveedor]);

  function abrirModal() {
    setModalVisible(true);
  }

  function cerrarModal() {
    setModalVisible(false);
  }

  async function confirmarEliminar() {
    try {
      await eliminarProveedor(id);
      setModalVisible(false);
    } catch (err) {
      setModalVisible(false);
      setError("No fue posible eliminar el proveedor.");
    }
  }

  function getTipoLabel(value) {
    return getTipoProductoLabel(value);
  }

  return {
    proveedor,
    modalVisible,
    abrirModal,
    cerrarModal,
    confirmarEliminar,
    getTipoLabel,
    cargando,
    error,
  };
}