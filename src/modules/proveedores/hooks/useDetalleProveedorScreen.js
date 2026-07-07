/**
 * ============================================================
 * HOOK DETALLE PROVEEDOR
 * ============================================================
 *
 * Logica de la pantalla de detalle de un proveedor.
 *
 * FUNCIONALIDAD:
 * 1. Busca el proveedor por id (parámetro de ruta) en proveedoresMock.
 * 2. Expone proveedor (undefined si no existe) para que la screen
 *    decida si mostrar el EmptyState o el detalle, incluyendo si
 *    muestra o no la sección de notas.
 * 
 * 3. Controla la visibilidad del modal de confirmación de eliminar
 *    (modalVisible, abrirModal, cerrarModal).
 * 
 * 4. getTipoLabel traduce el value de tipoProducto a su label legible.
 *
 * IMPORTANTE:
 * - Es solo lectura, no aplica validaciones.
 * - No navega directamente; expone datos y handlers para que la screen
 *   decida la navegación real.
 */
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { proveedoresMock, tiposProducto } from "../services/ProveedorData";

function getTipoProductoLabel(value) {
  const tipo = tiposProducto.find((t) => t.value === value);
  return tipo ? tipo.label : value;
}

function getProveedorById(id) {
  return proveedoresMock.find((p) => p.id === Number(id));
}

export function useDetalleProveedorScreen() {
  const { id } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);

  const proveedor = getProveedorById(id);

  function abrirModal() {
    setModalVisible(true);
  }

  function cerrarModal() {
    setModalVisible(false);
  }

  function getTipoLabel(value) {
    return getTipoProductoLabel(value);
  }

  return {
    proveedor,
    modalVisible,
    abrirModal,
    cerrarModal,
    getTipoLabel,
  };
}
