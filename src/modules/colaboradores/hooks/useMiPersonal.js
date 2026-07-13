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
 * - modalVisible, setModalVisible
 * - editingColaborador, setEditingColaborador
 * - selectedColaboradorId, setSelectedColaboradorId
 * - searchText, setSearchText
 * - cedulaConfirmacion, setCedulaConfirmacion
 * - deleteTarget, setDeleteTarget
 * - showConfirmModal, setShowConfirmModal
 * - cedulaError, setCedulaError
 * - alert, showAlert (para mensajes en la lista)
 * - colaboradores, loading, error
 * - listaFiltrada
 * - handleAdd, handleEdit, handleDeletePress, confirmDelete, handleSubmit, openStats
 */

import { useState, useEffect, useRef } from "react";
import { Alert as RNAlert } from "react-native";
import { useColaboradores } from "./useColaboradores";

export function useMiPersonal() {
  // Datos del usuario mock (dueño externo)
  const user = { id: "3", fincaId: "finca3", role: "external_owner" };

  // Estados de la UI
  const [modalVisible, setModalVisible] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState(null);
  const [selectedColaboradorId, setSelectedColaboradorId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [cedulaConfirmacion, setCedulaConfirmacion] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cedulaError, setCedulaError] = useState("");

  // Estado para alerta flotante (como en ColaboradoresListScreen)
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
    crearColaborador,
    actualizarColaborador,
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
  const handleAdd = () => {
    setEditingColaborador(null);
    setModalVisible(true);
  };

  const handleEdit = (colaborador) => {
    setEditingColaborador(colaborador);
    setModalVisible(true);
  };

  const handleDeletePress = (id) => {
    const colaborador = colaboradores.find((c) => c.id === id);
    if (colaborador) {
      setDeleteTarget(colaborador);
      setCedulaConfirmacion("");
      setCedulaError(""); // Limpiar error al abrir el modal
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
      showAlert("warning", `El colaborador ${deleteTarget.nombre} ha sido eliminado correctamente.`);
      setShowConfirmModal(false);
      setDeleteTarget(null);
      setCedulaConfirmacion("");
      setCedulaError("");
      // Recargar lista
      fetchColaboradores();
    } catch (error) {
      setCedulaError("No se pudo eliminar el colaborador. Intente nuevamente.");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingColaborador) {
        await actualizarColaborador(editingColaborador.id, formData);
        showAlert("success", `Colaborador ${formData.nombre} actualizado correctamente.`);
      } else {
        await crearColaborador({
          ...formData,
          rol: "external_worker",
          fincaId: user.fincaId,
          externalOwnerId: user.id,
        });
        showAlert("success", `Colaborador ${formData.nombre} agregado correctamente.`);
      }
      setModalVisible(false);
      setEditingColaborador(null);
      // Recargar lista
      fetchColaboradores();
    } catch (error) {
      showAlert("danger", "Ocurrió un error al guardar el colaborador. Intente nuevamente.");
    }
  };

  const openStats = (colaboradorId) => {
    setSelectedColaboradorId(colaboradorId);
  };

  return {
    user,
    modalVisible,
    setModalVisible,
    editingColaborador,
    setEditingColaborador,
    selectedColaboradorId,
    setSelectedColaboradorId,
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
    handleAdd,
    handleEdit,
    handleDeletePress,
    confirmDelete,
    handleSubmit,
    openStats,
  };
}