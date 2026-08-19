/**
 * useDetalleProveedorScreen.js
 * Hook para manejar la lógica de la pantalla de detalle de un proveedor.
 *
 * FUNCIONALIDAD:
 * - Carga y expone los datos del proveedor seleccionado.
 * - Maneja el estado del modal de confirmación para eliminar.
 *
 * REGLAS IMPORTANTES:
 * - Se comunica con ProveedorContext para eliminar o buscar.
 * - No maneja routing: useRouter vive en el archivo de ruta (app/(drawer)/
 *   proveedores/detalleProveedor.jsx), que arma los handlers de navegación
 *   y los pasa como props (onEliminado) al screen, igual que en finca.
 *
 * @dependencies - React, expo-router (useLocalSearchParams), ProveedorContext, proveedor.service
 * @validations - N/A
 * @navigation - N/A (delegado a la ruta vía prop onEliminado)
 */
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useProveedor } from "../context/ProveedorContext";
import { getTipoProductoLabel } from "../services/proveedor.service";

export function useDetalleProveedorScreen({ onEliminado } = {}) {
  const { id } = useLocalSearchParams();
  const { buscarProveedor, eliminarProveedor } = useProveedor();

  const [proveedor, setProveedor] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const eliminando = useRef(false);

  const cargarProveedor = useCallback(async () => {
    if (!id || eliminando.current) return;
    try {
      setCargando(true);
      setError("");
      const data = await buscarProveedor(id);
      setProveedor(data);
    } catch (err) {
      setProveedor(undefined);
      setError("No fue posible cargar el proveedor.");
    } finally {
      setCargando(false);
    }
  }, [id, buscarProveedor]);

  useFocusEffect(
    useCallback(() => {
      cargarProveedor();
    }, [cargarProveedor])
  );

  function abrirModal() {
    setModalVisible(true);
  }

  function cerrarModal() {
    setModalVisible(false);
  }

  async function confirmarEliminar() {
    try {
      eliminando.current = true;
      await eliminarProveedor(id);
      setModalVisible(false);
      onEliminado?.();
    } catch (err) {
      eliminando.current = false;
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
