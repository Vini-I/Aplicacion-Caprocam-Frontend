/**
 * ============================================================
 * COMPONENTE: ColaboradoresListScreen
 * ============================================================
 *
 * Pantalla principal de administración de colaboradores.
 * Muestra todos los colaboradores en una sola lista con búsqueda
 * y filtro por rol (similar al módulo de Equipos).
 *
 * Dependencias:
 * - useColaboradoresList hook para datos y estado.
 * - ColaboradorCard para cada elemento.
 * - SearchBar y FilterButton para filtrado.
 * - Botón flotante "Agregar colaborador" fijo en la parte inferior.
 * ============================================================
 */

import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';

import { useColaboradoresList } from '../hooks/useColaboradoresList';
import ColaboradorCard from '../components/ColaboradorCard';
import Spinner from '../../../shared/components/Spinner';
import Button from '../../../shared/components/Button';
import CustomText from '../../../shared/components/Text';
import Icon from '../../../shared/components/Icons';
import SearchBar from '../../../shared/components/SearchBar';
import FilterButton from '../../../shared/components/FilterButton';
import Alert from '../../../shared/components/Alert';
import Modal from '../../../shared/components/Modal';
import Input from '../../../shared/components/Input';
import EmptyState from '../../../shared/components/EmptyState';

import { STYLE } from '../../../theme/style';
import { ICONS } from '../../../theme/icons';
import { COLORS } from '../../../theme/colors';
import { styles } from '../styles/colaboradoresListStyles';

// Opciones para el filtro por rol
const CATEGORIAS = [
  { label: 'Todos', value: 'todos' },
  { label: 'Trabajador Camprocam', value: 'camprocam_worker' },
  { label: 'Dueño Externo', value: 'external_owner' },
  { label: 'Trabajador Externo', value: 'external_worker' },
];

export default function ColaboradoresListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.editId;

  // Flag para evitar redirecciones múltiples
  const redirectedRef = useRef(false);

  const {
    colaboradores,
    loading,
    error,
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
    showAlert,
    handleDeletePress,
    confirmDelete,
  } = useColaboradoresList();

  // Estado de filtros del FilterButton
  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: '',
  });

  // ─── Mostrar alerta desde parámetros de ruta ──────────────
  useEffect(() => {
    const { alertType, alertMessage } = params;
    if (alertType && alertMessage) {
      showAlert(alertType, alertMessage);
      // Limpiar parámetros para que no se repitan al recargar
      router.setParams({ alertType: undefined, alertMessage: undefined });
    }
  }, [params.alertType, params.alertMessage]);

  // ─── FILTRADO DE BÚSQUEDA CON MANEJO DE NULL ──────────────
  const listaFiltrada = useMemo(() => {
    let result = colaboradores;

    // Búsqueda por texto
    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      result = result.filter((c) =>
        (c.nombre?.toLowerCase() || '').includes(q) ||
        (c.cedula?.toLowerCase() || '').includes(q) ||
        (c.telefono?.toLowerCase() || '').includes(q) ||
        (c.email?.toLowerCase() || '').includes(q)
      );
    }

    // Filtro por rol (categoría)
    if (filtros.categories.length > 0 && !filtros.categories.includes('todos')) {
      result = result.filter((c) => filtros.categories.includes(c.rol));
    }

    return result;
  }, [colaboradores, searchText, filtros]);

  // ─── Redirección desde detalle (solo si editId está presente) ───
  useFocusEffect(
    useCallback(() => {
      if (editId && !redirectedRef.current) {
        redirectedRef.current = true;
        router.replace({
          pathname: '/(drawer)/colaboradores/form',
          params: { id: editId },
        });
      }
    }, [editId, router])
  );

  // Navegaciones
  const openDetail = (colaboradorId) => {
    router.push({
      pathname: '/(drawer)/colaboradores/detalle',
      params: { id: colaboradorId },
    });
  };

  const handleEditNavigation = (colaborador) => {
    router.push({
      pathname: '/(drawer)/colaboradores/form',
      params: { id: colaborador.id },
    });
  };

  const handleAddNavigation = () => {
    router.push('/(drawer)/colaboradores/form');
  };

  // Estados de carga y error
  if (loading) return <Spinner text="Cargando colaboradores..." />;
  if (error) return <CustomText style={styles.error}>Error: {error}</CustomText>;

  // ─── DETERMINAR MENSAJE DEL EMPTY STATE ────────────────────
  const hayFiltrosActivos = searchText.trim() !== '' || filtros.categories.length > 0;
  const emptyTitle = hayFiltrosActivos ? 'Sin resultados' : 'No hay colaboradores registrados';
  const emptyDescription = hayFiltrosActivos
    ? 'No se encontraron colaboradores con los criterios de búsqueda seleccionados.'
    : 'Comienza agregando tu primer colaborador.';

  // Contador de resultados
  const contador = `${listaFiltrada.length} ${listaFiltrada.length === 1 ? 'colaborador encontrado' : 'colaboradores encontrados'}`;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* Barra de búsqueda y filtro */}
      <View style={styles.searchRow}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar por nombre, teléfono, email o cédula"
          containerStyle={styles.searchInput}
        />
        <FilterButton
          categories={CATEGORIAS}
          suppliers={[]}
          activeFilters={filtros}
          onApply={setFiltros}
          showLowStock={false}
          showExpiryDate={false}
          buttonStyle={styles.filterButtonStyle}
        />
      </View>

      {/* Contador de resultados (alineado con search bar) */}
      <View style={styles.contadorWrapper}>
        <CustomText style={styles.contadorResultados}>{contador}</CustomText>
      </View>

      {/* Alerta flotante - ahora con el mismo ancho que los demás elementos */}
      {alert && (
        <View style={styles.alertWrapper}>
          <Alert variant={alert.type} message={alert.message} />
        </View>
      )}

      {/* Lista de colaboradores o EmptyState */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={true}
      >
        {listaFiltrada.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          listaFiltrada.map((colab) => (
            <ColaboradorCard
              key={colab.id}
              colaborador={colab}
              onPress={() => openDetail(colab.id)}
              onEdit={handleEditNavigation}
              onDelete={() => handleDeletePress(colab.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Botón flotante "Agregar colaborador" siempre visible */}
      <View style={styles.floatingButtonContainer}>
        <Button
          variant="outline"
          onPress={handleAddNavigation}
          style={styles.floatingButton}
        >
          <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
          <CustomText style={styles.floatingButtonText}>Agregar colaborador</CustomText>
        </Button>
      </View>

      {/* Modal de confirmación de eliminación */}
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