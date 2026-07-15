/**
 * ============================================================
 * HOOK: USEDETALLECOMPRADORSCREEN
 * ============================================================
 * Módulo: Compradores
 *
 * Maneja la lógica de la pantalla de detalle de un comprador.
 *
 * FUNCIONALIDAD:
 * 1. Busca el comprador en compradoresMock según el id recibido
 *    por parámetro de ruta.
 * 2. getTipoProductoSelect: traduce el value del tipo de producto
 *    a su etiqueta legible para mostrarla en pantalla.
 * 3. Controla la visibilidad del modal de confirmación de eliminar.
 * 4. Expone la navegación hacia Editar y de vuelta a la lista.
 *
 * IMPORTANTE:
 * - irAtras() se usa tanto para el botón de volver como para
 *   confirmar la eliminación en el modal; no borra el comprador
 *   del mock, solo navega de regreso a la lista.
 * ============================================================
 */



import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { compradoresMock, tiposProducto } from "../services/CompradorData";

// Busca la etiqueta legible del tipo de producto según su value
function getTipoProductoSelect(value) {
  const tipo = tiposProducto.find((t) => t.value === value);
  return tipo ? tipo.label : value;
}

// Busca un comprador en el mock por su id numérico
function getCompradorMockById(id) {
  return compradoresMock.find((c) => c.id === Number(id));
}

export function useDetalleCompradorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Controla la visibilidad del modal de confirmación de eliminación
  const [modalVisible, setModalVisible] = useState(false);
  // Controla si ya se confirmó la eliminación, para mostrar el alert de éxito
  const [eliminado, setEliminado] = useState(false);

  const comprador = getCompradorMockById(id);

  function irAtras() {
    setModalVisible(false);
    setEliminado(true);
    setTimeout(() => {
      router.replace("/(drawer)/compradores/compradorScreen");
    }, 900);
  }

  function irAEditar() {
    router.push({
      pathname: "/(drawer)/compradores/editarComprador",
      params: { id: comprador.id.toString() },
    });
  }

  return {
    comprador,
    modalVisible,
    setModalVisible,
    eliminado,
    irAtras,
    irAEditar,
    getTipoProductoSelect,
  };
}
