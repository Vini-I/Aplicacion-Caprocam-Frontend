/**
 * ============================================================
 * HOOK: USEDETALLECOMPRADORSCREEN
 * ============================================================
 * Módulo: Compradores
 *
 * Maneja la lógica de la pantalla de detalle de un comprador.
 *
 * FUNCIONALIDAD:
 * 1. Busca el comprador en compradoresMock según el id recibido
 *    por parámetro de ruta.
 * 2. getTipoProductoSelect: traduce el value del tipo de producto
 *    a su etiqueta legible para mostrarla en pantalla.
 * 3. Controla la visibilidad del modal de confirmación de eliminar.
 * 4. Expone la navegación hacia Editar y de vuelta a la lista.
 *
 * IMPORTANTE:
 * - irAtras() se usa tanto para el botón de volver como para
 *   confirmar la eliminación en el modal; no borra el comprador
 *   del mock, solo navega de regreso a la lista.
 * ============================================================
 */



import { useState, useEffect, useCallback } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { compradorService, mapComprador } from "../services/comprador.service";
import { useError } from "../../../shared/context/ErrorContext";

export function useDetalleCompradorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { mostrarError } = useError();

  const [comprador, setComprador] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Controla la visibilidad del modal de confirmación de eliminación
  const [modalVisible, setModalVisible] = useState(false);
  // Controla si ya se confirmó la eliminación, para mostrar el alert de éxito
  const [eliminado, setEliminado] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  // Busca el comprador activo en la API por su id
  const cargarComprador = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await compradorService.getCompradorPorId(id);
      setComprador(mapComprador(data));
    } catch (err) {
      setComprador(null);
      setError("No se pudo cargar el comprador.");
      mostrarError(err);
    } finally {
      setCargando(false);
    }
  }, [id, mostrarError]);

  useEffect(() => {
    if (id) cargarComprador();
  }, [id, cargarComprador]);

  // Confirma la eliminación: desactiva el comprador en el back y vuelve a la lista
  async function irAtras() {
    if (!comprador) return;
    setEliminando(true);
    setError(null);
    try {
      await compradorService.desactivarComprador(comprador.id);
      setModalVisible(false);
      setEliminado(true);
      setTimeout(() => {
        router.replace("/(drawer)/compradores/compradorScreen");
      }, 900);
    } catch (err) {
      setModalVisible(false);
      setError("No se pudo eliminar el comprador. Intenta de nuevo.");
      mostrarError(err);
    } finally {
      setEliminando(false);
    }
  }

  function irAEditar() {
    router.push({
      pathname: "/(drawer)/compradores/editarComprador",
      params: { id: comprador.id.toString() },
    });
  }

  return {
    comprador,
    cargando,
    error,
    modalVisible,
    setModalVisible,
    eliminado,
    eliminando,
    irAtras,
    irAEditar,
  };
}
