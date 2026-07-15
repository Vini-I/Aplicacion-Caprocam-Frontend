// src/modules/mantEquipo/screens/TareasScreen.jsx

/**
 * ============================================================
 * PANTALLA: TareasScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Vista principal del módulo de gestión de tareas.
 * Permite listar, buscar, filtrar, ver detalle y eliminar tareas de mantenimiento.
 *
 * Funcionalidad:
 * - Muestra un listado de tareas con scroll vertical.
 * - Permite buscar tareas por nombre, descripción o categoría.
 * - Al hacer clic en una fila, muestra un modal de detalle (solo lectura).
 * - Confirma la eliminación mediante un modal (no alert nativo).
 * - Muestra alertas de éxito, advertencia o error al realizar acciones.
 * - Filtros por categoría y estado (usando FilterButton compartido).
 * - Botón "Agregar Tarea" flotante (siempre visible al hacer scroll).
 * - La creación y edición se realizan en una pantalla independiente (TareaFormScreen).
 *
 * Componentes utilizados:
 * - SearchBar, FilterButton (compartidos desde inventarios)
 * - Alert, Modal, Button, Icon, CustomText, Spinner, FlatList
 *
 * Dependencias:
 * - useTareas (hook para datos y CRUD)
 * - tareasStyles (estilos locales)
 * - tareasMensajes (constantes de texto)
 * - STYLE (estilos globales)
 * - useRouter para navegación
 * ============================================================
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, FlatList, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import Spinner from "../../../shared/components/Spinner";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Alert from "../../../shared/components/Alert";
import SearchBar from "../../inventarios/components/SearchBar";
import FilterButton from "../../inventarios/components/FilterButton";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

import { useTareas } from "../hooks/useTareas";
import {
  TEXTOS_PANTALLA,
  HEADERS_TABLA,
  OPCIONES_CATEGORIA,
  OPCIONES_ESTADO,
} from "../constants/tareasMensajes";
import { styles } from "../styles/tareasStyles";

// ============================================================
// COMPONENTE: ModalDetalleTarea (detalle de tarea - solo lectura)
// ============================================================
function ModalDetalleTarea({ visible, tarea, onClose }) {
  if (!tarea) return null;

  const categoriaLabel =
    OPCIONES_CATEGORIA.find((c) => c.value === tarea.categoria)?.label ||
    tarea.categoria;
  const estadoLabel =
    OPCIONES_ESTADO.find((e) => e.value === tarea.estado)?.label || tarea.estado;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      containerStyle={styles.modalContainer}
    >
      <View style={styles.detalleEncabezado}>
        <CustomText style={styles.modalTitle}>Detalle de tarea</CustomText>
      </View>

      <View style={styles.modalScroll}>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>ID</CustomText>
          <CustomText style={styles.equipoDetailVal}>{tarea.id}</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Nombre</CustomText>
          <CustomText style={styles.equipoDetailVal}>{tarea.nombre}</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Descripción</CustomText>
          <CustomText style={styles.equipoDetailVal}>{tarea.descripcion}</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Categoría</CustomText>
          <CustomText style={styles.equipoDetailVal}>{categoriaLabel}</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Duración estimada</CustomText>
          <CustomText style={styles.equipoDetailVal}>{tarea.duracionEstimada} hrs</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Estado</CustomText>
          <CustomText style={styles.equipoDetailVal}>{estadoLabel}</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Productos</CustomText>
          <View style={{ flex: 1 }}>
            {tarea.productos && tarea.productos.length > 0 ? (
              tarea.productos.map((p) => (
                <CustomText key={p.productoId} style={styles.equipoDetailVal}>
                  {p.nombre || `ID: ${p.productoId}`} - {p.cantidad} u
                </CustomText>
              ))
            ) : (
              <CustomText style={styles.equipoDetailVal}>—</CustomText>
            )}
          </View>
        </View>
      </View>

      <View style={styles.modalFooter}>
        <Button
          variant="outline"
          onPress={onClose}
          style={[styles.btnCancel, { flexDirection: "row", alignItems: "center", gap: 6 }]}
        >
          <Icon icon={ICONS.exit} size={18} color={COLORS.primary} />
          <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>Cerrar</CustomText>
        </Button>
      </View>
    </Modal>
  );
}

// ============================================================
// COMPONENTE: FilaTarea (cada registro en la tabla)
// ============================================================
function FilaTarea({ tarea, onEditar, onEliminar, onPressFila }) {
  const categoriaLabel =
    OPCIONES_CATEGORIA.find((c) => c.value === tarea.categoria)?.label ||
    tarea.categoria;

  const estadoLabel =
    OPCIONES_ESTADO.find((e) => e.value === tarea.estado)?.label || tarea.estado;

  return (
    <Pressable onPress={() => onPressFila(tarea)} style={styles.rowInner}>
      <View style={styles.row}>
        <View style={styles.colId}>
          <CustomText style={styles.cellText}>{tarea.id}</CustomText>
        </View>
        <View style={styles.colNombre}>
          <CustomText style={styles.cellText} numberOfLines={1}>
            {tarea.nombre}
          </CustomText>
        </View>
        <View style={styles.colDesc}>
          <CustomText style={styles.cellText} numberOfLines={2}>
            {tarea.descripcion}
          </CustomText>
        </View>
        <View style={styles.colCategoria}>
          <CustomText style={styles.cellText}>{categoriaLabel}</CustomText>
        </View>
        <View style={styles.colDuracion}>
          <CustomText style={styles.cellText}>{tarea.duracionEstimada}</CustomText>
        </View>
        <View style={styles.colEstado}>
          <CustomText style={[styles.cellText, { fontWeight: "600" }]}>
            {estadoLabel}
          </CustomText>
        </View>
        <View style={styles.colAcciones}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button
              variant="outline"
              onPress={() => onEditar(tarea)}
              style={[styles.btnAccion, { borderColor: COLORS.primary }]}
            >
              <Icon icon={ICONS.edit} size={16} color={COLORS.primary} />
              <CustomText style={{ color: COLORS.primary, fontWeight: '600', marginLeft: 4 }}>
                Editar
              </CustomText>
            </Button>
            <Button
              variant="outline"
              onPress={() => onEliminar(tarea)}
              style={[styles.btnAccion, { borderColor: COLORS.error }]}
            >
              <Icon icon={ICONS.delete} size={16} color={COLORS.error} />
              <CustomText style={{ color: COLORS.error, fontWeight: '600', marginLeft: 4 }}>
                Eliminar
              </CustomText>
            </Button>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ============================================================
// PANTALLA PRINCIPAL: TareasScreen
// ============================================================
export default function TareasScreen() {
  const router = useRouter();

  const {
    tareasFiltradas,
    busqueda,
    setBusqueda,
    loading,
    error,
    eliminarTarea,
  } = useTareas();

  const [detalleModalVisible, setDetalleModalVisible] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  // Estado y opciones para filtros
  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: "",
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
      if (filtros.categories.length > 0 && !filtros.categories.includes(t.categoria)) {
        return false;
      }
      if (filtros.suppliers.length > 0 && !filtros.suppliers.includes(t.estado)) {
        return false;
      }
      return true;
    });
  }, [tareasFiltradas, filtros]);

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // Navegación a creación/edición de tareas (pantalla independiente)
  const handleAgregar = () => {
    router.push('/equipos/tareaForm');
  };

  const handleEditar = (tarea) => {
    router.push(`/equipos/tareaForm?id=${tarea.id}`);
  };

  const handleEliminarPress = (tarea) => {
    setDeleteTarget(tarea);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      showAlert("danger", "No se encontró la tarea a eliminar.");
      setShowConfirmModal(false);
      return;
    }

    try {
      await eliminarTarea(deleteTarget.id);
      showAlert("warning", `La tarea "${deleteTarget.nombre}" ha sido eliminada.`);
      setShowConfirmModal(false);
      setDeleteTarget(null);
    } catch (err) {
      showAlert("danger", err.message || "No se pudo eliminar la tarea.");
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteTarget(null);
  };

  const abrirDetalle = (tarea) => {
    setTareaSeleccionada(tarea);
    setDetalleModalVisible(true);
  };

  if (loading && tareasFiltradas.length === 0) {
    return (
      <View style={[STYLE.container, { justifyContent: "center", alignItems: "center" }]}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[STYLE.container, { justifyContent: "center", alignItems: "center" }]}>
        <CustomText style={{ color: COLORS.error }}>Error: {error}</CustomText>
      </View>
    );
  }

  return (
    <View style={[STYLE.container, { flex: 1, paddingHorizontal: 0, paddingBottom: 80 }]}>
      {/* Barra de herramientas con búsqueda y filtros */}
      <View style={styles.toolbar}>
        <SearchBar
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder={TEXTOS_PANTALLA.placeholderBuscar}
          containerStyle={{ flex: 1 }}
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
              expiryDate: "",
            })
          }
          showLowStock={false}
          showExpiryDate={false}
          buttonStyle={{
            height: 42,
            borderColor: COLORS.textTertiary,
            marginTop: 0,
            alignSelf: 'center',
          }}
        />
      </View>

      {/* Alerta global */}
      {alert && (
        <View style={styles.alertWrapper}>
          <Alert variant={alert.type} message={alert.message} />
        </View>
      )}

      {/* Tabla de tareas */}
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
              styles.colAcciones,
            ].map((col, i) => (
              <View key={i} style={col}>
                <Text style={styles.headerCell}>
                  {i < HEADERS_TABLA.length ? HEADERS_TABLA[i] : ""}
                </Text>
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
              onEditar={handleEditar}
              onEliminar={handleEliminarPress}
              onPressFila={abrirDetalle}
            />
          )}
          scrollEnabled={true}
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View style={{ padding: 24, alignItems: "center" }}>
              <CustomText style={{ color: COLORS.textTertiary, fontSize: 14 }}>
                {TEXTOS_PANTALLA.sinTareas}
              </CustomText>
            </View>
          }
        />
      </View>

      {/* Botón flotante para agregar tarea (siempre visible) */}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 16,
          right: 16,
          alignItems: 'center',
        }}
      >
        <Button
          variant="outline"
          onPress={handleAgregar}
          style={{
            borderColor: COLORS.primary,
            backgroundColor: COLORS.white,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            width: '70%',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
          <CustomText
            style={{ color: COLORS.primary, fontWeight: "600", fontSize: 13 }}
          >
            {TEXTOS_PANTALLA.btnAgregarTarea}
          </CustomText>
        </Button>
      </View>

      {/* Modal de detalle de tarea (solo lectura) */}
      <ModalDetalleTarea
        visible={detalleModalVisible}
        tarea={tareaSeleccionada}
        onClose={() => setDetalleModalVisible(false)}
      />

      {/* Modal de confirmación de eliminación */}
      <Modal
        visible={showConfirmModal}
        onClose={cancelDelete}
        showCloseButton={false}
        containerStyle={styles.modalConfirmContainer}
      >
        <CustomText style={styles.modalTitle}>Confirmar eliminación</CustomText>
        {deleteTarget && (
          <>
            <CustomText style={styles.modalText}>
              ¿Está seguro que desea eliminar la tarea:
            </CustomText>
            <CustomText style={styles.modalName}>{deleteTarget.nombre}</CustomText>
            <CustomText style={styles.modalSubText}>
              Esta acción no se puede deshacer.
            </CustomText>
          </>
        )}
        <View style={styles.modalButtons}>
          <Button
            variant="outline"
            onPress={cancelDelete}
            style={[styles.modalCancelBtn, { flexDirection: "row", alignItems: "center", gap: 6 }]}
          >
            <Icon icon={ICONS.exit} size={16} color={COLORS.primary} />
            <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>Cancelar</CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={confirmDelete}
            style={[styles.modalDeleteBtn, { flexDirection: "row", alignItems: "center", gap: 6 }]}
          >
            <Icon icon={ICONS.delete} size={16} color={COLORS.error} />
            <CustomText style={{ color: COLORS.error, fontWeight: "600" }}>Eliminar</CustomText>
          </Button>
        </View>
      </Modal>
    </View>
  );
}