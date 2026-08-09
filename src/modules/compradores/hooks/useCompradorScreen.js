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
 * 1. Carga la lista de compradores desde la API.
 * 2. Calcula los tipos de producto únicos para usarlos como
 *    opciones de filtro.
 * 3. Filtra la lista según el texto de búsqueda (nombre, cédula,
 *    tipo, teléfono o correo) y los tipos seleccionados en el
 *    filtro.
 * 4. Expone la navegación a Detalle, a Nuevo comprador y a Inicio.
 * 5. Si se llega desde "guardar comprador" (parámetro "guardado") o
 *    desde "eliminar comprador" (parámetro "eliminado"), muestra
 *    aquí el alert de éxito correspondiente por 3 segundos.
 *
 * IMPORTANTE:
 * - La búsqueda no distingue mayúsculas/minúsculas.
 * - Si no hay tipos seleccionados en el filtro, se muestran todos.
 * ============================================================
 */


import { useState, useCallback, useEffect } from "react";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import { compradorService, mapComprador } from "../services/comprador.service";
import { useError } from "../../../shared/context/ErrorContext";

export function useCompradorScreen() {
  const router = useRouter();
  const { mostrarError } = useError();
  const { eliminado, guardado } = useLocalSearchParams();

  const [compradores, setCompradores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ tipos: [] });

  // Si se llega desde "eliminar comprador", muestra aquí el alert
  // de éxito por 3 segundos.
  const [eliminadoExitoso, setEliminadoExitoso] = useState(!!eliminado);

  useEffect(() => {
    if (eliminadoExitoso) {
      const t = setTimeout(() => setEliminadoExitoso(false), 3000);
      return () => clearTimeout(t);
    }
  }, [eliminadoExitoso]);

  // Si se llega desde "guardar comprador" (nuevo), muestra aquí el
  // alert de éxito por 3 segundos.
  const [guardadoExitoso, setGuardadoExitoso] = useState(!!guardado);

  useEffect(() => {
    if (guardadoExitoso) {
      const t = setTimeout(() => setGuardadoExitoso(false), 3000);
      return () => clearTimeout(t);
    }
  }, [guardadoExitoso]);

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
    eliminadoExitoso,
    guardadoExitoso,
    handleVerDetalle,
    handleAgregar,
    handleHome,
  };
}