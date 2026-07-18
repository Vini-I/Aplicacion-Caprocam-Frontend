/**
 * ============================================================
 * PANTALLA: TareasScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Responsabilidad:
 * Vista principal del módulo de gestión de tareas. Muestra el listado
 * de tareas con búsqueda, filtros, y acción de detalle.
 *
 * Datos:
 * - Usa useTareas para obtener y manipular tareas.
 * - Estado local para alertas y modal de eliminación (desde detalle).
 *
 * Validaciones:
 * - Confirmación de eliminación con modal (no alert nativo).
 *
 * Navegación:
 * - Botón "Agregar tarea" navega a /equipos/tareaForm.
 * - Clic en fila navega a /equipos/detalleTarea?id={id}.
 *
 * Dependencias:
 * - hooks/useTareas
 * - components/FilaTarea
 * - shared/components (SearchBar, FilterButton, Alert, etc.)
 * - styles/tareasStyles
 * ============================================================
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import { useTareas } from '../hooks/useTareas';
import FilaTarea from '../components/FilaTarea';
import Spinner from '../../../shared/components/Spinner';
import Button from '../../../shared/components/Button';
import Icon from '../../../shared/components/Icons';
import CustomText from '../../../shared/components/Text';
import Alert from '../../../shared/components/Alert';
import SearchBar from '../../inventarios/components/SearchBar';
import FilterButton from '../../inventarios/components/FilterButton';

import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import { STYLE } from '../../../theme/style';
import {
  TEXTOS_PANTALLA,
  HEADERS_TABLA,
  OPCIONES_CATEGORIA,
  OPCIONES_ESTADO,
} from '../constants/tareasMensajes';
import { styles } from '../styles/tareasStyles';

export default function TareasScreen() {
  const router = useRouter();
  const { tareasFiltradas, busqueda, setBusqueda, loading, error } = useTareas();

  // Estados de alertas
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  // Filtros adicionales (categoría y estado)
  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: '',
  });

  const opcionesCategoria = OPCIONES_CATEGORIA.map((c) => ({
    label: c.label,
    value: c.value,
  }));
  const opcionesEstado = OPCIONES_ESTADO.map((e) => ({
    label: e.label,
    value: e.value,
  }));

  // Aplicar filtros adicionales a tareasFiltradas (que ya incluye búsqueda)
  const tareasFinales = useMemo(() => {
    return tareasFiltradas.filter((t) => {
      if (filtros.categories.length > 0 && !filtros.categories.includes(t.categoria))
        return false;
      if (filtros.suppliers.length > 0 && !filtros.suppliers.includes(t.estado))
        return false;
      return true;
    });
  }, [tareasFiltradas, filtros]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, []);

  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => setAlert(null), 4000);
  };

  // Handlers de navegación
  const handleAgregar = () => router.push('/equipos/tareaForm');
  const abrirDetalle = (tarea) => router.push(`/equipos/detalleTarea?id=${tarea.id}`);

  // Estados de carga y error
  if (loading && tareasFiltradas.length === 0) {
    return (
      <View style={[STYLE.container, styles.centerContainer]}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[STYLE.container, styles.centerContainer]}>
        <CustomText style={{ color: COLORS.error }}>Error: {error}</CustomText>
      </View>
    );
  }

  return (
    <View style={[STYLE.container, styles.container]}>
      {/* Barra de herramientas */}
      <View style={styles.toolbar}>
        <SearchBar
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder={TEXTOS_PANTALLA.placeholderBuscar}
          containerStyle={styles.searchBarContainer}
        />
        <FilterButton
          categories={opcionesCategoria}
          suppliers={opcionesEstado}
          activeFilters={filtros}
          onApply={(f) =>
            setFiltros({
              categories: f.categories || [],
              suppliers: f.suppliers || [],
              units: [],
              lowStock: false,
              expiryDate: '',
            })
          }
          showLowStock={false}
          showExpiryDate={false}
          buttonStyle={styles.filterButtonStyle}
        />
      </View>

      {/* Alerta global */}
      {alert && (
        <View style={styles.alertWrapper}>
          <Alert variant={alert.type} message={alert.message} />
        </View>
      )}

      {/* Tabla */}
      <View style={styles.tableWrapper}>
        <View style={styles.rowInner}>
          <View style={styles.tableHeader}>
            {[
              styles.colId,
              styles.colNombre,
              styles.colDesc,
              styles.colCategoria,
              styles.colDuracion,
              styles.colEstado,
            ].map((col, i) => (
              <View key={i} style={col}>
                <CustomText style={styles.headerCell}>
                  {HEADERS_TABLA[i] || ''}
                </CustomText>
              </View>
            ))}
          </View>
        </View>

        <FlatList
          data={tareasFinales}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={({ item }) => (
            <FilaTarea
              tarea={item}
              onPressFila={abrirDetalle}
            />
          )}
          scrollEnabled
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CustomText style={styles.emptyText}>{TEXTOS_PANTALLA.sinTareas}</CustomText>
            </View>
          }
        />
      </View>

      {/* Botón flotante "Agregar tarea" con el mismo ancho que la tabla */}
      <View style={styles.floatingButtonContainer}>
        <Button variant="outline" onPress={handleAgregar} style={styles.floatingButton}>
          <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
          <CustomText style={styles.floatingButtonText}>
            {TEXTOS_PANTALLA.btnAgregarTarea}
          </CustomText>
        </Button>
      </View>
    </View>
  );
}