/**
 * ============================================================
 * HOOK DE PANTALLA DE FINCAS
 * ============================================================
 *
 * Gestiona la lógica principal de la pantalla donde se muestran
 * las fincas registradas, controlando la información obtenida del
 * contexto y las acciones disponibles para el usuario.
 *
 * Funcionalidad:
 * - Obtiene el listado de fincas desde el contexto global.
 * - Controla las alertas generadas por las acciones del módulo.
 * - Administra el modal de confirmación para eliminar fincas.
 * - Guarda temporalmente la finca seleccionada para eliminar.
 * - Adapta el comportamiento visual según el tamaño de pantalla.
 */
import { useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useFinca } from "../context/FincaContext.js";

export function useFincaScreen() {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;

  const { 
    fincas, 
    alert, 
    eliminarFinca 
  } = useFinca();
  const [ModalVisible, setModalVisible] = useState(false);
  const [FincaNombreSeleccionada, setFincaNombreSeleccionada] = useState(null);
  const [FincaCodigoInternoSeleccionada, setFincaCodigoInternoSeleccionada] =
    useState(null);

  function abrirModalEliminar(Finca) {
    setFincaCodigoInternoSeleccionada(Finca.codigoInterno);
    setFincaNombreSeleccionada(Finca.nombre);
    setModalVisible(true);
  }

  function cancelarEliminar() {
    setModalVisible(false);
    setFincaCodigoInternoSeleccionada(null);
    setFincaNombreSeleccionada(null);
  }

  function confirmarEliminar() {
    eliminarFinca(FincaCodigoInternoSeleccionada);
    setModalVisible(false);
    setFincaCodigoInternoSeleccionada(null);
    setFincaNombreSeleccionada(null);
  }

  return {
    fincas,
    alert,
    isCompact,
    ModalVisible,
    FincaNombreSeleccionada,
    
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
