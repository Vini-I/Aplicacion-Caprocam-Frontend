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

  const comprador = getCompradorMockById(id);

  function irAtras() {
    router.replace("/(drawer)/compradores/compradorScreen");
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
    irAtras,
    irAEditar,
    getTipoProductoSelect,
  };
}
