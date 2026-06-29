/**
 * ============================================================
 * COMPONENTE: ColaboradoresListScreen
 * ============================================================
 *
 * Pantalla principal de administración de colaboradores.
 * Permite cambiar entre personal interno y dueños externos,
 * buscar, agregar, editar, eliminar y ver detalles de cada colaborador.
 *
 * Dependencias:
 * - useColaboradores hook para manejar datos y operaciones CRUD
 * - Modal personalizado para formularios y confirmación
 *
 * Ejemplo:
 * <ColaboradoresListScreen />
 */

// ============================================================
// IMPORTS
// ============================================================
import React, { useState } from "react";
import { COLORS } from "../../../theme/colors";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useColaboradores } from "../hooks/useColaboradores";
import ColaboradorCard from "../components/ColaboradorCard";
import ColaboradorForm from "../components/ColaboradorForm";
import ColaboradorDetalleScreen from "./ColaboradorDetalleScreen";
import Modal from "../../../shared/components/Modal";
import Spinner from "../../../shared/components/Spinner";
import Button from "../../../shared/components/Button";
import Title from "../../../shared/components/Title";
import Input from "../../../shared/components/Input";
import CustomText from "../../../shared/components/Text";
import { styles } from "../styles/colaboradoresListStyles";

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ColaboradoresListScreen() {
  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------
  const [activeTab, setActiveTab] = useState("internos");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState(null);
  const [selectedColaboradorId, setSelectedColaboradorId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [cedulaConfirmacion, setCedulaConfirmacion] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --------------------------------------------------------
  // FILTROS Y HOOKS
  // --------------------------------------------------------
  const filtrosInternos = { rol: "camprocam_worker", activo: true };
  const filtrosExternos = { rol: "external_owner", activo: true };

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

  // --------------------------------------------------------
  // FILTRADO LOCAL
  // --------------------------------------------------------
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

  // --------------------------------------------------------
  // MANEJADORES DE EVENTOS
  // --------------------------------------------------------

  /** Abre el modal para crear un nuevo colaborador */
  const handleAdd = () => {
    setEditingColaborador(null);
    setModalVisible(true);
  };

  /** Abre el modal para editar un colaborador existente */
  const handleEdit = (colaborador) => {
    setEditingColaborador(colaborador);
    setModalVisible(true);
  };

  /** Muestra el modal de confirmación para eliminar */
  const handleDeletePress = (id) => {
    const colaborador = listaOriginal.find(c => c.id === id);
    if (colaborador) {
      setDeleteTarget(colaborador);
      setCedulaConfirmacion("");
      setShowConfirmModal(true);
    }
  };

  /**
   * Confirma la eliminación verificando que la cédula ingresada coincida.
   * @async
   */
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

  /**
   * Envía el formulario para crear o actualizar.
   * @param {Object} formData - Datos del colaborador
   * @async
   */
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

  /** Abre la pantalla de detalle/estadísticas del colaborador */
  const openStats = (colaboradorId) => {
    setSelectedColaboradorId(colaboradorId);
  };

  // --------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // --------------------------------------------------------
  if (loading) return <Spinner text="Cargando colaboradores..." />;
  if (error) return <CustomText style={styles.error}>Error: {error}</CustomText>;

  // --------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="🔍 Buscar por nombre, teléfono, email o cédula"
            value={searchText}
            onChangeText={setSearchText}
            containerStyle={styles.searchInput}
          />
          <Button onPress={handleAdd} variant="primary" style={styles.addButtonContainer}>
            Agregar colaborador
          </Button>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {lista.map((colab) => (
          <ColaboradorCard
            key={colab.id}
            colaborador={colab}
            onPress={openStats}
            onEdit={handleEdit}
            onDelete={() => handleDeletePress(colab.id)}
          />
        ))}
      </ScrollView>

      {/* Tabs en la parte inferior */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "internos" && styles.activeTab]}
          onPress={() => setActiveTab("internos")}
        >
          <CustomText style={styles.tabText}>Personal Interno</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "externos" && styles.activeTab]}
          onPress={() => setActiveTab("externos")}
        >
          <CustomText style={styles.tabText}>Dueños Externos</CustomText>
        </TouchableOpacity>
      </View>

      {/* Modal para crear/editar */}
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} containerStyle={styles.modalContainer}>
        <Title level={4}>{editingColaborador ? "Editar" : "Nuevo"} colaborador</Title>
        <ColaboradorForm
          initialData={editingColaborador || {}}
          onSubmit={handleSubmit}
          isEditing={!!editingColaborador}
          userRole="camprocam_admin"
        />
      </Modal>

      {/* Modal de confirmación con validación de cédula - AHORA USA EL MODAL REUTILIZABLE */}
      <Modal
        visible={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setCedulaConfirmacion("");
          setDeleteTarget(null);
        }}
        closeText="Cancelar"
        containerStyle={styles.modalConfirmContainer}
        buttonStyle={styles.modalConfirmCancelButton}
      >
        <CustomText style={styles.modalTitle}>Confirmar eliminación</CustomText>

        {deleteTarget && (
          <>
            <CustomText style={styles.modalText}>
              ¿Está seguro que desea eliminar a:
            </CustomText>
            <CustomText style={styles.modalName}>{deleteTarget.nombre}</CustomText>
            <CustomText style={styles.modalSubText}>
              Para confirmar, ingrese la cédula del colaborador:
            </CustomText>
            <CustomText style={styles.modalCedula}>{deleteTarget.cedula}</CustomText>
          </>
        )}

        <Input
          placeholder="Ingrese la cédula para confirmar"
          value={cedulaConfirmacion}
          onChangeText={setCedulaConfirmacion}
          keyboardType="numeric"
          containerStyle={styles.modalInput}
        />

        <View style={styles.modalButtons}>
          <Button 
            onPress={() => {
              setShowConfirmModal(false);
              setCedulaConfirmacion("");
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
        visible={!!selectedColaboradorId}
        onClose={() => setSelectedColaboradorId(null)}
        showCloseButton={false}
        containerStyle={styles.modalDetalleContainer}
        overlayStyle={styles.modalDetalleOverlay}
      >
        <ColaboradorDetalleScreen 
          colaboradorId={selectedColaboradorId}
          onClose={() => setSelectedColaboradorId(null)}
          onSelectTrabajador={(id) => {
            setSelectedColaboradorId(id);
          }}
        />
      </Modal>
    </View>
  );
}