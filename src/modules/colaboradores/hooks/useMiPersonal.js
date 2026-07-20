/**
 * ============================================================
 * HOOK: useMiPersonal
 * ============================================================
 *
 * Encapsula la lógica de la pantalla de personal (MiPersonalScreen)
 * para dueños externos: estado, búsqueda, modales y CRUD de
 * trabajadores externos.
 *
 * Retorna:
 * - user (mock con id, fincaId, role)
 * - searchText, setSearchText
 * - cedulaConfirmacion, setCedulaConfirmacion
 * - deleteTarget, setDeleteTarget
 * - showConfirmModal, setShowConfirmModal
 * - cedulaError, setCedulaError
 * - alert, showAlert
 * - colaboradores, loading, error
 * - listaFiltrada
 * - handleDeletePress, confirmDelete
 */

import { useState, useEffect, useRef } from "react";
import { useColaboradores } from "./useColaboradores";

export function useMiPersonal() {
  // Datos del usuario mock (dueño externo)
  const user = { id: "3", fincaId: "finca3", role: "external_owner" };

  // Estados de la UI
  const [searchText, setSearchText] = useState("");
  const [cedulaConfirmacion, setCedulaConfirmacion] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cedulaError, setCedulaError] = useState("");

  // Estado para alerta flotante
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  // Función para mostrar alerta con auto-cierre
  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // Datos de colaboradores (solo external_worker de esta finca)
  const {
    colaboradores,
    loading,
    error,
    eliminarColaborador,
    fetchColaboradores,
  } = useColaboradores({ fincaId: user.fincaId, rol: "external_worker", activo: true });

  // Carga inicial
  useEffect(() => {
    fetchColaboradores();
  }, []);

  // Filtrado local por búsqueda
  const listaFiltrada = colaboradores.filter((colab) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      colab.nombre.toLowerCase().includes(searchLower) ||
      colab.telefono.includes(searchText) ||
      colab.email.toLowerCase().includes(searchLower) ||
      colab.cedula.includes(searchText)
    );
  });

  // Manejadores
  const handleDeletePress = (id) => {
    const colaborador = colaboradores.find((c) => c.id === id);
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
      showAlert("danger", `El colaborador ${deleteTarget.nombre} ha sido eliminado correctamente.`);
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
    user,
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
    colaboradores,
    loading,
    error,
    listaFiltrada,
    handleDeletePress,
    confirmDelete,
  };
}