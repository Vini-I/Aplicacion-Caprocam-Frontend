/**
 * ============================================================
 * HOOK: USECOMPRADORSCREEN
 * ============================================================
 * Módulo: Compradores
 *
 * Maneja el estado de la pantalla principal de compradores
 * (lista, búsqueda y filtros).
 *
 * FUNCIONALIDAD:
 * 1. Carga la lista mock de compradores (compradoresMock).
 * 2. Calcula los tipos de producto únicos para usarlos como
 *    opciones de filtro.
 * 3. Filtra la lista según el texto de búsqueda (nombre, tipo,
 *    teléfono o correo) y los tipos seleccionados en el filtro.
 * 4. Expone la navegación a Detalle, a Nuevo comprador y a Inicio.
 *
 * IMPORTANTE:
 * - La búsqueda no distingue mayúsculas/minúsculas.
 * - Si no hay tipos seleccionados en el filtro, se muestran todos.
 * ============================================================
 */


import { useState } from "react";
import { useRouter } from "expo-router";
import { compradoresMock } from "../services/CompradorData";

export function useCompradorScreen() {
  const router = useRouter();

  const [compradores] = useState(compradoresMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ tipos: [] });

  // Extrae los tipos únicos de producto para mostrarlos como opciones de filtro
  const TIPOS = [...new Set(compradores.map((c) => c.tipoProducto))];

  // Filtra los compradores según el texto ingresado y los tipos seleccionados
  const compradoresFiltrados = compradores.filter((c) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto =
      c.nombre.toLowerCase().includes(texto) ||
      c.tipoProducto.toLowerCase().includes(texto) ||
      c.telefono.toLowerCase().includes(texto) ||
      c.correo.toLowerCase().includes(texto);
    const coincideTipo =
      filtros.tipos.length === 0 || filtros.tipos.includes(c.tipoProducto);
    return coincideTexto && coincideTipo;
  });

  // Navega a la pantalla de detalle pasando el id del comprador como parámetro
  function handleVerDetalle(compradorId) {
    router.push({
      pathname: "/(drawer)/compradores/detalleComprador",
      params: { id: compradorId.toString() },
    });
  }

  function handleAgregar() {
    router.push("/(drawer)/compradores/nuevoComprador");
  }

  function handleHome() {
    router.replace("/inicio");
  }

  return {
    compradoresFiltrados,
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
    TIPOS,
    handleVerDetalle,
    handleAgregar,
    handleHome,
  };
}
