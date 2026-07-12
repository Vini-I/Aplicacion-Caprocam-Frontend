/**
 * ============================================================
 * PANTALLA: TareasScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Vista principal del módulo de gestión de tareas.
 * Permite listar, buscar, crear, editar y eliminar tareas de mantenimiento.
 *
 * Funcionalidad:
 * - Muestra un listado de tareas con scroll vertical.
 * - Permite buscar tareas por nombre, descripción o categoría.
 * - Abre un modal para crear o editar tareas.
 * - Confirma la eliminación mediante un modal (no alert nativo).
 * - Muestra alertas de éxito, advertencia o error al realizar acciones.
 * - Dentro del modal, muestra un Alert cuando faltan campos obligatorios.
 *
 * Componentes utilizados:
 * - SearchBar (compartido desde inventarios)
 * - Alert (compartido)
 * - Modal (compartido)
 * - Button, Input, Select, Icon, CustomText, Spinner
 *
 * Dependencias:
 * - useTareas (hook para datos y CRUD)
 * - tareasStyles (estilos locales)
 * - tareasMensajes (constantes de texto)
 * - STYLE (estilos globales)
 * ============================================================
 */

import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Spinner from "../../../shared/components/Spinner";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Alert from "../../../shared/components/Alert";
import SearchBar from "../../inventarios/components/SearchBar";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

import { useTareas } from "../hooks/useTareas";
import {
  TEXTOS_PANTALLA,
  HEADERS_TABLA,
  OPCIONES_CATEGORIA,
  TEXTOS_MODAL_TAREA,
} from "../constants/tareasMensajes";
import { styles } from "../styles/tareasStyles";

// ============================================================
// COMPONENTE: ModalTarea (creación / edición)
// ============================================================
function ModalTarea({
  visible,
  onClose,
  modoEdicion,
  tareaEditando,
  onGuardar,
}) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [duracion, setDuracion] = useState("");
  const [errores, setErrores] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Cargar datos al abrir en modo edición
  useEffect(() => {
    if (visible && modoEdicion && tareaEditando) {
      setNombre(tareaEditando.nombre || "");
      setDescripcion(tareaEditando.descripcion || "");
      setCategoria(tareaEditando.categoria || "");
      setDuracion(String(tareaEditando.duracionEstimada || ""));
      setErrores({});
      setSubmitted(false);
    } else if (visible && !modoEdicion) {
      setNombre("");
      setDescripcion("");
      setCategoria("");
      setDuracion("");
      setErrores({});
      setSubmitted(false);
    }
  }, [visible, modoEdicion, tareaEditando]);

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre es requerido";
    if (!descripcion.trim()) e.descripcion = "La descripción es requerida";
    if (!categoria) e.categoria = "Debe seleccionar una categoría";

    const duracionNum = Number(duracion);
    if (!duracion.trim() || isNaN(duracionNum) || duracionNum <= 0) {
      e.duracion = "Debe ingresar una duración válida (mayor a 0)";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = () => {
    setSubmitted(true);
    if (!validar()) return;
    onGuardar({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoria,
      duracionEstimada: Number(duracion),
    });
  };

  const T = TEXTOS_MODAL_TAREA;
  const hasErrors = Object.keys(errores).length > 0;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      containerStyle={styles.modalContainer}
    >
      <CustomText style={styles.modalTitle}>
        {modoEdicion ? T.tituloEditar : T.tituloCrear}
      </CustomText>

      <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
        {/* Alerta de validación general (similar a Colaboradores) */}
        {submitted && hasErrors && (
          <Alert
            variant="danger"
            message="Revisa los campos obligatorios marcados con * antes de guardar."
            style={{ marginBottom: 12 }}
          />
        )}

        <Input
          label={`${T.labelNombre} *`}
          value={nombre}
          onChangeText={setNombre}
          placeholder={T.placeholderNombre}
          style={errores.nombre ? { borderColor: COLORS.error } : null}
        />

        <Input
          label={`${T.labelDescripcion} *`}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder={T.placeholderDesc}
          multiline
          style={[errores.descripcion ? { borderColor: COLORS.error } : null, { minHeight: 80 }]}
        />

        <Select
          label={`${T.labelCategoria} *`}
          options={OPCIONES_CATEGORIA}
          value={categoria}
          onChange={setCategoria}
          placeholder="Seleccionar categoría"
          selectStyle={errores.categoria ? { borderColor: COLORS.error } : null}
        />

        <Input
          label={`${T.labelDuracion} *`}
          value={duracion}
          onChangeText={setDuracion}
          placeholder={T.placeholderDuracion}
          keyboardType="numeric"
          style={errores.duracion ? { borderColor: COLORS.error } : null}
        />
      </ScrollView>

      {/* Botones del modal: Cancelar (outline) y Guardar (primary) */}
      <View style={styles.modalFooter}>
        <Button
          variant="outline"
          onPress={onClose}
          style={[styles.btnCancel, { flexDirection: "row", alignItems: "center", gap: 6 }]}
        >
          <Icon icon={ICONS.exit} size={18} color={COLORS.primary} />
          <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>
            {T.btnCancelar}
          </CustomText>
        </Button>

        <Button
          variant="primary"
          onPress={handleGuardar}
          style={[styles.btnAccept, { flexDirection: "row", alignItems: "center", gap: 6 }]}
        >
          <Icon icon={ICONS.save} size={18} color={COLORS.white} />
          <CustomText style={{ color: COLORS.white, fontWeight: "600" }}>
            {T.btnGuardar}
          </CustomText>
        </Button>
      </View>
    </Modal>
  );
}

// ============================================================
// COMPONENTE: FilaTarea (cada registro en la tabla)
// ============================================================
function FilaTarea({ tarea, onEditar, onEliminar }) {
  const categoriaLabel =
    OPCIONES_CATEGORIA.find((c) => c.value === tarea.categoria)?.label ||
    tarea.categoria;

  return (
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
      <View style={styles.colAcciones}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button
            variant="outline"
            onPress={() => onEditar(tarea)}
            style={[styles.btnAccion, { borderColor: COLORS.primary }]}
          >
            <Icon icon={ICONS.edit} size={16} color={COLORS.primary} />
          </Button>
          <Button
            variant="outline"
            onPress={() => onEliminar(tarea)}
            style={[styles.btnAccion, { borderColor: COLORS.error }]}
          >
            <Icon icon={ICONS.delete} size={16} color={COLORS.error} />
          </Button>
        </View>
      </View>
    </View>
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
    crearTarea,
    actualizarTarea,
    eliminarTarea,
  } = useTareas();

  // Estados del modal de creación/edición
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);

  // Estados para el modal de confirmación de eliminación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Estado para alertas globales
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  // Función para mostrar alerta con auto-cierre
  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // Abrir modal para crear
  const handleAgregar = () => {
    setModoEdicion(false);
    setTareaEditando(null);
    setModalVisible(true);
  };

  // Abrir modal para editar
  const handleEditar = (tarea) => {
    setModoEdicion(true);
    setTareaEditando(tarea);
    setModalVisible(true);
  };

  // Guardar (crear o actualizar)
  const handleGuardarTarea = async (datos) => {
    try {
      if (modoEdicion && tareaEditando) {
        await actualizarTarea(tareaEditando.id, datos);
        showAlert("success", `Tarea "${datos.nombre}" actualizada correctamente.`);
      } else {
        await crearTarea(datos);
        showAlert("success", `Tarea "${datos.nombre}" creada correctamente.`);
      }
      setModalVisible(false);
    } catch (err) {
      showAlert("danger", err.message || "Ocurrió un error al guardar la tarea.");
    }
  };

  // Abrir modal de confirmación para eliminar
  const handleEliminarPress = (tarea) => {
    setDeleteTarget(tarea);
    setShowConfirmModal(true);
  };

  // Confirmar eliminación
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

  // Cerrar modal de confirmación
  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteTarget(null);
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
    <View style={[STYLE.container, { flex: 1 }]}>
      <View style={[STYLE.contentWrapper, { flex: 1 }]}>
        {/* Barra de herramientas: búsqueda + botón agregar */}
        <View style={styles.toolbar}>
          <SearchBar
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder={TEXTOS_PANTALLA.placeholderBuscar}
            containerStyle={{ flex: 1 }}
          />
          <Button
            variant="outline"
            onPress={handleAgregar}
            style={[styles.btnAction, { borderColor: COLORS.primary }]}
          >
            <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
            <CustomText style={{ color: COLORS.primary, fontWeight: "600", fontSize: 13 }}>
              {TEXTOS_PANTALLA.btnAgregarTarea}
            </CustomText>
          </Button>
        </View>

        {/* Alerta global */}
        {alert && (
          <View style={{ marginBottom: 12 }}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}

        {/* Tabla de tareas (scrolleable) */}
        <View style={styles.tableWrapper}>
          {/* Cabecera fija */}
          <View style={styles.tableHeader}>
            {[
              styles.colId,
              styles.colNombre,
              styles.colDesc,
              styles.colCategoria,
              styles.colDuracion,
              styles.colAcciones,
            ].map((col, i) => (
              <View key={i} style={col}>
                <Text style={styles.headerCell}>{HEADERS_TABLA[i]}</Text>
              </View>
            ))}
          </View>

          {/* Lista scrolleable */}
          <FlatList
            data={tareasFiltradas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FilaTarea
                tarea={item}
                onEditar={handleEditar}
                onEliminar={handleEliminarPress}
              />
            )}
            scrollEnabled={true}
            style={{ flex: 1 }}
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

        {/* Modal de creación / edición */}
        <ModalTarea
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          modoEdicion={modoEdicion}
          tareaEditando={tareaEditando}
          onGuardar={handleGuardarTarea}
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
              variant="danger"
              onPress={confirmDelete}
              style={[styles.modalDeleteBtn, { flexDirection: "row", alignItems: "center", gap: 6 }]}
            >
              <Icon icon={ICONS.delete} size={16} color={COLORS.white} />
              <CustomText style={{ color: COLORS.white, fontWeight: "600" }}>Eliminar</CustomText>
            </Button>
          </View>
        </Modal>
      </View>
    </View>
  );
}