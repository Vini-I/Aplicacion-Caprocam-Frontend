// src/modules/colaboradores/hooks/useColaboradoresList.js

/**
 * ============================================================
 * HOOK: useColaboradoresList
 * ============================================================
 *
 * Encapsula la lógica de la pantalla principal de colaboradores
 * (ColaboradoresListScreen): estado de pestañas, modales, búsqueda,
 * confirmación de eliminación y operaciones CRUD.
 *
 * Ahora incluye un sistema de alertas temporales y fijas para
 * feedback visual de las acciones.
 */

import { useState, useRef } from "react";
import { useColaboradores } from "./useColaboradores";

export function useColaboradoresList() {
  // Estados de la UI
  const [activeTab, setActiveTab] = useState("internos");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [cedulaConfirmacion, setCedulaConfirmacion] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cedulaError, setCedulaError] = useState("");

  // Estado para la alerta flotante
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
      await eliminarActual(deleteTarget.id);
      showAlert("warning", `El colaborador ${deleteTarget.nombre} ha sido eliminado correctamente.`);
      setShowConfirmModal(false);
      setDeleteTarget(null);
      setCedulaConfirmacion("");
      setCedulaError("");
    } catch (error) {
      setCedulaError("No se pudo eliminar el colaborador. Intente nuevamente.");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingColaborador) {
        if (activeTab === "internos") {
          await actualizarColaborador(editingColaborador.id, formData);
        } else {
          await actualizarExterno(editingColaborador.id, formData);
        }
        showAlert("success", `Colaborador ${formData.nombre} actualizado correctamente.`);
      } else {
        if (activeTab === "internos") {
          await crearColaborador({ ...formData, rol: "camprocam_worker" });
        } else {
          await crearExterno({ ...formData, rol: "external_owner" });
        }
        showAlert("success", `Colaborador ${formData.nombre} agregado correctamente.`);
      }
      setModalVisible(false);
      setEditingColaborador(null);
    } catch (error) {
      showAlert("danger", "Ocurrió un error al guardar el colaborador. Intente nuevamente.");
    }
  };

  return {
    activeTab,
    setActiveTab,
    modalVisible,
    setModalVisible,
    editingColaborador,
    setEditingColaborador,
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
    internos,
    externos,
    loading,
    error,
    lista,
    handleAdd,
    handleEdit,
    handleDeletePress,
    confirmDelete,
    handleSubmit,
    alert,
  };
}