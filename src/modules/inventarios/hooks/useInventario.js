/**
 * ============================================================
 * HOOK: useInventario
 * ============================================================
 *
 * Responsabilidad:
 * Maneja el estado de la pantalla de Inventarios: carga de productos desde la API,
 * texto de búsqueda, filtros activos (categoría, proveedor, unidad,
 * stock bajo, caducidad) y el cálculo de la lista filtrada final.
 * El filtro de caducidad muestra los productos cuya fechaCaducidad
 * sea igual o anterior a la fecha elegida en FilterButton (es decir,
 * "productos que caducan en o antes de esta fecha"), que es el uso
 * esperado para revisar próximos vencimientos.
 *
 * Datos:
 * Lee los productos mediante la llamada asíncronica a InventarioService.getProductosInventario(),
 * que ya devuelve el producto más reciente de primero. Cada producto
 * incluye fechaCaducidad como string dd/mm/aaaa (mismo formato que
 * entrega el DateInput compartido); es un dato real que ya existe en
 * el módulo de Productos, aquí solo se consume para el filtro.
 *
 * Validaciones:
 * No aplica validación de formulario; solo filtra sobre datos ya
 * existentes en memoria.
 *
 * Navegación:
 * Recarga los productos de la API automáticamente cada vez que la
 * pantalla recibe foco gracias a useFocusEffect.
 *
 * Dependencias:
 * services/InventarioService.js.
 */

import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { getProductosInventario } from "../services/InventarioService.js";

/**
 * Convierte un string "dd/mm/aaaa" a Date para poder comparar fechas.
 * No usa regex, solo split. Devuelve null si el string viene vacío o
 * mal formado (así el filtro simplemente no aplica en vez de romper).
 */
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
        }catch (error) {
          console.error("Error al cargar productos de inventario:", error);
        }
      };
      loadData();
    }, [])
  );

  const categorias = Array.isArray(productos) ? [...new Set(productos.map((p) => p.categoria))] : [];
  const proveedores = Array.isArray(productos) ? [...new Set(productos.map((p) => p.proveedor))] : [];
  const unidades = Array.isArray(productos) ? [...new Set(productos.map((p) => p.unidad))] : [];

  const productosFiltrados = Array.isArray(productos) ? productos.filter((p) => {
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
  }) : [];

  const cantidadStockBajo = Array.isArray(productos) ? productos.filter(
    (p) => p.cantidad < p.stockMinimo
  ).length : 0;

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