/**
 * ============================================================
 * HOOK LISTADO DE PROVEEDORES
 * ============================================================
 *
 * Logica de la pantalla de listado de proveedores.
 *
 * FUNCIONALIDAD:
 * 1. Carga el mock de proveedores (proveedoresMock).
 * 2. Filtra el listado por texto de búsqueda (nombre, tipo, teléfono,
 *    correo) y por tipo(s) de producto seleccionados.
 * 3. Expone `TIPOS` (todas las categorías del catálogo `tiposProducto`,
 *    no solo las que ya tienen un proveedor cargado) para el
 *    FilterButton, así el filtro siempre muestra todas las
 *    clasificaciones disponibles aunque aún no haya proveedores de ese
 *    tipo.
 *
 * IMPORTANTE:
 * - No aplica validaciones, no hay formulario ni guardado.
 * - No navega; expone datos para que la screen decida.
 */
import { useState } from "react";
import { proveedoresMock, tiposProducto } from "../services/ProveedorData";

export function useProveedorScreen() {
  const [proveedores] = useState(proveedoresMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ tipos: [] });

  const TIPOS = tiposProducto.map((t) => t.value);

  const proveedoresFiltrados = proveedores.filter((p) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto =
      p.nombre.toLowerCase().includes(texto) ||
      p.tipoProducto.toLowerCase().includes(texto) ||
      p.telefono.toLowerCase().includes(texto) ||
      p.correo.toLowerCase().includes(texto);
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
  };
}