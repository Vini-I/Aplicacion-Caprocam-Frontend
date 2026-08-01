/**
 * ============================================================
 * HOOK DE MODAL DE ELIMINACIÓN
 * ============================================================
 *
 * Centraliza la lógica del modal de confirmación para eliminar
 * un registro, sin importar la entidad (finca, estanque,
 * alimentación, etc.).
 *
 * Funcionalidad:
 * - Controla la visibilidad del modal de confirmación.
 * - Guarda el registro seleccionado para eliminar.
 * - Ejecuta la función de eliminación recibida por parámetro.
 * - Maneja el estado de carga mientras se elimina.
 * - Cierra el modal automáticamente al finalizar o cancelar.
 *
 * Uso:
 * const {
 *   modalVisible,
 *   itemSeleccionado,
 *   loadingEliminar,
 *   abrirModalEliminar,
 *   cancelarEliminar,
 *   confirmarEliminar,
 * } = useModalEliminar((id) => alimentacionService.deleteById(id));
 */
import { useState } from "react";

export default function useModalEliminar(onEliminar) {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [loadingEliminar, setLoadingEliminar] = useState(false);

  function abrirModalEliminar(item) {
    setItemSeleccionado(item);
    setModalVisible(true);
  }

  function cancelarEliminar() {
    setModalVisible(false);
    setItemSeleccionado(null);
  }

  async function confirmarEliminar() {
    if (!itemSeleccionado) return;

    try {
      setLoadingEliminar(true);
      await onEliminar(itemSeleccionado.id);
    } finally {
      setLoadingEliminar(false);
      setModalVisible(false);
      setItemSeleccionado(null);
    }
  }

  return {
    modalVisible,
    itemSeleccionado,
    loadingEliminar,

    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}