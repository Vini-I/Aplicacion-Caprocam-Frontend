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
 * - ColaboradorCard, ColaboradorForm (usado en pantalla separada)
 * - Layout global STYLE
 * - Iconos desde theme/icons
 */

// ============================================================
// IMPORTS
// ============================================================
import React, { useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';

import { useColaboradoresList } from '../hooks/useColaboradoresList';
import ColaboradorCard from '../components/ColaboradorCard';
import Spinner from '../../../shared/components/Spinner';
import Button from '../../../shared/components/Button';
import CustomText from '../../../shared/components/Text';
import Icon from '../../../shared/components/Icons';
import SearchBar from '../../inventarios/components/SearchBar';
import { STYLE } from '../../../theme/style';
import { ICONS } from '../../../theme/icons';
import { COLORS } from '../../../theme/colors';
import { styles } from '../styles/colaboradoresListStyles';
import Alert from '../../../shared/components/Alert';
import Modal from '../../../shared/components/Modal';
import Input from '../../../shared/components/Input';

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ColaboradoresListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.editId;

  const {
    activeTab,
    setActiveTab,
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
    alert,
    cedulaError,
    setCedulaError,
  } = useColaboradoresList();

  // Detectar si se viene de la pantalla de detalle con editId para redirigir al formulario
  useFocusEffect(
    useCallback(() => {
      if (editId) {
        router.replace({
          pathname: '/(drawer)/colaboradores/form',
          params: { id: editId },
        });
      }
    }, [editId, router])
  );

  // Navegar al detalle de un colaborador
  const openDetail = (colaboradorId) => {
    router.push({
      pathname: '/(drawer)/colaboradores/detalle',
      params: { id: colaboradorId },
    });
  };

  // Navegar al formulario de edición
  const handleEditNavigation = (colaborador) => {
    router.push({
      pathname: '/(drawer)/colaboradores/form',
      params: { id: colaborador.id },
    });
  };

  // Navegar al formulario de creación
  const handleAddNavigation = () => {
    router.push('/(drawer)/colaboradores/form');
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
          onPress={handleAddNavigation}
          style={[styles.addButtonContainer, { borderColor: COLORS.primary }]}
        >
          <View style={styles.addButtonContent}>
            <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
            <CustomText style={styles.addButtonText}>Agregar colaborador</CustomText>
          </View>
        </Button>
      </View>

      {/* Alerta flotante: se muestra debajo de la barra de búsqueda */}
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
            onPress={() => openDetail(colab.id)}
            onEdit={handleEditNavigation}
            onDelete={() => handleDeletePress(colab.id)}
          />
        ))}
      </ScrollView>

      {/* Tabs fijos en la parte inferior */}
      <View style={styles.tabBar}>
        <Button
          variant="outline"
          style={[styles.tab, activeTab === 'internos' && styles.activeTab]}
          onPress={() => setActiveTab('internos')}
        >
          <CustomText style={styles.tabText}>Personal Interno</CustomText>
        </Button>
        <Button
          variant="outline"
          style={[styles.tab, activeTab === 'externos' && styles.activeTab]}
          onPress={() => setActiveTab('externos')}
        >
          <CustomText style={styles.tabText}>Dueños Externos</CustomText>
        </Button>
      </View>

      {/* Modal de confirmación de eliminación con validación de cédula */}
      <Modal
        visible={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setCedulaConfirmacion('');
          setDeleteTarget(null);
          setCedulaError('');
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
            setCedulaError('');
          }}
          keyboardType="numeric"
          containerStyle={styles.modalInput}
        />
        {/* Mostrar error dentro del modal */}
        {cedulaError !== '' && (
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
              setCedulaConfirmacion('');
              setDeleteTarget(null);
              setCedulaError('');
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
    </View>
  );
}