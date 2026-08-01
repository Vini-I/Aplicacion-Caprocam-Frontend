/**
 * useInventario.js
 * Hook para manejar el estado y lógica de la pantalla de Inventarios.
 *
 * FUNCIONALIDAD:
 * - Carga el listado de productos desde la API mediante InventarioService.
 * - Centraliza el estado de la barra de búsqueda y los filtros activos.
 * - Aplica filtros múltiples (categoría, proveedor, unidad, caducidad, stock).
 *
 * REGLAS IMPORTANTES:
 * - Los filtros se aplican a los datos cargados en memoria.
 * - Se manejan errores globales usando ErrorContext.
 *
 * @dependencies - React, expo-router, InventarioService, ErrorContext
 * @validations - N/A
 * @navigation - N/A
 */

import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { getProductosInventario } from "../services/InventarioService.js";
import { useError } from "../../../shared/context/ErrorContext.js";


function parsearFechaDDMMAAAA(fecha) {
  if (!fecha) return null;
  const partes = fecha.split("/");
  if (partes.length !== 3) return null;

  const [dia, mes, anio] = partes.map(Number);
  if (!dia || !mes || !anio) return null;

  return new Date(anio, mes - 1, dia);
}

export function useInventario() {
  const flatListRef = useRef(null);
  const { mostrarError } = useError();

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
      let isActive = true;

      const loadData = async () => {
        try {
          const data = await getProductosInventario();
          if (isActive) {
            setProductos(data);
          }
        } catch (error) {
          if (isActive) mostrarError(error);
        }
      };
      loadData();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const categorias = Array.isArray(productos)
    ? [...new Set(productos.map((p) => p.categoria).filter(Boolean))]
    : [];
  const proveedores = Array.isArray(productos)
    ? [...new Set(productos.map((p) => p.nombreProveedor).filter(Boolean))]
    : [];
  const unidades = Array.isArray(productos)
    ? [...new Set(productos.map((p) => p.unidad).filter(Boolean))]
    : [];

  const productosFiltrados = Array.isArray(productos)
    ? productos.filter((p) => {
        const texto = busqueda.toLowerCase();
        const nombre = (p.nombre || "").toLowerCase();
        const proveedor = (p.nombreProveedor || "").toLowerCase();
        const categoria = (p.categoria || "").toLowerCase();
        const codigo = (p.codigo || "").toLowerCase();

        const coincideTexto =
          nombre.includes(texto) ||
          proveedor.includes(texto) ||
          categoria.includes(texto) ||
          codigo.includes(texto);

        const coincideCategoria =
          filtros.categories.length === 0 ||
          filtros.categories.includes(p.categoria);

        const coincideProveedor =
          filtros.suppliers.length === 0 ||
          filtros.suppliers.includes(p.nombreProveedor);

        const coincideUnidad =
          filtros.units.length === 0 || filtros.units.includes(p.unidad);

        const coincideStock =
          !filtros.lowStock || Number(p.cantidad) < Number(p.stockMinimo);

        const fechaFiltro = parsearFechaDDMMAAAA(filtros.expiryDate);
        const fechaProducto = parsearFechaDDMMAAAA(p.fechaCaducidad);
        const coincideCaducidad =
          !fechaFiltro || (fechaProducto && fechaProducto <= fechaFiltro);

        return (
          coincideTexto &&
          coincideCategoria &&
          coincideProveedor &&
          coincideUnidad &&
          coincideStock &&
          coincideCaducidad
        );
      })
    : [];

  const cantidadStockBajo = Array.isArray(productos)
    ? productos.filter((p) => Number(p.cantidad) < Number(p.stockMinimo)).length
    : 0;

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
