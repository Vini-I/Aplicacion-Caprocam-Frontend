import { useWindowDimensions } from "react-native";
import { useState } from "react";

export function useFincaScreen() {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const [ModalVisible, setModalVisible] = useState(false);
  const [FincaNombreSeleccionada, setFincaNombreSeleccionada] = useState(null);

  function abrirModalEliminar(Finca) {
    setFincaNombreSeleccionada(Finca.nombre);
    setModalVisible(true);
  }

  function cancelarEliminar() {
    setModalVisible(false);
    setFincaNombreSeleccionada(null);
  }

  function confirmarEliminar() {
    console.log("Eliminando finca:", FincaNombreSeleccionada);
    setModalVisible(false);
    setFincaNombreSeleccionada(null);
  }
  return {
    width,
    isCompact,
    ModalVisible,
    FincaNombreSeleccionada,
    setModalVisible,
    setFincaNombreSeleccionada,
    abrirModalEliminar,
    setModalVisible,
    cancelarEliminar,
    confirmarEliminar
  };
}
