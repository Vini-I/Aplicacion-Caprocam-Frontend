/**
 * useProveedorScreen.js
 * Hook para la lógica de la pantalla de listado de proveedores.
 *
 * FUNCIONALIDAD:
 * - Carga todos los proveedores desde el contexto global.
 * - Aplica los filtros de búsqueda y de tipo de producto en memoria.
 *
 * REGLAS IMPORTANTES:
 * - Refresca los datos cada vez que la pantalla recibe el foco.
 *
 * @dependencies - React, expo-router, proveedor.service, ProveedorContext
 * @validations - N/A
 * @navigation - N/A
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigation } from "expo-router";
import { tiposProducto } from "../services/proveedor.service";
import { useProveedor } from "../context/ProveedorContext";

const tipos = tiposProducto.map((t) => t.value);

export function useProveedorScreen() {
  const navigation = useNavigation();
  const { proveedores, loading: cargando, alert, cargarProveedores } = useProveedor();
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ tipos: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    cargarProveedores();

    const unsubscribe = navigation.addListener("focus", () => {
      cargarProveedores();
    });
    return unsubscribe;
  }, [navigation]);

  const proveedoresFiltrados = proveedores.filter((p) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto =
      p.nombre?.toLowerCase().includes(texto) ||
      p.tipoProducto?.toLowerCase().includes(texto) ||
      p.telefono?.toLowerCase().includes(texto) ||
      p.correo?.toLowerCase().includes(texto);
    const coincideTipo =
      filtros.tipos.length === 0 || filtros.tipos.includes(p.tipoProducto);
    return coincideTexto && coincideTipo;
  });

  function handleAplicarFiltros(f) {
    setFiltros({ tipos: f.categories });
  }

  return {
    proveedoresFiltrados,
    busqueda,
    setBusqueda,
    filtros,
    tipos,
    handleAplicarFiltros,
    cargando,
    error,
    alert,
    recargar: cargarProveedores,
  };
}