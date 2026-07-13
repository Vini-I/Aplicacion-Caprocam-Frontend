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
 * - ColaboradorCard, ColaboradorForm, ColaboradorDetalleScreen
 * - Layout global STYLE
 * ============================================================
 */

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
import Icon from "../../../shared/components/Icons";
import SearchBar from "../../inventarios/components/SearchBar";
import Alert from "../../../shared/components/Alert";
import { STYLE } from "../../../theme/style";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/miPersonalStyles";

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
    cedulaError,
    setCedulaError,
    alert,
    colaboradores,
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
  if (loading && colaboradores.length === 0) {
    return <Spinner text="Cargando personal..." />;
  }

  if (error) {
    return (
      <View style={[STYLE.container, { justifyContent: "center", alignItems: "center" }]}>
        <CustomText style={{ color: COLORS.error }}>Error: {error}</CustomText>
      </View>
    );
  }

  // --------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------
  return (
   <View style={{ flex: 1, backgroundColor: COLORS.white }}>

        {/* Barra de búsqueda y botón agregar */}
        <View style={styles.searchRow}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar por nombre, teléfono, email o cédula"
            containerStyle={styles.searchInput}
          />
          <Button
            variant="outline"
            onPress={handleAdd}
            style={[styles.addButtonContainer, { borderColor: COLORS.primary }]}
          >
            <View style={styles.addButtonContent}>
              <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
              <CustomText style={[styles.addButtonText, { color: COLORS.primary }]}>
                Agregar colaborador
              </CustomText>
            </View>
          </Button>
        </View>

        {/* Alerta flotante (éxito/error) */}
        {alert && (
          <View style={{ marginBottom: 12, paddingHorizontal: 0 }}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}

        {/* Lista scrolleable */}
        <ScrollView
       style={styles.scrollView}
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
          showCloseButton={false}
          containerStyle={styles.modalContainer}
        >
          <Title level={4}>{editingColaborador ? "Editar" : "Nuevo"} colaborador</Title>
          <ColaboradorForm
            initialData={editingColaborador || {}}
            onSubmit={handleSubmit}
            isEditing={!!editingColaborador}
            userRole="external_owner"
            fincaId={user.fincaId}
            onCancel={() => setModalVisible(false)}
          />
        </Modal>

        {/* Modal de confirmación de eliminación con validación de cédula */}
        <Modal
          visible={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setCedulaConfirmacion("");
            setDeleteTarget(null);
            setCedulaError("");
          }}
          showCloseButton={false}
          containerStyle={styles.modalConfirmContainer}
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
            onChangeText={(text) => {
              setCedulaConfirmacion(text);
              setCedulaError(""); // limpiar error al escribir
            }}
            keyboardType="numeric"
            containerStyle={styles.modalInput}
          />

                    {/* Alerta de error dentro del modal */}
          {cedulaError !== "" && (
            <Alert
              variant="danger"
              message={cedulaError}
              style={{ marginBottom: 12 }}
            />
          )}

          <View style={styles.modalButtons}>
            <Button
              onPress={() => {
                setShowConfirmModal(false);
                setCedulaConfirmacion("");
                setDeleteTarget(null);
                setCedulaError("");
              }}
              variant="outline"
              style={styles.modalCancelBtn}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Icon icon={ICONS.exit} size={16} color={COLORS.primary} />
                <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>
                  Cancelar
                </CustomText>
              </View>
            </Button>
            <Button
              onPress={confirmDelete}
              variant="outline"
              style={[styles.modalDeleteBtn, { borderColor: COLORS.error }]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Icon icon={ICONS.delete} size={16} color={COLORS.error} />
                <CustomText style={{ color: COLORS.error, fontWeight: "600" }}>
                  Eliminar
                </CustomText>
              </View>
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