/**
 * ============================================================
 * HOOK: useEquiposListScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Encapsula la lógica de negocio y estado de EquiposListScreen:
 * carga de equipos, búsqueda, filtrado, CRUD y alertas con auto-cierre.
 * Integra el hook base useEquipos con carga de estanques y tipos de equipo.
 *
 * @dependencies - useEquipos de hooks/useEquipos
 *               - equiposService (getEstanquesDisponibles, getTiposEquipo)
 *               - useRouter, useFocusEffect de expo-router
 * @validations  - Confirmación de eliminación mediante coincidencia de código de equipo.
 *               - Filtro de estado operativo alineado a 'activo', 'inactivo', 'mantenimiento'.
 *               - El hook interno usa keys categories/suppliers; la pantalla los traduce
 *                 a categorías/proveedores que usa el hook internamente.
 * @navigation   - navigateToMantEquipo → pantalla principal de mantenimiento.
 * ============================================================
 */

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useEquipos } from "./useEquipos";
import { equiposService } from "../services/equiposService";

export function useEquiposListScreen() {
  const router = useRouter();
  const formRef = useRef();

  // --------------------------------------------------------
  // ESTADOS DE MODALES Y EDICIÓN
  // --------------------------------------------------------
  const [modalVisible, setModalVisible] = useState(false);
  const [codigoError, setCodigoError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [editingEquipo, setEditingEquipo] = useState(null);
  const [selectedEquipoId, setSelectedEquipoId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [codigoConfirmacion, setCodigoConfirmacion] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [estanquesDisponibles, setEstanquesDisponibles] = useState([]);

  useEffect(() => {
    let activo = true;
    equiposService.getEstanquesDisponibles().then((data) => {
      if (activo) setEstanquesDisponibles(data);
    });
    return () => {
      activo = false;
    };
  }, []);

  // Filtros adicionales (tipo de equipo y estado operativo)
  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: "",
  });

  // Alertas globales
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  // Hook base de datos
  const {
    equipos,
    equiposProximosMantenimiento,
    estadisticas,
    loading,
    error,
    crearEquipo,
    actualizarEquipo,
    eliminarEquipo,
    toggleEquipo,
    fetchEquipos,
  } = useEquipos({});

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEquipos();
    }, [fetchEquipos])
  );

  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // --------------------------------------------------------
  // FILTRADO LOCAL
  // --------------------------------------------------------
  const equiposFiltrados = useMemo(() => {
    return equipos.filter((equipo) => {
      if (!searchText) return true;
      const q = searchText.toLowerCase().trim();

      const coincideCampos =
        equipo.nombre.toLowerCase().includes(q) ||
        equipo.codigo.toLowerCase().includes(q) ||
        equipo.descripcion.toLowerCase().includes(q) ||
        (equipo.estado && equipo.estado.toLowerCase().includes(q));

      const palabrasClave = ["mantenimiento", "requiere", "necesita"];
      const contienePalabraClave = palabrasClave.some((palabra) => q.includes(palabra));
      const requiereMantenimiento = equipo.horasUso >= equipo.horasMantenimiento;

      const coincidePorMantenimiento = contienePalabraClave && requiereMantenimiento;

      return coincideCampos || coincidePorMantenimiento;
    });
  }, [equipos, searchText]);

  const opcionesTipo = useMemo(() => {
    return (equiposService.getTiposEquipo() || []).map((tipo) =>
      typeof tipo === "string" ? { label: tipo, value: tipo } : tipo
    );
  }, []);

  // Opciones de estado alineadas a los valores de estadoOperativo
  const opcionesEstado = useMemo(() => [
    { label: "Activo", value: "activo" },
    { label: "Inactivo", value: "inactivo" },
    { label: "Mantenimiento", value: "mantenimiento" },
  ], []);

  const equiposFinales = useMemo(() => {
    return equiposFiltrados.filter((equipo) => {
      if (
        filtros.categories.length > 0 &&
        !filtros.categories.includes(equipo.tipo)
      )
        return false;

      if (filtros.suppliers.length > 0) {
        if (!filtros.suppliers.includes(equipo.estado)) return false;
      }

      return true;
    });
  }, [equiposFiltrados, filtros]);

  const hayFiltrosActivos =
    searchText.trim() !== "" ||
    filtros.categories.length > 0 ||
    filtros.suppliers.length > 0;

  // --------------------------------------------------------
  // MANEJADORES
  // --------------------------------------------------------
  const handleAdd = () => {
    router.push("/equipos/registrarEquipo");
  };

  const handleEdit = (equipo) => {
    setEditingEquipo(equipo);
    setModalVisible(true);
    setValidationError("");
  };

  const handleDeletePress = (id) => {
    const equipo = equipos.find((e) => e.id === id);
    if (equipo) {
      setDeleteTarget(equipo);
      setCodigoConfirmacion("");
      setShowConfirmModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      setCodigoError("Equipo no encontrado");
      return;
    }

    if (codigoConfirmacion !== deleteTarget.codigo) {
      setCodigoError("El código ingresado no coincide con el del equipo");
      return;
    }

    try {
      await eliminarEquipo(deleteTarget.id);
      showAlert("danger", `El equipo "${deleteTarget.nombre}" ha sido eliminado correctamente`);
      setShowConfirmModal(false);
      setDeleteTarget(null);
      setCodigoConfirmacion("");
      setCodigoError("");
      fetchEquipos();
    } catch (error) {
      setCodigoError("No se pudo eliminar el equipo");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingEquipo) {
        await actualizarEquipo(editingEquipo.id, formData);
        showAlert("success", `Equipo "${formData.nombre}" actualizado correctamente`);
      } else {
        await crearEquipo(formData);
        showAlert("success", `Equipo "${formData.nombre}" creado correctamente`);
      }
      setModalVisible(false);
      setEditingEquipo(null);
      fetchEquipos();
    } catch (error) {
      showAlert("danger", error.message || "Ocurrió un error al guardar el equipo");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleEquipo(id);
      fetchEquipos();
    } catch (error) {
      showAlert("danger", "No se pudo cambiar el estado del equipo");
    }
  };

  const openDetail = (equipoId) => {
    router.push(`/equipos/detalleEquipo?id=${equipoId}`);
  };

  const navigateToMantEquipo = () => {
    router.push("/equipos/mantEquipo");
  };

  return {
    equipos,
    equiposProximosMantenimiento,
    estadisticas,
    loading,
    error,
    modalVisible,
    setModalVisible,
    codigoError,
    setCodigoError,
    validationError,
    setValidationError,
    editingEquipo,
    setEditingEquipo,
    selectedEquipoId,
    setSelectedEquipoId,
    searchText,
    setSearchText,
    codigoConfirmacion,
    setCodigoConfirmacion,
    deleteTarget,
    setDeleteTarget,
    showConfirmModal,
    setShowConfirmModal,
    estanquesDisponibles,
    filtros,
    setFiltros,
    alert,
    formRef,
    equiposFinales,
    opcionesTipo,
    opcionesEstado,
    hayFiltrosActivos,
    handleAdd,
    handleEdit,
    handleDeletePress,
    confirmDelete,
    handleSubmit,
    handleToggle,
    openDetail,
    navigateToMantEquipo,
  };
}
