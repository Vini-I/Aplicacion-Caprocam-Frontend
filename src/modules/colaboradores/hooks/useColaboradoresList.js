/**
 * ============================================================
 * HOOK: useColaboradoresList
 * ============================================================
 *
 * Encapsula la lógica de la pantalla principal de colaboradores
 * (ColaboradoresListScreen): estado de pestañas, modales, búsqueda,
 * confirmación de eliminación y operaciones CRUD.
 *
 * Retorna:
 * - activeTab, setActiveTab
 * - modalVisible, setModalVisible
 * - editingColaborador, setEditingColaborador
 * - selectedColaboradorId, setSelectedColaboradorId
 * - searchText, setSearchText
 * - cedulaConfirmacion, setCedulaConfirmacion
 * - deleteTarget, setDeleteTarget
 * - showConfirmModal, setShowConfirmModal
 * - internos, externos, loading, error (según tab activo)
 * - lista, eliminarActual
 * - handleAdd, handleEdit, handleDeletePress, confirmDelete, handleSubmit, openStats
 */

import { useState } from "react";
import { Alert } from "react-native";
import { useColaboradores } from "./useColaboradores";

export function useColaboradoresList() {
  // Estados de la UI
  const [activeTab, setActiveTab] = useState("internos");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState(null);
  const [selectedColaboradorId, setSelectedColaboradorId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [cedulaConfirmacion, setCedulaConfirmacion] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Filtros para cada pestaña
  const filtrosInternos = { rol: "camprocam_worker", activo: true };
  const filtrosExternos = { rol: "external_owner", activo: true };

  // Datos de colaboradores mediante los hooks de cada filtro
  const {
    colaboradores: internos,
    loading: loadingInternos,
    error: errorInternos,
    crearColaborador,
    actualizarColaborador,
    eliminarColaborador,
    fetchColaboradores: fetchInternos,
  } = useColaboradores(filtrosInternos);

  const {
    colaboradores: externos,
    loading: loadingExternos,
    error: errorExternos,
    crearColaborador: crearExterno,
    actualizarColaborador: actualizarExterno,
    eliminarColaborador: eliminarExterno,
    fetchColaboradores: fetchExternos,
  } = useColaboradores(filtrosExternos);

  const loading = activeTab === "internos" ? loadingInternos : loadingExternos;
  const error = activeTab === "internos" ? errorInternos : errorExternos;
  const listaOriginal = activeTab === "internos" ? internos : externos;
  const eliminarActual = activeTab === "internos" ? eliminarColaborador : eliminarExterno;

  // Filtrado local por búsqueda
  const lista = listaOriginal.filter((colab) => {
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
    const colaborador = listaOriginal.find((c) => c.id === id);
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
      await eliminarActual(deleteTarget.id);
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
      if (activeTab === "internos") {
        await actualizarColaborador(editingColaborador.id, formData);
      } else {
        await actualizarExterno(editingColaborador.id, formData);
      }
    } else {
      if (activeTab === "internos") {
        await crearColaborador({ ...formData, rol: "camprocam_worker" });
      } else {
        await crearExterno({ ...formData, rol: "external_owner" });
      }
    }
    setModalVisible(false);
    setEditingColaborador(null);
  };

  const openStats = (colaboradorId) => {
    setSelectedColaboradorId(colaboradorId);
  };

  return {
    activeTab,
    setActiveTab,
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
    internos,
    externos,
    loading,
    error,
    lista,
    eliminarActual,
    handleAdd,
    handleEdit,
    handleDeletePress,
    confirmDelete,
    handleSubmit,
    openStats,
  };
}