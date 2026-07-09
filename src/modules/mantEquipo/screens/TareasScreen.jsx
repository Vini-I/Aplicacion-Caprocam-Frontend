/**
 * ============================================================
 * PANTALLA: TareasScreen
 * ============================================================
 *
 * Vista principal del módulo de gestión de tareas.
 * Permite listar, buscar, crear, editar y eliminar tareas de mantenimiento.
 *
 * Dependencias:
 * - useTareas hook para manejar datos y operaciones CRUD
 * - SearchBar compartido desde inventarios
 * - Layout global STYLE
 * - Componentes compartidos de la aplicación
 *
 * Ejemplo:
 * <TareasScreen />
 */

// ============================================================
// IMPORTS
// ============================================================
import React, { useState } from "react";
import { View, FlatList, TextInput, Pressable, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Spinner from "../../../shared/components/Spinner";
import EmptyState from "../../../shared/components/EmptyState";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
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
  ERRORES_FORM,
} from "../constants/tareasMensajes";
import { styles } from "../styles/tareasStyles";

// ----------------------------------------------------------------
// COMPONENTES INTERNOS
// ----------------------------------------------------------------

/**
 * Modal para crear o editar una tarea.
 * Recibe el estado y las funciones del hook, y controla su propia visibilidad.
 */
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

  React.useEffect(() => {
    if (visible && modoEdicion && tareaEditando) {
      setNombre(tareaEditando.nombre || "");
      setDescripcion(tareaEditando.descripcion || "");
      setCategoria(tareaEditando.categoria || "");
      setDuracion(String(tareaEditando.duracionEstimada || ""));
      setErrores({});
    } else if (visible && !modoEdicion) {
      setNombre("");
      setDescripcion("");
      setCategoria("");
      setDuracion("");
      setErrores({});
    }
  }, [visible, modoEdicion, tareaEditando]);

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = ERRORES_FORM.nombre;
    if (!descripcion.trim()) e.descripcion = ERRORES_FORM.descripcion;
    if (!categoria) e.categoria = ERRORES_FORM.categoria;
    if (!duracion.trim() || Number(duracion) <= 0) e.duracion = ERRORES_FORM.duracion;
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = () => {
    if (!validar()) return;
    onGuardar({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoria,
      duracionEstimada: Number(duracion),
    });
  };

  const T = TEXTOS_MODAL_TAREA;

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
        <Input
          label={T.labelNombre}
          value={nombre}
          onChangeText={setNombre}
          placeholder={T.placeholderNombre}
          style={errores.nombre && { borderColor: COLORS.error }}
        />
        <Input
          label={T.labelDescripcion}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder={T.placeholderDesc}
          multiline
          style={[errores.descripcion && { borderColor: COLORS.error }, { minHeight: 80 }]}
        />
        <Select
          label={T.labelCategoria}
          options={OPCIONES_CATEGORIA}
          value={categoria}
          onChange={setCategoria}
          placeholder="Seleccionar categoría"
          selectStyle={errores.categoria && { borderColor: COLORS.error }}
        />
        <Input
          label={T.labelDuracion}
          value={duracion}
          onChangeText={setDuracion}
          placeholder={T.placeholderDuracion}
          keyboardType="numeric"
          style={errores.duracion && { borderColor: COLORS.error }}
        />
      </ScrollView>
      <View style={styles.modalFooter}>
        <Button variant="outline" onPress={onClose} style={styles.btnCancel}>
          {T.btnCancelar}
        </Button>
        <Button variant="outline" onPress={handleGuardar} style={styles.btnAccept}>
          {T.btnGuardar}
        </Button>
      </View>
    </Modal>
  );
}

/**
 * Fila de la tabla que representa una tarea.
 */
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
        <Button
          variant="outline"
          onPress={() => onEditar(tarea)}
          style={[styles.btnAccion, { borderColor: COLORS.primary }]}
          textStyle={{ color: COLORS.primary }}
        >
          <Icon icon={ICONS.edit} size={16} color={COLORS.primary} />
        </Button>
        <Button
          variant="outline"
          onPress={() => onEliminar(tarea.id)}
          style={[styles.btnAccion, { borderColor: COLORS.error }]}
          textStyle={{ color: COLORS.error }}
        >
          <Icon icon={ICONS.delete} size={16} color={COLORS.error} />
        </Button>
      </View>
    </View>
  );
}

// ----------------------------------------------------------------
// PANTALLA PRINCIPAL
// ----------------------------------------------------------------

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

  // Estado del modal.
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);

  // Abrir modal para crear.
  const handleAgregar = () => {
    setModoEdicion(false);
    setTareaEditando(null);
    setModalVisible(true);
  };

  // Abrir modal para editar.
  const handleEditar = (tarea) => {
    setModoEdicion(true);
    setTareaEditando(tarea);
    setModalVisible(true);
  };

  // Guardar (crear o actualizar).
  const handleGuardarTarea = async (datos) => {
    try {
      if (modoEdicion && tareaEditando) {
        await actualizarTarea(tareaEditando.id, datos);
      } else {
        await crearTarea(datos);
      }
      setModalVisible(false);
    } catch (err) {
      // El error ya se maneja en el hook.
    }
  };

  // Eliminar con confirmación simple.
  const handleEliminar = (id) => {
    if (window.confirm("¿Está seguro de eliminar esta tarea?")) {
      eliminarTarea(id);
    }
  };

  // Volver a la pantalla anterior (Drawer).
  const handleBack = () => {
    router.back();
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
    <View style={STYLE.container}>
      <View style={STYLE.contentWrapper}>
        {/* Navbar personalizado con título y subtítulo */}


        {/* Toolbar: búsqueda y botón agregar */}
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

        {/* Tabla de tareas */}
        <View style={styles.tableWrapper}>
          {/* Encabezado */}
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

          {/* Filas */}
          <FlatList
            data={tareasFiltradas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FilaTarea
                tarea={item}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            )}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={{ padding: 24, alignItems: "center" }}>
                <CustomText style={{ color: COLORS.textTertiary, fontSize: 14 }}>
                  {TEXTOS_PANTALLA.sinTareas}
                </CustomText>
              </View>
            }
          />
        </View>

        {/* Modal de creación/edición */}
        <ModalTarea
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          modoEdicion={modoEdicion}
          tareaEditando={tareaEditando}
          onGuardar={handleGuardarTarea}
        />
      </View>
    </View>
  );
}