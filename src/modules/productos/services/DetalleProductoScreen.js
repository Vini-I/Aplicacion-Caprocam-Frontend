import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProductoById, deleteProducto } from "../../inventarios/services/inventarioService";

import { colorCategoria, colorCategoriaDefault } from "../styles/DetalleProductScreen.styles";

export function useDetalleProducto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const producto = getProductoById(id);
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);

  const tieneStockBajo = producto ? producto.cantidad < producto.stockMinimo : false;
  const colores = producto ? colorCategoria[producto.categoria] || colorCategoriaDefault: colorCategoriaDefault;
  const precioFormateado = producto ? `₡${producto.precioUnidad.toLocaleString("es-CR")}` : "";
  const stockTotalFormateado = producto ? `₡${(producto.precioUnidad * producto.cantidad).toLocaleString("es-CR")}`  : "";

  function handleEditar() {
    router.push({ pathname: "/(drawer)/inventarios/productForm",params: {productoParam: JSON.stringify(producto)}, });
  }

  function handleEliminar() {
    setModalEliminarVisible(true);
  }

  function confirmarEliminar() {
    deleteProducto(producto.id);
    setModalEliminarVisible(false);
    router.replace("/(drawer)/inventarios/inventarioScreen");
  }

  function handleBack() {
    router.replace("/(drawer)/inventarios/inventarioScreen");
  }

  function handleCerrarModal() {
    setModalEliminarVisible(false);
  }

  return {
    producto,
    tieneStockBajo,
    colores,
    precioFormateado,
    stockTotalFormateado,
    modalEliminarVisible,
    handleEditar,
    handleEliminar,
    confirmarEliminar,
    handleBack,
    handleCerrarModal,
  };
}
