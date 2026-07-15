// src/modules/mantEquipo/screens/TareasScreen.jsx

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
 * - Abre un modal para crear o editar tareas con estado y productos asociados.
 * - Al hacer clic en una fila, muestra un modal de detalle (solo lectura) con formato de lista.
 * - Confirma la eliminación mediante un modal (no alert nativo).
 * - Muestra alertas de éxito, advertencia o error al realizar acciones.
 * - Dentro del modal, muestra un Alert cuando faltan campos obligatorios.
 * - Filtros por categoría y estado (botón sin borde).
 * - Botón "Agregar Tarea" flotante (siempre visible al hacer scroll).
 *
 * Componentes utilizados:
 * - SearchBar, FilterButton (compartidos desde inventarios)
 * - Alert, Modal, Button, Input, Select, Icon, CustomText, Spinner, FlatList, NumberInput
 *
 * Dependencias:
 * - useTareas (hook para datos y CRUD)
 * - tareasStyles (estilos locales)
 * - tareasMensajes (constantes de texto)
 * - STYLE (estilos globales)
 * - InventarioService (para obtener productos)
 * ============================================================
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, FlatList, Text, ScrollView, Pressable } from "react-native";
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
import FilterButton from "../../inventarios/components/FilterButton";
import NumberInput from "../../../shared/components/NumberInput";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

import { useTareas } from "../hooks/useTareas";
import {
  TEXTOS_PANTALLA,
  HEADERS_TABLA,
  OPCIONES_CATEGORIA,
  TEXTOS_MODAL_TAREA,
  OPCIONES_ESTADO,
  TEXTOS_MODAL_PRODUCTO,
} from "../constants/tareasMensajes";
import { styles } from "../styles/tareasStyles";
import { getProductosInventario } from "../../inventarios/services/InventarioService";

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

  const productosDisponibles = getProductosInventario();

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

      <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
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
              tarea.productos.map((p) => {
                const producto = productosDisponibles.find(
                  (prod) => prod.id === p.productoId
                );
                return (
                  <CustomText key={p.productoId} style={styles.equipoDetailVal}>
                    {producto?.nombre || `ID: ${p.productoId}`} - {p.cantidad}{" "}
                    {producto?.unidad || "u"}
                  </CustomText>
                );
              })
            ) : (
              <CustomText style={styles.equipoDetailVal}>
                {TEXTOS_MODAL_PRODUCTO.sinProductos}
              </CustomText>
            )}
          </View>
        </View>
      </ScrollView>

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
  const [estado, setEstado] = useState("no_iniciada");
  const [productos, setProductos] = useState([]);
  const [errores, setErrores] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Estados para la búsqueda y selección de productos
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // objeto producto
  const [cantidadProducto, setCantidadProducto] = useState("");

  const productosDisponibles = getProductosInventario();

  // Filtrado local de productos
  const productosFiltrados = productosDisponibles.filter((p) =>
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase().trim())
  );

  useEffect(() => {
    if (visible && modoEdicion && tareaEditando) {
      setNombre(tareaEditando.nombre || "");
      setDescripcion(tareaEditando.descripcion || "");
      setCategoria(tareaEditando.categoria || "");
      setDuracion(String(tareaEditando.duracionEstimada || ""));
      setEstado(tareaEditando.estado || "no_iniciada");
      setProductos(tareaEditando.productos || []);
      setErrores({});
      setSubmitted(false);
    } else if (visible && !modoEdicion) {
      setNombre("");
      setDescripcion("");
      setCategoria("");
      setDuracion("");
      setEstado("no_iniciada");
      setProductos([]);
      setErrores({});
      setSubmitted(false);
    }
    // Limpiar búsqueda y selección al abrir/cerrar
    setBusquedaProducto("");
    setProductoSeleccionado(null);
    setCantidadProducto("");
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
      estado,
      productos,
    });
  };

  // Función para seleccionar un producto de la lista
  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setCantidadProducto("1"); // valor por defecto
  };

  // Función para agregar el producto seleccionado con la cantidad indicada
  const agregarProductoConCantidad = () => {
    if (!productoSeleccionado) return;
    const cantidadNum = Number(cantidadProducto);
    if (!cantidadProducto || isNaN(cantidadNum) || cantidadNum <= 0) {
      // Podríamos mostrar un alert, pero por ahora no hacemos nada
      return;
    }

    // Verificar si ya existe el producto
    const existe = productos.some((p) => p.productoId === productoSeleccionado.id);
    if (existe) {
      // Si existe, sumamos la cantidad
      setProductos((prev) =>
        prev.map((p) =>
          p.productoId === productoSeleccionado.id
            ? { ...p, cantidad: p.cantidad + cantidadNum }
            : p
        )
      );
    } else {
      setProductos((prev) => [
        ...prev,
        {
          productoId: productoSeleccionado.id,
          cantidad: cantidadNum,
          nombre: productoSeleccionado.nombre,
        },
      ]);
    }
    // Limpiar selección y búsqueda
    setProductoSeleccionado(null);
    setCantidadProducto("");
    setBusquedaProducto("");
  };

  const eliminarProducto = (productoId) => {
    setProductos((prev) => prev.filter((p) => p.productoId !== productoId));
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

        {/* Estado */}
        <Select
          label="Estado"
          options={OPCIONES_ESTADO}
          value={estado}
          onChange={setEstado}
          placeholder="Seleccionar estado"
        />

        {/* Productos con búsqueda y lista */}
        <View style={{ marginTop: 12 }}>
          <CustomText size={14} weight="600" color={COLORS.textSecondary}>
            Productos utilizados
          </CustomText>

          {/* Barra de búsqueda de productos */}
          <SearchBar
            value={busquedaProducto}
            onChangeText={setBusquedaProducto}
            placeholder="Buscar producto..."
            containerStyle={{ marginTop: 6, marginBottom: 8 }}
          />

          {/* Lista de productos disponibles (con scroll) */}
          {busquedaProducto.trim() !== "" && productosFiltrados.length > 0 && (
            <View style={{ maxHeight: 120, marginBottom: 8 }}>
              <FlatList
                data={productosFiltrados}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => seleccionarProducto(item)}
                    style={({ pressed }) => ({
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.secondary,
                      backgroundColor: pressed ? COLORS.secondary : COLORS.surface,
                    })}
                  >
                    <CustomText>
                      {item.nombre} ({item.unidad}) - Stock: {item.cantidad}
                    </CustomText>
                  </Pressable>
                )}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}

          {/* Bloque para seleccionar cantidad y agregar */}
          {productoSeleccionado && (
            <View style={styles.productoSeleccionadoContainer}>
              <CustomText size={13} weight="600" color={COLORS.textSecondary}>
                Agregar {productoSeleccionado.nombre}
              </CustomText>
              <NumberInput
                label="Cantidad"
                value={cantidadProducto}
                onChangeText={setCantidadProducto}
                min={1}
                max={999}
                step={1}
                containerStyle={{ marginBottom: 6 }}
              />
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Button
                  variant="outline"
                  onPress={() => {
                    setProductoSeleccionado(null);
                    setCantidadProducto("");
                  }}
                  style={{ flex: 1 }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  onPress={agregarProductoConCantidad}
                  style={{ flex: 1, borderColor: COLORS.primary }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
                    <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>
                      Agregar
                    </CustomText>
                  </View>
                </Button>
              </View>
            </View>
          )}

          {/* Lista de productos seleccionados */}
          {productos.length === 0 ? (
            <CustomText size={13} color={COLORS.textTertiary} style={{ marginTop: 8 }}>
              {TEXTOS_MODAL_PRODUCTO.sinProductos}
            </CustomText>
          ) : (
            <View style={{ marginTop: 8 }}>
              {productos.map((p) => {
                const producto = productosDisponibles.find(
                  (prod) => prod.id === p.productoId
                );
                return (
                  <View
                    key={p.productoId}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 6,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.secondary,
                    }}
                  >
                    <CustomText>
                      {producto?.nombre || `ID: ${p.productoId}`} - {p.cantidad}{" "}
                      {producto?.unidad || "u"}
                    </CustomText>
                    <Button
                      variant="outline"
                      onPress={() => eliminarProducto(p.productoId)}
                      style={{ paddingVertical: 2, paddingHorizontal: 6, minWidth: 30, height: 30 }}
                    >
                      <Icon icon={ICONS.delete} size={14} color={COLORS.error} />
                    </Button>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {submitted && hasErrors && (
          <Alert
            variant="danger"
            message="Revisa los campos obligatorios marcados con * antes de guardar."
            style={{ marginBottom: 12 }}
          />
        )}
      </ScrollView>

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
          variant="outline"
          onPress={handleGuardar}
          style={[styles.btnAccept, { flexDirection: "row", alignItems: "center", gap: 6 }]}
        >
          <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
          <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>
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
    crearTarea,
    actualizarTarea,
    eliminarTarea,
  } = useTareas();

  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);

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

  const handleAgregar = () => {
    setModoEdicion(false);
    setTareaEditando(null);
    setModalVisible(true);
  };

  const handleEditar = (tarea) => {
    setModoEdicion(true);
    setTareaEditando(tarea);
    setModalVisible(true);
  };

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

      {/* Modales */}
      <ModalTarea
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modoEdicion={modoEdicion}
        tareaEditando={tareaEditando}
        onGuardar={handleGuardarTarea}
      />

      <ModalDetalleTarea
        visible={detalleModalVisible}
        tarea={tareaSeleccionada}
        onClose={() => setDetalleModalVisible(false)}
      />

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