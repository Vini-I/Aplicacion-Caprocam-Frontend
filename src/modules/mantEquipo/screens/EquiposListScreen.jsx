/**
 * ============================================================
 * COMPONENTE: EquiposListScreen
 * ============================================================
 *
 * Pantalla principal del módulo de equipos.
 * Muestra el listado de equipos registrados, permite buscar, agregar,
 * editar y eliminar equipos, y ofrece acceso al módulo de mantenimiento
 * de equipos (tickets).
 *
 * Dependencias:
 * - useEquipos hook para manejar datos y operaciones CRUD
 * - SearchBar compartido desde inventarios
 * - Layout global STYLE
 * - Componentes compartidos de la aplicación
 *
 * Ejemplo:
 * <EquiposListScreen />
 */

// ============================================================
// IMPORTS
// ============================================================
import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
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
import SearchBar from "../../inventarios/components/SearchBar";
import { STYLE } from "../../../theme/style";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/equiposListStyles";

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function EquiposListScreen() {
  const router = useRouter();

  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEquipo, setEditingEquipo] = useState(null);
  const [selectedEquipoId, setSelectedEquipoId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [codigoConfirmacion, setCodigoConfirmacion] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  /** Abre modal para agregar nuevo equipo */
  const handleAdd = () => {
    setEditingEquipo(null);
    setModalVisible(true);
  };

  /** Abre modal para editar un equipo */
  const handleEdit = (equipo) => {
    setEditingEquipo(equipo);
    setModalVisible(true);
  };

  /** Muestra el modal de confirmación de eliminación */
  const handleDeletePress = (id) => {
    const equipo = equipos.find(e => e.id === id);
    if (equipo) {
      setDeleteTarget(equipo);
      setCodigoConfirmacion("");
      setShowConfirmModal(true);
    }
  };

  /**
   * Confirma eliminación verificando el código del equipo.
   * @async
   */
  const confirmDelete = async () => {
    if (!deleteTarget) {
      Alert.alert("Error", "Equipo no encontrado");
      setShowConfirmModal(false);
      return;
    }

    if (codigoConfirmacion !== deleteTarget.codigo) {
      Alert.alert("Error", "El código ingresado no coincide con el del equipo");
      return;
    }

    try {
      await eliminarEquipo(deleteTarget.id);
      Alert.alert("Éxito", `El equipo ${deleteTarget.nombre} ha sido eliminado correctamente`);
      setShowConfirmModal(false);
      setDeleteTarget(null);
      setCodigoConfirmacion("");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el equipo");
    }
  };

  /**
   * Envía el formulario para crear o actualizar.
   * @param {Object} formData - Datos del equipo
   * @async
   */
  const handleSubmit = async (formData) => {
    if (editingEquipo) {
      await actualizarEquipo(editingEquipo.id, formData);
    } else {
      await crearEquipo(formData);
    }
    setModalVisible(false);
    setEditingEquipo(null);
  };

  /** Alterna el estado de encendido/apagado del equipo */
  const handleToggle = async (id) => {
    try {
      await toggleEquipo(id);
    } catch (error) {
      Alert.alert("Error", "No se pudo cambiar el estado del equipo");
    }
  };

  /** Abre pantalla de detalle */
  const openDetail = (equipoId) => {
    setSelectedEquipoId(equipoId);
  };

  /** Navega al módulo de mantenimiento de equipos (tickets) */
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
      <View style={[STYLE.contentWrapper, { flex: 1 }]}>
        {/* Barra de búsqueda y botones de acción */}
        <View style={styles.searchRow}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="🔍 Buscar por nombre, código, marca o modelo"
            containerStyle={styles.searchInput}
          />
          {/* Botón "Ver Mantenimiento" - outline con borde warning */}
          <Button
            variant="outline"
            onPress={navigateToMantEquipo}
            style={[styles.btnAction, { borderColor: COLORS.warning }]}
          >
            <Icon icon={ICONS.clipboard} size={16} color={COLORS.warning} />
            <CustomText style={{ color: COLORS.warning, fontWeight: "600", fontSize: 13 }}>
              Ver Mantenimiento
            </CustomText>
          </Button>
          {/* Botón "Agregar equipo" - outline con borde primary (igual estilo que el anterior) */}
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

        {/* Alertas de mantenimiento */}
        {equiposProximosMantenimiento.length > 0 && (
          <View style={styles.alertasContainer}>
            <CustomText style={styles.alertasTitle}>
              ⚠️ Equipos próximos a mantenimiento
            </CustomText>
            <CustomText style={styles.alertasTitle}>
            .
            </CustomText>
            {equiposProximosMantenimiento.slice(0, 5).map((equipo) => {
              const restantes = Math.round(equipo.horasMantenimiento - equipo.horasUso);
              const esCritico = restantes <= 20;
              return (
                <View
                  key={equipo.id}
                  style={[
                    styles.alertaCard,
                    esCritico && styles.alertaCardCritica
                  ]}
                >
                  <View style={[
                    styles.alertaIcon,
                    esCritico && styles.alertaIconCritica
                  ]}>
                    <Icon
                      icon={ICONS.notification}
                      size={16}
                      color={COLORS.white}
                    />
                  </View>
                  <View style={styles.alertaContent}>
                    <CustomText style={styles.alertaTitle}>
                      {equipo.nombre}
                    </CustomText>
                    <CustomText style={styles.alertaDescription}>
                      {equipo.codigo} · {equipo.ubicacion || "Sin ubicación"}
                    </CustomText>
                  </View>
                  <CustomText style={[
                    styles.alertaHoras,
                    esCritico && styles.alertaHorasCritica
                  ]}>
                    {restantes} h
                  </CustomText>
                </View>
              );
            })}
            {equiposProximosMantenimiento.length > 5 && (
              <CustomText style={styles.alertasMore}>
                +{equiposProximosMantenimiento.length - 5} equipos más
              </CustomText>
            )}
          </View>
        )}

        {/* Lista de equipos */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.list}>
          {equiposFiltrados.map((equipo) => (
            <EquipoCard
              key={equipo.id}
              equipo={equipo}
              onPress={openDetail}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={() => handleDeletePress(equipo.id)}
            />
          ))}
        </ScrollView>

        {/* Modal para crear/editar */}
        <Modal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          containerStyle={styles.modalContainer}
        >
          <Title level={4}>
            {editingEquipo ? "Editar equipo" : "Nuevo equipo"}
          </Title>
          <EquipoForm
            initialData={editingEquipo || {}}
            onSubmit={handleSubmit}
            isEditing={!!editingEquipo}
          />
        </Modal>

        {/* Modal de confirmación con validación de código */}
        <Modal
          visible={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setCodigoConfirmacion("");
            setDeleteTarget(null);
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
          <View style={styles.modalButtons}>
            <Button
              onPress={() => {
                setShowConfirmModal(false);
                setCodigoConfirmacion("");
                setDeleteTarget(null);
              }}
              variant="outline"
              style={styles.modalCancelBtn}
            >
              Cancelar
            </Button>
            <Button
              onPress={confirmDelete}
              variant="danger"
              style={styles.modalDeleteBtn}
            >
              Eliminar
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