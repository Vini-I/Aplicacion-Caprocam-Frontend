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
 * - useColaboradoresList hook para lógica y estado
 * - ColaboradorCard, ColaboradorForm, ColaboradorDetalleScreen, etc.
 * - Layout global STYLE
 * - Iconos desde theme/icons
 */

// ============================================================
// IMPORTS
// ============================================================
import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useColaboradoresList } from "../hooks/useColaboradoresList";
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
import { STYLE } from "../../../theme/style";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/colaboradoresListStyles";
import Alert from "../../../shared/components/Alert";

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ColaboradoresListScreen() {
  const {
    activeTab,
    setActiveTab,
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
    lista,
    handleAdd,
    handleEdit,
    handleDeletePress,
    confirmDelete,
    handleSubmit,
    openStats,
    alert,
    cedulaError,          // <-- agregar
    setCedulaError,       // <-- agregar
  } = useColaboradoresList();

  // --------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // --------------------------------------------------------
  if (loading) return <Spinner text="Cargando colaboradores..." />;
  if (error) return <CustomText style={styles.error}>Error: {error}</CustomText>;

  // --------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------
  return (
   <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        {/* Barra de búsqueda y botón agregar - fijos arriba */}
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
              <CustomText style={styles.addButtonText}>Agregar colaborador</CustomText>
            </View>
          </Button>
        </View>

{/* Alerta flotante: se muestra debajo de la barra de búsqueda, dentro del flujo */}
{alert && (
  <View style={styles.alertWrapper}>
    <Alert variant={alert.type} message={alert.message} />
  </View>
)}
        {/* Lista scrolleable */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={true}
        >
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

        {/* Tabs fijos en la parte inferior */}
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

      {/* Modal para crear/editar colaborador */}
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
          userRole="camprocam_admin"
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
          setCedulaError(""); // limpiar error al cerrar
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
                {/* Mostrar error dentro del modal */}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon icon={ICONS.exit} size={16} color={COLORS.primary} />
              <CustomText style={{ color: COLORS.primary, fontWeight: '600' }}>Cancelar</CustomText>
            </View>
          </Button>
          <Button
            onPress={confirmDelete}
            variant="outline"
            style={[styles.modalDeleteBtn, { borderColor: COLORS.error }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon icon={ICONS.delete} size={16} color={COLORS.error} />
              <CustomText style={{ color: COLORS.error, fontWeight: '600' }}>Eliminar</CustomText>
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