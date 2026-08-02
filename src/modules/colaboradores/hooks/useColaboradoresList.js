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
  const [cedulaConfirmacion, setCedulaConfirmacion] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cedulaError, setCedulaError] = useState("");

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

  // Handlers de eliminación
  const handleDeletePress = (id) => {
    const colaborador = todos.find((c) => c.id === id);
    if (colaborador) {
      setDeleteTarget(colaborador);
      setCedulaConfirmacion("");
      setCedulaError("");
      setShowConfirmModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      setCedulaError("No se encontró el colaborador a eliminar.");
      return;
    }
    if (cedulaConfirmacion !== deleteTarget.cedula) {
      setCedulaError("La cédula ingresada no coincide con la del colaborador.");
      return;
    }
    try {
      await eliminarColaborador(deleteTarget.id);
      showAlert("success", `El colaborador ${deleteTarget.nombre} ha sido eliminado correctamente.`);
      setShowConfirmModal(false);
      setDeleteTarget(null);
      setCedulaConfirmacion("");
      setCedulaError("");
      fetchColaboradores();
    } catch (error) {
      setCedulaError("No se pudo eliminar el colaborador. Intente nuevamente.");
    }
  };

  return {
    colaboradores: todos,
    loading,
    error,
    searchText,
    setSearchText,
    cedulaConfirmacion,
    setCedulaConfirmacion,
    deleteTarget,
    setDeleteTarget,
    showConfirmModal,
    setShowConfirmModal,
    cedulaError,
    setCedulaError,
    alert,
    showAlert, // <--- exportado para usar desde la screen
    handleDeletePress,
    confirmDelete,
    fetchColaboradores,
  };
}