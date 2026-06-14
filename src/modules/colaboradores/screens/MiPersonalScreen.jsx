/**
 * ============================================================
 * COMPONENTE: MiPersonalScreen
 * ============================================================
 *
 * Pantalla utilizada por un dueño externo para gestionar
 * sus trabajadores externos (external_worker).
 * Permite CRUD completo, búsqueda y visualización de detalles.
 *
 * Dependencias:
 * - useColaboradores con filtros fijos (fincaId del dueño, rol external_worker)
 *
 * Ejemplo:
 * <MiPersonalScreen />
 */

// ============================================================
// IMPORTS
// ============================================================
import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Modal as RNModal, Alert } from "react-native";
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
export default function MiPersonalScreen() {
  // --------------------------------------------------------
  // DATOS DEL USUARIO MOCK
  // --------------------------------------------------------
  const user = { id: "3", fincaId: "finca3", role: "external_owner" };

  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------
  const [modalVisible, setModalVisible] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState(null);
  const [selectedColaboradorId, setSelectedColaboradorId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [cedulaConfirmacion, setCedulaConfirmacion] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --------------------------------------------------------
  // HOOK DE DATOS
  // --------------------------------------------------------
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

  // --------------------------------------------------------
  // FILTRADO LOCAL
  // --------------------------------------------------------
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

  // --------------------------------------------------------
  // MANEJADORES
  // --------------------------------------------------------

  /** Abre modal para agregar nuevo trabajador */
  const handleAdd = () => {
    setEditingColaborador(null);
    setModalVisible(true);
  };

  /** Abre modal para editar un trabajador */
  const handleEdit = (colaborador) => {
    setEditingColaborador(colaborador);
    setModalVisible(true);
  };

  /** Muestra el modal de confirmación de eliminación */
  const handleDeletePress = (id) => {
    const colaborador = colaboradores.find(c => c.id === id);
    if (colaborador) {
      setDeleteTarget(colaborador);
      setCedulaConfirmacion("");
      setShowConfirmModal(true);
    }
  };

  /**
   * Confirma eliminación verificando la cédula.
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
      await eliminarColaborador(deleteTarget.id);
      Alert.alert("Éxito", `El colaborador ${deleteTarget.nombre} ha sido eliminado correctamente`);
      setShowConfirmModal(false);
      setDeleteTarget(null);
      setCedulaConfirmacion("");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el colaborador");
    }
  };

  /**
   * Envía el formulario asignando rol, fincaId y externalOwnerId.
   * @param {Object} formData - Datos del trabajador
   * @async
   */
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

  /** Abre pantalla de detalle */
  const openStats = (colaboradorId) => {
    setSelectedColaboradorId(colaboradorId);
  };

  // --------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // --------------------------------------------------------
  if (loading && colaboradores.length === 0) return <Spinner text="Cargando personal..." />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;

  // --------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="🔍 Buscar por nombre, teléfono, email o cédula"
          value={searchText}
          onChangeText={setSearchText}
          containerStyle={styles.searchInput}
        />
        <View style={styles.addButtonContainer}>
        <Button onPress={handleAdd} variant="primary">Agregar colaborador</Button>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {listaFiltrada.map((colab) => (
          <ColaboradorCard
            key={colab.id}
            colaborador={colab}
            onPress={openStats}
            onEdit={handleEdit}
            onDelete={() => handleDeletePress(colab.id)}
          />
        ))}
      </ScrollView>

      {/* Modal para crear/editar */}
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Title level={4}>{editingColaborador ? "Editar" : "Nuevo"} Colaborador</Title>
        <ColaboradorForm
          initialData={editingColaborador || {}}
          onSubmit={handleSubmit}
          isEditing={!!editingColaborador}
          userRole="external_owner"
          fincaId={user.fincaId}
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

      {/* Modal para ver detalles */}
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
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#FFF", marginTop: 8 },
  searchInput: { marginBottom: 0 },
  list: { padding: 16 },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#FFF", borderRadius: 16, padding: 24, width: "85%", maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#DC3545", marginBottom: 16, textAlign: "center" },
  modalText: { fontSize: 14, color: "#4E6482", marginBottom: 8, textAlign: "center" },
  modalName: { fontSize:14, fontWeight: "bold", color: "#1E3A5F", marginBottom: 16, textAlign: "center" },
  modalSubText: { fontSize: 14, color: "#4E6482", marginBottom: 8, textAlign: "center" },
  modalCedula: { fontSize: 14, fontWeight: "600", color: "#009EF5", marginBottom: 16, textAlign: "center" },
  modalInput: { marginBottom: 20 },
  modalButtons: { flexDirection: "row", gap: 12, justifyContent: "center" },
});