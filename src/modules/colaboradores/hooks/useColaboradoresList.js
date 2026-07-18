// src/modules/colaboradores/hooks/useColaboradoresList.js

import { useState, useRef } from "react";
import { useColaboradores } from "./useColaboradores";

export function useColaboradoresList() {
  // Estados de la UI
  const [activeTab, setActiveTab] = useState("internos");
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
    eliminarColaborador,
    fetchColaboradores: fetchInternos,
  } = useColaboradores(filtrosInternos);

  const {
    colaboradores: externos,
    loading: loadingExternos,
    error: errorExternos,
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

  return {
    activeTab,
    setActiveTab,
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
    loading,
    error,
    lista,
    handleDeletePress,
    confirmDelete,
    alert,
  };
}