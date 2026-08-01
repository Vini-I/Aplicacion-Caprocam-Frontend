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
 * 3. Filtra la lista según el texto de búsqueda (nombre, cédula,
 *    tipo, teléfono o correo) y los tipos seleccionados en el
 *    filtro.
 * 4. Expone la navegación a Detalle, a Nuevo comprador y a Inicio.
 *
 * IMPORTANTE:
 * - La búsqueda no distingue mayúsculas/minúsculas.
 * - Si no hay tipos seleccionados en el filtro, se muestran todos.
 * ============================================================
 */


import { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { compradorService, mapComprador } from "../services/comprador.service";
import { useError } from "../../../shared/context/ErrorContext";

export function useCompradorScreen() {
  const router = useRouter();
  const { mostrarError } = useError();

  const [compradores, setCompradores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ tipos: [] });

  // Carga los compradores activos desde la API
  const cargarCompradores = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await compradorService.getCompradores();
      setCompradores((data || []).map(mapComprador));
    } catch (err) {
      setError("No se pudieron cargar los compradores. Intenta de nuevo.");
      mostrarError(err);
    } finally {
      setCargando(false);
    }
  }, [mostrarError]);

  
  useFocusEffect(
    useCallback(() => {
      cargarCompradores();
    }, [cargarCompradores])
  );

  
  const TIPOS = [];

  // Filtra los compradores según el texto ingresado
  const compradoresFiltrados = compradores.filter((c) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto =
      (c.nombre || "").toLowerCase().includes(texto) ||
      (c.cedula || "").toLowerCase().includes(texto) ||
      (c.telefono || "").toLowerCase().includes(texto) ||
      (c.correo || "").toLowerCase().includes(texto);
    return coincideTexto;
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
    cargando,
    error,
    recargar: cargarCompradores,
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