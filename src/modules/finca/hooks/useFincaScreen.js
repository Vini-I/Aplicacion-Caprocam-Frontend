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
import { useState, useMemo } from "react";
import { useFinca } from "../context/FincaContext.js";
import { useEstanque } from "../../estanques/context/EstanqueContext.js"

export function useFincaScreen() {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;

  const { 
    fincas, 
    alert, 
    eliminarFinca 
  } = useFinca();
  const { estanques } = useEstanque();

  const [ModalVisible, setModalVisible] = useState(false);
  const [FincaNombreSeleccionada, setFincaNombreSeleccionada] = useState(null);
  const [FincaCodigoCBOSeleccionada, setFincaCodigoCBOSeleccionada] =
  useState(null);

  const fincasConConteo = useMemo(() => {
    return fincas.map((finca) => ({
      ...finca,
      estanques: estanques.filter((e) => e.idFinca === finca.id).length,
    }));
  }, [fincas, estanques]);

  function abrirModalEliminar(Finca) {
    setFincaCodigoCBOSeleccionada(Finca.codigoCBO);
    setFincaNombreSeleccionada(Finca.nombreFinca);
    setModalVisible(true);
  }

  function cancelarEliminar() {
    setModalVisible(false);
    setFincaCodigoCBOSeleccionada(null);
    setFincaNombreSeleccionada(null);
  }

  function confirmarEliminar() {
    eliminarFinca(FincaCodigoCBOSeleccionada);
    setModalVisible(false);
    setFincaCodigoCBOSeleccionada(null);
    setFincaNombreSeleccionada(null);
  }

  return {
    fincas: fincasConConteo,
    alert,
    isCompact,
    ModalVisible,
    FincaNombreSeleccionada,
    
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
