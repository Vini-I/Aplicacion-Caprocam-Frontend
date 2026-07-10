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
import { View, ScrollView, Alert } from "react-native";
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
import { styles } from "../styles/miPersonalStyles";

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
  if (error) return <CustomText style={styles.error}>Error: {error}</CustomText>;

  // --------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar por nombre, teléfono, email o cédula"
          value={searchText}
          onChangeText={setSearchText}
          containerStyle={styles.searchInput}
        />
        <Button onPress={handleAdd} variant="primary">
          Agregar colaborador
        </Button>
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
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} containerStyle={styles.modalContainer}>
        <Title level={4}>{editingColaborador ? "Editar" : "Nuevo"} Colaborador</Title>
        <ColaboradorForm
          initialData={editingColaborador || {}}
          onSubmit={handleSubmit}
          isEditing={!!editingColaborador}
          userRole="external_owner"
          fincaId={user.fincaId}
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