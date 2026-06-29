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
