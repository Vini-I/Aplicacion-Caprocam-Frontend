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
 * - Modal personalizado y nativo para formularios y confirmación
 *
 * Ejemplo:
 * <ColaboradoresListScreen />
 */

// ============================================================
// IMPORTS
// ============================================================
import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Modal as RNModal, Alert } from "react-native";
import { useColaboradores } from "../hooks/useColaboradores";
import ColaboradorCard from "../components/ColaboradorCard";
import ColaboradorForm from "../components/ColaboradorForm";
import ColaboradorDetalleScreen from "./ColaboradorDetalleScreen";
import Modal from "../../../shared/components/Modal";
import Spinner from "../../../shared/components/Spinner";
import Button from "../../../shared/components/Button";
import Title from "../../../shared/components/Title";
import Input from "../../../shared/components/Input";

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
  if (error) return <Text style={styles.error}>Error: {error}</Text>;

  // --------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "internos" && styles.activeTab]}
          onPress={() => setActiveTab("internos")}
        >
          <Text style={styles.tabText}>Personal Interno</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "externos" && styles.activeTab]}
          onPress={() => setActiveTab("externos")}
        >
          <Text style={styles.tabText}>Dueños Externos</Text>
        </TouchableOpacity>
      </View>

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

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Title level={4}>{editingColaborador ? "Editar" : "Nuevo"} colaborador</Title>
        <ColaboradorForm
          initialData={editingColaborador || {}}
          onSubmit={handleSubmit}
          isEditing={!!editingColaborador}
          userRole="camprocam_admin"
        />
      </Modal>

      {/* Modal de confirmación con validación de cédula */}
      <RNModal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar eliminación</Text>

            {deleteTarget && (
              <>
                <Text style={styles.modalText}>
                  ¿Está seguro que desea eliminar a:
                </Text>
                <Text style={styles.modalName}>{deleteTarget.nombre}</Text>
                <Text style={styles.modalSubText}>
                  Para confirmar, ingrese la cédula del colaborador:
                <Text style={styles.modalCedula}>{deleteTarget.cedula}</Text>
                </Text>
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
              <Button onPress={() => setShowConfirmModal(false)} variant="outline">
                Cancelar
              </Button>
              <Button onPress={confirmDelete} variant="danger">
                Eliminar
              </Button>
            </View>
          </View>
        </View>
      </RNModal>

      <RNModal
        visible={!!selectedColaboradorId}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedColaboradorId(null)}
      >
        <ColaboradorDetalleScreen 
          colaboradorId={selectedColaboradorId}
          onClose={() => setSelectedColaboradorId(null)}
          onSelectTrabajador={(id) => {
            setSelectedColaboradorId(id);
          }}
        />
      </RNModal>
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7FA" },
  tabBar: { flexDirection: "row", backgroundColor: "#FFF", paddingHorizontal: 16, paddingTop: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  activeTab: { borderBottomColor: "#009EF5" },
  tabText: { fontWeight: "600", color: "#1E3A5F" },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#ffffff", marginTop: 8 },
  searchInput: { marginBottom: 0 },
  list: { padding: 16 },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#FFF", borderRadius: 16, padding: 24, width: "85%", maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#DC3545", marginBottom: 16, textAlign: "center" },
  modalText: { fontSize: 14, color: "#4E6482", marginBottom: 8, textAlign: "center" },
  modalName: { fontSize: 14, fontWeight: "bold", color: "#1E3A5F", marginBottom: 16, textAlign: "center" },
  modalSubText: { fontSize: 14, color: "#4E6482", marginBottom: 8, textAlign: "center" },
  modalCedula: { fontSize: 14, fontWeight: "600", color: "#009EF5", marginBottom: 16, textAlign: "center" },
  modalInput: { marginBottom: 20 },
  modalButtons: { flexDirection: "row", gap: 12, justifyContent: "center" },
});