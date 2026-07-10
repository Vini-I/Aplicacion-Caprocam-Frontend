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
 * - colaboradores, loading, error
 * - listaFiltrada
 * - handleAdd, handleEdit, handleDeletePress, confirmDelete, handleSubmit, openStats
 */

import { useState, useEffect } from "react";
import { Alert } from "react-native";
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
      setShowConfirmModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      Alert.alert("Error", "Colaborador no encontrado");
      setShowConfirmModal(false);
      return;
    }

    if (cedulaConfirmacion !== deleteTarget.cedula) {
      Alert.alert("Error", "La cédula ingresada no coincide con la del colaborador");
      return;
    }

    try {
      await eliminarColaborador(deleteTarget.id);
      Alert.alert("Éxito", `El colaborador ${deleteTarget.nombre} ha sido eliminado correctamente`);
      setShowConfirmModal(false);
      setDeleteTarget(null);
      setCedulaConfirmacion("");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el colaborador");
    }
  };

  const handleSubmit = async (formData) => {
    if (editingColaborador) {
      await actualizarColaborador(editingColaborador.id, formData);
    } else {
      await crearColaborador({
        ...formData,
        rol: "external_worker",
        fincaId: user.fincaId,
        externalOwnerId: user.id,
      });
    }
    setModalVisible(false);
    setEditingColaborador(null);
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