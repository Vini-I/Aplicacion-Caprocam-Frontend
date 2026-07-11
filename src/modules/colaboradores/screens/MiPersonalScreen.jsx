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
 * - useMiPersonal hook para lógica y estado
 */

// ============================================================
// IMPORTS
// ============================================================
import React from "react";
import { View, ScrollView } from "react-native";
import { useMiPersonal } from "../hooks/useMiPersonal";
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
import { STYLE } from "../../../theme/style"; // ← NUEVO IMPORT

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function MiPersonalScreen() {
  const {
    user,
    modalVisible,
    setModalVisible,
    editingColaborador,
    setEditingColaborador,
    selectedColaboradorId,
    setSelectedColaboradorId,
    searchText,
    setSearchText,
    cedulaConfirmacion,
    setCedulaConfirmacion,
    deleteTarget,
    setDeleteTarget,
    showConfirmModal,
    setShowConfirmModal,
    loading,
    error,
    listaFiltrada,
    handleAdd,
    handleEdit,
    handleDeletePress,
    confirmDelete,
    handleSubmit,
    openStats,
  } = useMiPersonal();

  // --------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // --------------------------------------------------------
  if (loading && listaFiltrada.length === 0) return <Spinner text="Cargando personal..." />;
  if (error) return <CustomText style={styles.error}>Error: {error}</CustomText>;

  // --------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------
  return (
    <View style={[STYLE.container, { flex: 1 }]}>          {/* ← USO DE STYLE.container */}
      <View style={[STYLE.contentWrapper, { flex: 1 }]}>   {/* ← USO DE STYLE.contentWrapper */}

        {/* Barra de búsqueda y botón agregar */}
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

        {/* Lista de colaboradores */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={true}
        >
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
        <Modal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          containerStyle={styles.modalContainer}
        >
          <Title level={4}>{editingColaborador ? "Editar" : "Nuevo"} Colaborador</Title>
          <ColaboradorForm
            initialData={editingColaborador || {}}
            onSubmit={handleSubmit}
            isEditing={!!editingColaborador}
            userRole="external_owner"
            fincaId={user.fincaId}
            onCancel={() => setModalVisible(false)}
          />
        </Modal>

        {/* Modal de confirmación con validación de cédula */}
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
    </View>
  );
}