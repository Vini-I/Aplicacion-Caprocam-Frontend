import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { getProductosInventario } from "../services/InventarioService.js";

export function useInventario() {
  const flatListRef = useRef(null);

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: "",
  });

  useFocusEffect(
    useCallback(() => {
      setProductos(getProductosInventario());

      setBusqueda("");

      setFiltros({
        categories: [],
        suppliers: [],
        units: [],
        lowStock: false,
        expiryDate: "",
      });

      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
    }, [])
  );

  const categorias = [...new Set(productos.map((p) => p.categoria))];
  const proveedores = [...new Set(productos.map((p) => p.proveedor))];
  const unidades = [...new Set(productos.map((p) => p.unidad))];

  const productosFiltrados = productos.filter((p) => {
    const texto = busqueda.toLowerCase();

    const coincideTexto =
      p.nombre.toLowerCase().includes(texto) ||
      p.proveedor.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto) ||
      (p.codigo && p.codigo.toLowerCase().includes(texto));

    const coincideCategoria =
      filtros.categories.length === 0 ||
      filtros.categories.includes(p.categoria);

    const coincideProveedor =
      filtros.suppliers.length === 0 ||
      filtros.suppliers.includes(p.proveedor);

    const coincideUnidad =
      filtros.units.length === 0 ||
      filtros.units.includes(p.unidad);

    const coincideStock =
      !filtros.lowStock ||
      p.cantidad < p.stockMinimo;

    return (
      coincideTexto &&
      coincideCategoria &&
      coincideProveedor &&
      coincideUnidad &&
      coincideStock
    );
  });

  const cantidadStockBajo = productos.filter(
    (p) => p.cantidad < p.stockMinimo
  ).length;

  return {
    flatListRef,
    productos,
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
    categorias,
    proveedores,
    unidades,
    productosFiltrados,
    cantidadStockBajo,
  };
}
