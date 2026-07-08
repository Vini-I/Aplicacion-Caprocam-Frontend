/**
 * ============================================================
 * HOOK useTrazabilidadList
 * ============================================================
 *
 * Descripción:
 * Hook responsable de obtener y filtrar el listado de registros
 * de trazabilidad. Encapsula la lógica de búsqueda y filtros para
 * mantener las pantallas simples.
 *
 * Reglas/Restricciones:
 * - No exportar funciones que no sean consumidas por las pantallas.
 * - Mantener la lógica de filtrado pura para facilitar pruebas.
 */

import { useMemo, useState } from "react";
import { useRouter } from "expo-router";

import {
  obtenerRegistrosTrazabilidad,
  obtenerFincas,
  obtenerColaboradores,
  filtrarRegistrosTrazabilidad,
} from "../services/TrazabilidadServices";

export function useTrazabilidadList() {
  const router = useRouter();

  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    fincas: [],
    colaboradores: [],
    fecha: "",
  });

  const registros = obtenerRegistrosTrazabilidad();
  const fincas = obtenerFincas();
  const colaboradores = obtenerColaboradores();

  const registrosFiltrados = useMemo(
    () => filtrarRegistrosTrazabilidad(registros, busqueda, filtros),
    [registros, busqueda, filtros],
  );

  const hayFiltrosActivos =
    String(busqueda).trim() !== "" ||
    filtros.fincas.length > 0 ||
    filtros.colaboradores.length > 0 ||
    filtros.fecha !== "";

  function nuevoRegistro() {
    router.push("/trazabilidad/agregar");
  }

  function limpiarBusqueda() {
    setBusqueda("");
    setFiltros({ fincas: [], colaboradores: [], fecha: "" });
  }

  function abrirDetalle(id) {
    router.push(`/trazabilidad/${id}`);
  }

  return {
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
    registrosFiltrados,
    fincas,
    colaboradores,
    hayFiltrosActivos,
    nuevoRegistro,
    limpiarBusqueda,
    abrirDetalle,
  };
}
