/**
 * ============================================================
 * HOOK: useColaboradoresList
 * ============================================================
 *
 * Encapsula la lógica de la pantalla principal de colaboradores.
 * Obtiene todos los colaboradores activos y maneja la eliminación.
 *
 * Retorna:
 * - colaboradores: lista completa de colaboradores activos.
 * - loading, error, fetchColaboradores.
 * - searchText, setSearchText.
 * - Estados y handlers para el modal de confirmación de eliminación.
 * - alert para mensajes flotantes.
 * ============================================================
 */

import { useState, useRef } from "react";
import { useColaboradores } from "./useColaboradores";

export function useColaboradoresList() {
  // Estados de búsqueda y eliminación
  const [searchText, setSearchText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Alerta flotante
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => setAlert(null), 3000);
  };

  // Obtener todos los colaboradores activos (sin filtrar por rol)
  const {
    colaboradores: todos,
    loading,
    error,
    eliminarColaborador,
    fetchColaboradores,
  } = useColaboradores({ activo: true });

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    try {
      await eliminarColaborador(deleteTarget.id);
      showAlert("success", `El colaborador ${deleteTarget.nombre} ha sido eliminado correctamente.`);
      setShowConfirmModal(false);
      setDeleteTarget(null);
      fetchColaboradores();
    } catch (error) {
      // El error se mostrará en el contexto global; no es necesario un alert adicional
      setShowConfirmModal(false);
      setDeleteTarget(null);
    }
  };

  return {
    colaboradores: todos,
    loading,
    error,
    searchText,
    setSearchText,
    deleteTarget,
    setDeleteTarget,
    showConfirmModal,
    setShowConfirmModal,
    alert,
    showAlert,
    confirmDelete,
    fetchColaboradores,
  };
}