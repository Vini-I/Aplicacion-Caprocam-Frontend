/**
 * ============================================================
 * HOOK LISTADO DE PROVEEDORES
 * ============================================================
 *
 * Logica de la pantalla de listado de proveedores.
 *
 * FUNCIONALIDAD:
 * 1. Carga los proveedores desde el backend (getProveedores) y los
 *    refresca cada vez que la pantalla recibe foco.
 * 
 * 2. Filtra el listado por texto de búsqueda (nombre, tipo, teléfono,
 *    correo) y por tipo(s) de producto seleccionados.
 * 
 * 3. Expone TIPOS (todas las categorías del catálogo tiposProducto,
 *    no solo las que ya tienen un proveedor cargado) para el
 *    FilterButton, así el filtro siempre muestra todas las
 *    clasificaciones disponibles aunque aún no haya proveedores de ese
 *    tipo.
 *
 * 4. Expone cargando (loading del fetch) y error (mensaje si la
 *    petición falla) para que la screen pueda mostrar el estado
 *    correspondiente.
 *
 * IMPORTANTE:
 * - No aplica validaciones, no hay formulario ni guardado.
 * - No navega; expone datos para que la screen decida.
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigation } from "expo-router";
import { getProveedores, tiposProducto } from "../services/proveedor.service";

export function useProveedorScreen() {
  const navigation = useNavigation();
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ tipos: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarProveedores = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const data = await getProveedores();

      setProveedores(data);
    } catch (err) {
      setError("No fue posible cargar los proveedores.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProveedores();

    const unsubscribe = navigation.addListener("focus", () => {
      cargarProveedores();
    });
    return unsubscribe;
  }, [navigation, cargarProveedores]);

  const TIPOS = tiposProducto.map((t) => t.value);

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
    TIPOS,
    handleAplicarFiltros,
    cargando,
    error,
    recargar: cargarProveedores,
  };
}