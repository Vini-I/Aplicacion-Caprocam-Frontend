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

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import {
  getRegistros,
  obtenerFincas,
  obtenerColaboradores,
  filtrarRegistrosTrazabilidad,
} from "../services/TrazabilidadServices";

export function useTrazabilidadList() {
  const router = useRouter();

  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    fincas: [],
    estanques: [],
    colaboradores: [],
    fecha: "",
  });

  const [registros, setRegistros] = useState([]);
  const [fincas, setFincas] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    obtenerFincas().then(setFincas).catch(() => setFincas([]));
    obtenerColaboradores().then(setColaboradores).catch(() => setColaboradores([]));
  }, []);

  // Se vuelve a pedir el listado cada vez que la pantalla toma foco,
  // para que se vea el registro recién agregado al volver de "agregar".
  useFocusEffect(
    useCallback(() => {
      getRegistros().then(setRegistros).catch(() => setRegistros([]));
    }, []),
  );
  const registrosFiltrados = useMemo(
    () => filtrarRegistrosTrazabilidad(registros, busqueda, filtros),
    [registros, busqueda, filtros],
  );

  const hayFiltrosActivos =
    String(busqueda).trim() !== "" ||
    filtros.fincas.length > 0 ||
    filtros.estanques.length > 0 ||
    filtros.colaboradores.length > 0 ||
    filtros.fecha !== "";

  function nuevoRegistro() {
    router.push("/trazabilidad/agregar");
  }

  function limpiarBusqueda() {
    setBusqueda("");
    setFiltros({ fincas: [], estanques: [], colaboradores: [], fecha: "" });
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

// Helper to prepare a registro for presentation in the UI.
// Keeps formatting logic out of the screen component.
export function formatRegistroForView(registro) {
  const plNumber = Number(registro.pl ?? 0);
  const plFormatted = plNumber.toLocaleString();
  // "tamano" sin ñ: así lo confirmó el equipo de API en la respuesta real.
  const tamanoFormatted = registro.tamano ? `${registro.tamano}g` : "";

  return {
    ...registro,
    plFormatted,
    tamanoFormatted,
  };
}