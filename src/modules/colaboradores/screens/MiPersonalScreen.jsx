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
 * - ColaboradorCard, ColaboradorForm (pantalla separada)
 * - Layout global STYLE
 * ============================================================
 */

import React, { useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';

import { useMiPersonal } from '../hooks/useMiPersonal';
import ColaboradorCard from '../components/ColaboradorCard';
import Modal from '../../../shared/components/Modal';
import Spinner from '../../../shared/components/Spinner';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import CustomText from '../../../shared/components/Text';
import Icon from '../../../shared/components/Icons';
import SearchBar from '../../../shared/components/SearchBar';
import Alert from '../../../shared/components/Alert';
import { STYLE } from '../../../theme/style';
import { ICONS } from '../../../theme/icons';
import { COLORS } from '../../../theme/colors';
import { styles } from '../styles/miPersonalStyles';

export default function MiPersonalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.editId;

  const {
    user,
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
    handleDeletePress,
    confirmDelete,
  } = useMiPersonal();

  // Detectar si se viene de la pantalla de detalle con editId para redirigir al formulario
  useFocusEffect(
    useCallback(() => {
      if (editId) {
        router.replace({
          pathname: '/(drawer)/colaboradores/form',
          params: { id: editId, userRole: 'external_owner', fincaId: user.fincaId },
        });
      }
    }, [editId, router, user.fincaId])
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
      params: { id: colaborador.id, userRole: 'external_owner', fincaId: user.fincaId },
    });
  };

  // Navegar al formulario de creación
  const handleAddNavigation = () => {
    router.push({
      pathname: '/(drawer)/colaboradores/form',
      params: { userRole: 'external_owner', fincaId: user.fincaId },
    });
  };

  // --------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // --------------------------------------------------------
  if (loading && colaboradores.length === 0) {
    return <Spinner text="Cargando personal..." />;
  }

  if (error) {
    return (
      <View style={[STYLE.container, { justifyContent: 'center', alignItems: 'center' }]}>
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
          onPress={handleAddNavigation}
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
            onPress={() => openDetail(colab.id)}
            onEdit={handleEditNavigation}
            onDelete={() => handleDeletePress(colab.id)}
          />
        ))}
      </ScrollView>

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

        {/* Alerta de error dentro del modal */}
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