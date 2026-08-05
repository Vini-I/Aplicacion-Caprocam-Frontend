/**
 * ============================================================
 * PANTALLA: ColaboradoresListScreen
 * ============================================================
 * Módulo: Colaboradores
 *
 * Responsabilidad:
 * Pantalla principal de administración de colaboradores. Muestra
 * una lista paginada con búsqueda y filtros, y acciones de CRUD.
 *
 * @dependencies - useColaboradoresList, shared components.
 * @validations  - Filtrado por texto y rol.
 * @navigation   - Navega a detalle, edición y creación.
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
import ModalEliminar from '../../../shared/components/ModalEliminar';
import EmptyState from '../../../shared/components/EmptyState';

import { STYLE } from '../../../theme/style';
import { ICONS } from '../../../theme/icons';
import { COLORS } from '../../../theme/colors';
import { styles } from '../styles/colaboradoresListStyles';

// ─── Opciones de filtro por rol ───────────────────────────────────
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
  const redirectedRef = useRef(false);

  // ─── Hook de datos y estado de la lista ──────────────────────
  const {
    colaboradores,
    loading,
    error,
    searchText,
    setSearchText,
    deleteTarget,
    setDeleteTarget,
    showConfirmModal,
    setShowConfirmModal,
    alert,
    showAlert,
    confirmDelete,
    fetchColaboradores,
  } = useColaboradoresList();

  // ─── Filtros activos (categorías, etc.) ──────────────────────
  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: '',
  });

  // ─── Efectos ──────────────────────────────────────────────────

  // Mostrar alerta desde parámetros de ruta (ej. tras eliminación)
  useEffect(() => {
    const { alertType, alertMessage } = params;
    if (alertType && alertMessage) {
      showAlert(alertType, alertMessage);
      router.setParams({ alertType: undefined, alertMessage: undefined });
    }
  }, [params.alertType, params.alertMessage]);

  // Redirección a edición si se recibe editId
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

  // Refrescar lista al volver a la pantalla (evitando doble carga inicial)
  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (!firstFocus.current) {
        fetchColaboradores();
      }
      firstFocus.current = false;
    }, [fetchColaboradores])
  );

  // ─── Filtrado de la lista (búsqueda y roles) ──────────────────
  const listaFiltrada = useMemo(() => {
    let result = colaboradores;

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      result = result.filter((c) =>
        (c.nombre?.toLowerCase() || '').includes(q) ||
        (c.cedula?.toLowerCase() || '').includes(q) ||
        (c.telefono?.toLowerCase() || '').includes(q) ||
        (c.email?.toLowerCase() || '').includes(q)
      );
    }

    if (filtros.categories.length > 0 && !filtros.categories.includes('todos')) {
      result = result.filter((c) => filtros.categories.includes(c.rol));
    }

    return result;
  }, [colaboradores, searchText, filtros]);

  // ─── Navegación ─────────────────────────────────────────────────
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

  // ─── Estados de carga / error ──────────────────────────────────
  if (loading) return <Spinner text="Cargando colaboradores..." />;

  // Si hay error, no mostramos el mensaje en la UI (el modal global ya se encarga).
  // Simplemente mostramos la lista vacía o un estado vacío.
  // Podemos mostrar un EmptyState con mensaje de error, pero no es necesario.

  // ─── Mensajes del estado vacío ────────────────────────────────
  const hayFiltrosActivos = searchText.trim() !== '' || filtros.categories.length > 0;
  const emptyTitle = hayFiltrosActivos ? 'Sin resultados' : 'No hay colaboradores registrados';
  const emptyDescription = hayFiltrosActivos
    ? 'No se encontraron colaboradores con los criterios de búsqueda seleccionados.'
    : 'Comienza agregando tu primer colaborador.';

  const contador = `${listaFiltrada.length} ${listaFiltrada.length === 1 ? 'colaborador encontrado' : 'colaboradores encontrados'}`;

  // ─── Render ────────────────────────────────────────────────────
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

      {/* Contador de resultados */}
      <View style={styles.contadorWrapper}>
        <CustomText style={styles.contadorResultados}>{contador}</CustomText>
      </View>

      {/* Alerta flotante */}
      {alert && (
        <View style={styles.alertWrapper}>
          <Alert variant={alert.type} message={alert.message} />
        </View>
      )}

      {/* Lista de colaboradores o EmptyState */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {listaFiltrada.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          listaFiltrada.map((colab) => (
            <ColaboradorCard
              key={colab.id}
              colaborador={colab}
              onPress={() => openDetail(colab.id)}
              onEdit={handleEditNavigation}
              onDelete={() => {
                setDeleteTarget(colab);
                setShowConfirmModal(true);
              }}
            />
          ))
        )}
      </ScrollView>

      {/* Botón flotante "Agregar colaborador" */}
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

      {/* Modal de confirmación de eliminación usando componente reutilizable */}
      <ModalEliminar
        visible={showConfirmModal}
        title="colaborador"
        message={deleteTarget?.nombre || ''}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirmModal(false);
          setDeleteTarget(null);
        }}
      />
    </View>
  );
}