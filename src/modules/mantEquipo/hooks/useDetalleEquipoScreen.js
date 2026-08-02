/**
 * ============================================================
 * HOOK: useDetalleEquipoScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Responsabilidad:
 * Encapsula toda la lógica de la pantalla DetalleEquipoScreen:
 * carga de equipo y estanque, eliminación, alertas y modales.
 *
 * @dependencies - equiposService (getEquipoById, getEstanquesDisponibles, deleteEquipo)
 * @validations  - ID de equipo válido
 * @navigation   - router.push → edición / estanque, router.replace → lista tras eliminar
 *
 * Parámetros:
 * - { id, router }: id del equipo y router de expo-router
 *
 * Retorna:
 * - equipo, estanque, loading, error, alert
 * - showConfirmModal, deleteTarget
 * - handleEditar, handleEliminarPress, confirmDelete, cancelDelete, handleEstanquePress
 */

import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { equiposService } from '../services/equiposService';

export function useDetalleEquipoScreen({ id, router }) {
  const [equipo, setEquipo] = useState(null);
  const [estanque, setEstanque] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState(null);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await equiposService.getEquipoById(id);
      setEquipo(data);

      if (data.estanqueId) {
        // El backend no expone GET /estanques/:id, así que se busca
        // dentro de la lista de estanques disponibles.
        const estanques = await equiposService.getEstanquesDisponibles();
        const encontrado = estanques.find((e) => e.value === String(data.estanqueId));
        setEstanque(encontrado || null);
      } else {
        setEstanque(null);
      }
    } catch (err) {
      setError(err.message || 'No se pudo cargar el equipo.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) cargarDatos();
    else setError('ID de equipo no proporcionado.');
  }, [id, cargarDatos]);

  useFocusEffect(
    useCallback(() => {
      if (id) cargarDatos();
    }, [id, cargarDatos])
  );

  const handleEditar = () => {
    router.push(`/equipos/registrarEquipo?edit=${equipo.id}`);
  };

  const handleEliminarPress = () => {
    setDeleteTarget(equipo);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await equiposService.deleteEquipo(equipo.id);
      setAlert({ type: 'danger', message: `Equipo "${equipo.nombre}" eliminado.` });
      setShowConfirmModal(false);
      setTimeout(() => router.replace('/equipos/equipos'), 1500);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'No se pudo eliminar el equipo.' });
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteTarget(null);
  };

  const handleEstanquePress = () => {
    if (estanque) {
      router.push(`/estanques/detalle?id=${estanque.value}`);
    }
  };

  return {
    equipo,
    estanque,
    loading,
    error,
    alert,
    showConfirmModal,
    deleteTarget,
    handleEditar,
    handleEliminarPress,
    confirmDelete,
    cancelDelete,
    handleEstanquePress,
  };
}
