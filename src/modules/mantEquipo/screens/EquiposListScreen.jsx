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
 * - Lista equipos con búsqueda y filtros.
 * - Modal para crear/editar equipos con validaciones.
 * - Modal de detalle de equipo.
 * - Modal de confirmación para eliminar.
 * - Alertas de éxito/error al crear, editar o eliminar.
 *
 * Dependencias:
 * - useEquipos hook para manejar datos y operaciones CRUD
 * - SearchBar compartido desde inventarios
 * - Layout global STYLE
 * - Componentes compartidos de la aplicación
 * ============================================================
 */

import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, Alert as RNAlert } from "react-native";
import { useRouter } from "expo-router";
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
import SearchBar from "../../inventarios/components/SearchBar";
import { STYLE } from "../../../theme/style";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/equiposListStyles";
import { equiposService } from "../services/equiposService";
import { useFocusEffect } from "expo-router";


export default function EquiposListScreen() {
  const router = useRouter();
  const formRef = useRef();

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

  // Estado para alertas globales
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

  // --------------------------------------------------------
  // FILTRADO LOCAL
  // --------------------------------------------------------
  const equiposFiltrados = equipos.filter((equipo) => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return (
      equipo.nombre.toLowerCase().includes(q) ||
      equipo.codigo.toLowerCase().includes(q) ||
      equipo.descripcion.toLowerCase().includes(q) ||
      equipo.marca.toLowerCase().includes(q) ||
      equipo.modelo.toLowerCase().includes(q)
    );
  });

  // --------------------------------------------------------
  // MANEJADORES
  // --------------------------------------------------------
  const handleAdd = () => {
router.push("/registrarEquipo");
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
    showAlert("warning", `El equipo "${deleteTarget.nombre}" ha sido eliminado correctamente`);
    setShowConfirmModal(false);
    setDeleteTarget(null);
    setCodigoConfirmacion("");
    setCodigoError(""); // limpiar error al éxito
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
      // Recargar lista
      fetchEquipos();
    } catch (error) {
      showAlert("danger", error.message || "Ocurrió un error al guardar el equipo");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleEquipo(id);
      // Recargar lista
      fetchEquipos();
    } catch (error) {
      showAlert("danger", "No se pudo cambiar el estado del equipo");
    }
  };

  const openDetail = (equipoId) => {
    setSelectedEquipoId(equipoId);
  };

  const navigateToMantEquipo = () => {
    router.push("/mantEquipo/mantEquipo");
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
  <View style={styles.container}>
    {/* Barra de búsqueda y botones de acción - sin wrapper que limite ancho */}
    <View style={{ flex: 1 }}>
      <View style={styles.searchRow}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar por nombre, código, marca o modelo"
          containerStyle={styles.searchInput}
        />
        <Button
          variant="outline"
          onPress={navigateToMantEquipo}
          style={[styles.btnAction, { borderColor: COLORS.primary }]}
        >
          <Icon icon={ICONS.clipboard} size={16} color={COLORS.primary} />
          <CustomText style={{ color: COLORS.primary, fontWeight: "600", fontSize: 13 }}>
            Ver Mantenimiento
          </CustomText>
        </Button>
        <Button
          variant="outline"
          onPress={handleAdd}
          style={[styles.btnAction, { borderColor: COLORS.primary }]}
        >
          <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
          <CustomText style={{ color: COLORS.primary, fontWeight: "600", fontSize: 13 }}>
            Agregar equipo
          </CustomText>
        </Button>
      </View>

{/* Alerta flotante: se muestra debajo de la barra de búsqueda, dentro del flujo */}
{alert && (
  <View style={styles.alertWrapper}>
    <Alert variant={alert.type} message={alert.message} />
  </View>
)}

      {/* Lista de equipos - ahora ocupa todo el ancho disponible */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.list}>
        {equiposFiltrados.map((equipo) => (
          <EquipoCard
            key={equipo.id}
            equipo={equipo}
            onPress={openDetail}
            onToggle={handleToggle}
          />
        ))}
      </ScrollView>

        {/* Modal para crear/editar */}
        <Modal
          visible={modalVisible}
            onClose={() => {
    setModalVisible(false);
    setValidationError(""); // <-- limpiar error
  }}
          showCloseButton={false}
          containerStyle={styles.modalContainer
            
          }
          
        >
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Title level={4} style={{ padding: 16, paddingBottom: 0 }}>
              {editingEquipo ? "Editar equipo" : "Nuevo equipo"}
            </Title>

            <ScrollView
              style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              <EquipoForm
                ref={formRef}
                initialData={editingEquipo || {}}
                onSubmit={handleSubmit}
                isEditing={!!editingEquipo}
                hideSubmitButton={true}
                tiposEquipo={equiposService.getTiposEquipo()}
                subcategorias={equiposService.getSubcategorias}
                estanquesDisponibles={equiposService.getEstanquesDisponibles()}
  onValidationError={(msg) => setValidationError(msg)} // <-- Cambiar aquí
              />
            </ScrollView>

            {/* Botones fijos en la parte inferior */}
            <View
              style={{
                flexDirection: "row",
                padding: 16,
                borderTopWidth: 1,
                borderTopColor: COLORS.secondary,
                backgroundColor: COLORS.white,
                gap: 12,
              }}
            >
              <Button
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  borderColor: COLORS.primary,
                  backgroundColor: "transparent",
                }}
              >
                <Icon icon={ICONS.exit} size={18} color={COLORS.primary} />
                <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>
                  Cancelar
                </CustomText>
              </Button>

<Button
  variant="outline"
  onPress={() => formRef.current?.submit()}
  style={{
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
  }}
>
  <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
  <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>
    {editingEquipo ? "Actualizar" : "Registrar"}
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
    setCodigoError(""); // ← agregar esta línea
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
          {/* Alerta de error dentro del modal */}
{codigoError !== "" && (
  <Alert
    variant="danger"
    message={codigoError}
    style={{ marginBottom: 12 }}
  />
)}
          
          <View style={styles.modalButtons}>
<Button
  onPress={() => {
    setShowConfirmModal(false);
    setCodigoConfirmacion("");
    setDeleteTarget(null);
    setCodigoError(""); // ← agregar
  }}
              variant="outline"
              style={[styles.modalCancelBtn, { flexDirection: "row", alignItems: "center", gap: 6 }]}
            >
              <Icon icon={ICONS.exit} size={16} color={COLORS.primary} />
              <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>Cancelar</CustomText>
            </Button>
    <Button
      onPress={confirmDelete}
      variant="outline"
      style={[
        styles.modalDeleteBtn,
        {
          borderColor: COLORS.error,      
          flexDirection: "row",
        },
      ]}
      textStyle={{ color: COLORS.error }} // texto rojo
    >
      <Icon icon={ICONS.delete} size={16} color={COLORS.error} />
      <CustomText style={{ color: COLORS.error, fontWeight: "600" }}>
        Eliminar
      </CustomText>
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