/**
 * ============================================================
 * COMPONENTE: EquiposListScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Pantalla principal del módulo de equipos.
 * Muestra el listado de equipos registrados, permite buscar, agregar,
 * editar y eliminar equipos, y ofrece acceso al módulo de mantenimiento
 * de equipos (tickets).
 *
 * Funcionalidad:
 * - Lista equipos con búsqueda y filtros (por tipo de equipo y estado,
 *   mediante FilterButton ubicado junto a la barra de búsqueda).
 * - Modal para crear/editar equipos con validaciones.
 * - Modal de detalle de equipo.
 * - Modal de confirmación para eliminar.
 * - Alertas de éxito/error al crear, editar o eliminar.
 * - Botón "Añadir equipo" fijo en la parte inferior de la lista,
 *   independiente del scroll (mismo estándar de ancho que en Tareas).
 * - Muestra EmptyState cuando no hay equipos o no hay coincidencias,
 *   con mensaje diferenciado y botón de acción cuando no hay filtros.
 *
 * Dependencias:
 * - useEquipos hook para manejar datos y operaciones CRUD
 * - SearchBar y FilterButton compartidos desde inventarios
 * - Layout global STYLE
 * - Componentes compartidos de la aplicación
 *
 * Estándares cumplidos:
 * - Botón flotante "Añadir equipo" (#1)
 * - Alertas de éxito/error con timeout de 3s (#2)
 * - Alert de error de validación mostrado sobre los botones del modal (#3)
 * - Botones CRUD con texto "Registrar equipo" / "Actualizar equipo" (#4)
 * - Navegación a detalle mediante CardPress (#5)
 * - Gaps controlados (#6)
 * - Formulario dentro de modal (separado de detalle) (#7)
 * ============================================================
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useEquipos } from "../hooks/useEquipos";
import EquipoCard from "../components/EquipoCard";
import EquipoForm from "../components/EquipoForm";
import EquipoDetalleScreen from "./EquipoDetalleScreen";
import Modal from "../../../shared/components/Modal";
import Spinner from "../../../shared/components/Spinner";
import Button from "../../../shared/components/Button";
import Title from "../../../shared/components/Title";
import Input from "../../../shared/components/Input";
import CustomText from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Alert from "../../../shared/components/Alert";
import EmptyState from "../../../shared/components/EmptyState";
import SearchBar from "../../../shared/components/SearchBar";
import FilterButton from "../../../shared/components/FilterButton";
import { STYLE } from "../../../theme/style";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/equiposListStyles";
import { equiposService } from "../services/equiposService";
import { useError } from "../../../shared/context/ErrorContext";

export default function EquiposListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const formRef = useRef();
  const { mostrarError } = useError();

  // --------------------------------------------------------
  // ESTADOS
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

  // Estanques disponibles para asociar en el formulario.
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

  // Filtros adicionales (tipo de equipo y estado), aplicados sobre la
  // búsqueda por texto ya resuelta en equiposFiltrados
  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: "",
  });

  // Estado para alertas (éxito/validaciones)
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  // --------------------------------------------------------
  // HOOK DE DATOS
  // --------------------------------------------------------
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
    togglingId,
    fetchEquipos,
  } = useEquipos({});

  // Limpiar timeout al desmontar
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

  // Función para mostrar alerta con auto‑cierre (3 segundos)
  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  // Mostrar alerta desde parámetros de ruta (ej. después de eliminar)
  useEffect(() => {
    const { alertType, alertMessage } = params;
    if (alertType && alertMessage) {
      showAlert(alertType, alertMessage);
      router.setParams({ alertType: undefined, alertMessage: undefined });
    }
  }, [params.alertType, params.alertMessage]);

  // --------------------------------------------------------
  // FILTRADO LOCAL
  // --------------------------------------------------------
  const equiposFiltrados = equipos.filter((equipo) => {
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

  const opcionesTipo = (equiposService.getTiposEquipo() || []).map((tipo) =>
    typeof tipo === "string" ? { label: tipo, value: tipo } : tipo
  );

  const opcionesEstado = [
    { label: "Encendido", value: "encendido" },
    { label: "Apagado", value: "apagado" },
  ];

  const equiposFinales = useMemo(() => {
    return equiposFiltrados.filter((equipo) => {
      if (
        filtros.categories.length > 0 &&
        !filtros.categories.includes(equipo.tipo)
      )
        return false;

      if (filtros.suppliers.length > 0) {
        const valorEncendido = equipo.encendido ? "encendido" : "apagado";
        if (!filtros.suppliers.includes(valorEncendido)) return false;
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
    const equipo = equipos.find(e => e.id === id);
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
      showAlert("success", `El equipo "${deleteTarget.nombre}" ha sido eliminado correctamente`);
      setShowConfirmModal(false);
      setDeleteTarget(null);
      setCodigoConfirmacion("");
      setCodigoError("");
      fetchEquipos();
    } catch (error) {
      // El error ya se muestra en el modal global, solo mostramos mensaje local si es de validación
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
      // El error ya se muestra en el modal global, solo mostramos validación local
      showAlert("danger", error.message || "Ocurrió un error al guardar el equipo");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleEquipo(id);
    } catch (error) {
      mostrarError(error);
    }
  };

  const openDetail = (equipoId) => {
    router.push(`/equipos/detalleEquipo?id=${equipoId}`);
  };

  // --------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // --------------------------------------------------------
  if (loading && equipos.length === 0) return <Spinner text="Cargando equipos..." />;
  if (error) return <CustomText style={styles.error}>Error: {error}</CustomText>;

  // --------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------
  return (
    <View style={STYLE.container}>
      <View style={[STYLE.contentWrapper, styles.mainFlex]}>
        
        {/* Alerta flotante (éxito/validación) */}
        {alert && (
          <View style={[STYLE.contentWrapper]}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}

        <View style={styles.searchRow}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar por nombre, código o descripción"
            containerStyle={styles.searchInput}
          />
          <FilterButton
            categories={opcionesTipo}
            suppliers={opcionesEstado}
            activeFilters={filtros}
            onApply={(f) =>
              setFiltros({
                categories: f.categories || [],
                suppliers: f.suppliers || [],
                units: [],
                lowStock: false,
                expiryDate: "",
              })
            }
            showLowStock={false}
            showExpiryDate={false}
            buttonStyle={styles.filterButtonStyle}
          />
        </View>

        {/* Lista o EmptyState */}
        {equiposFinales.length === 0 ? (
          <EmptyState
            title={hayFiltrosActivos ? "Sin resultados" : "No hay equipos registrados"}
            description={
              hayFiltrosActivos
                ? "No se encontraron equipos con los criterios de búsqueda seleccionados."
                : "Comienza agregando tu primer equipo."
            }
          />
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {equiposFinales.map((equipo) => (
              <EquipoCard
                key={equipo.id}
                equipo={equipo}
                onPress={openDetail}
                onToggle={handleToggle}
                isToggling={togglingId === equipo.id}
              />
            ))}
          </ScrollView>
        )}

        <View style={styles.floatingButtonContainer}>
          <Button variant="outline" onPress={handleAdd} style={styles.floatingButton}>
            <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
            <CustomText style={styles.floatingButtonText}>Añadir equipo</CustomText>
          </Button>
        </View>

        {/* Modal para crear/editar */}
        <Modal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setValidationError("");
          }}
          showCloseButton={false}
          containerStyle={styles.modalContainer}
        >
          <View style={styles.modalContentContainer}>
            <Title level={4} style={styles.modalTitleHeader}>
              {editingEquipo ? "Editar equipo" : "Nuevo equipo"}
            </Title>

            <ScrollView
              style={styles.modalScrollForm}
              contentContainerStyle={styles.modalScrollFormContent}
              showsVerticalScrollIndicator={false}
            >
              <EquipoForm
                ref={formRef}
                initialData={editingEquipo || {}}
                onSubmit={handleSubmit}
                isEditing={!!editingEquipo}
                hideSubmitButton={true}
                tiposEquipo={equiposService.getTiposEquipo()}
                estanquesDisponibles={estanquesDisponibles}
                onValidationError={(msg) => setValidationError(msg)}
              />
            </ScrollView>

            {/* Alert de error de validación (justo encima de los botones) */}
            {validationError && (
              <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                <Alert
                  variant="danger"
                  message={validationError}
                  style={{ marginBottom: 0 }}
                />
              </View>
            )}

            <View style={styles.modalFooterButtons}>
              <Button
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={styles.modalFooterButton}
              >
                <Icon icon={ICONS.exit} size={18} color={COLORS.primary} />
                <CustomText style={styles.modalFooterButtonText}>Cancelar</CustomText>
              </Button>

              <Button
                variant="outline"
                onPress={() => formRef.current?.submit()}
                style={styles.modalFooterButton}
              >
                <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
                <CustomText style={styles.modalFooterButtonText}>
                  {editingEquipo ? "Actualizar equipo" : "Registrar equipo"}
                </CustomText>
              </Button>
            </View>
          </View>
        </Modal>

        {/* Modal de confirmación con validación de código */}
        <Modal
          visible={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setCodigoConfirmacion("");
            setDeleteTarget(null);
            setCodigoError("");
          }}
          showCloseButton={false}
          containerStyle={styles.modalConfirmContainer}
        >
          <CustomText style={styles.modalTitle}>Confirmar eliminación</CustomText>
          {deleteTarget && (
            <>
              <CustomText style={styles.modalText}>
                ¿Está seguro que desea eliminar el equipo:
              </CustomText>
              <CustomText style={styles.modalName}>{deleteTarget.nombre}</CustomText>
              <CustomText style={styles.modalSubText}>
                Para confirmar, ingrese el código del equipo:
              </CustomText>
              <CustomText style={styles.modalCodigo}>{deleteTarget.codigo}</CustomText>
            </>
          )}
          <Input
            placeholder="Ingrese el código para confirmar"
            value={codigoConfirmacion}
            onChangeText={setCodigoConfirmacion}
            autoCapitalize="characters"
            containerStyle={styles.modalInput}
          />
          {codigoError !== "" && (
            <Alert
              variant="danger"
              message={codigoError}
              style={styles.modalErrorAlert}
            />
          )}
          <View style={styles.modalButtons}>
            <Button
              onPress={() => {
                setShowConfirmModal(false);
                setCodigoConfirmacion("");
                setDeleteTarget(null);
                setCodigoError("");
              }}
              variant="outline"
              style={styles.modalCancelBtn}
            >
              <Icon icon={ICONS.exit} size={16} color={COLORS.primary} />
              <CustomText style={styles.modalCancelBtnText}>Cancelar</CustomText>
            </Button>
            <Button
              onPress={confirmDelete}
              variant="outline"
              style={styles.modalDeleteBtn}
            >
              <Icon icon={ICONS.delete} size={16} color={COLORS.error} />
              <CustomText style={styles.modalDeleteBtnText}>Eliminar</CustomText>
            </Button>
          </View>
        </Modal>

        {/* Modal para ver detalles */}
        <Modal
          visible={!!selectedEquipoId}
          onClose={() => setSelectedEquipoId(null)}
          showCloseButton={false}
          containerStyle={styles.modalDetalleContainer}
          overlayStyle={styles.modalDetalleOverlay}
        >
          <EquipoDetalleScreen
            equipoId={selectedEquipoId}
            onClose={() => setSelectedEquipoId(null)}
            onEdit={(equipo) => {
              setSelectedEquipoId(null);
              setEditingEquipo(equipo);
              setModalVisible(true);
            }}
            onDelete={(id) => {
              setSelectedEquipoId(null);
              handleDeletePress(id);
            }}
            onToggle={handleToggle}
          />
        </Modal>
      </View>
    </View>
  );
}