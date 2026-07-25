// src/modules/mantEquipo/screens/TareaFormScreen.jsx

import React from "react";
import { View, ScrollView } from "react-native";
import { STYLE } from "../../../theme/style";
import { styles } from "../styles/TareaFormStyles";

import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import NumberInput from "../../../shared/components/NumberInput";

import { useTareaForm } from "../hooks/useTareaForm";
import { OPCIONES_CATEGORIA, OPCIONES_ESTADO } from "../constants/tareasMensajes";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

export default function TareaFormScreen() {
  const {
    nombre,
    descripcion,
    categoria,
    duracion,
    estado,
    productos,
    busquedaProducto,
    productoSeleccionado,
    cantidadProducto,
    errores,
    submitted,
    loading,
    cargandoDatos,
    isEditing,
    opcionesProductos,
    hayResultados,
    handleChange,
    handleBusquedaProducto,
    seleccionarProducto,
    handleCantidadProducto,
    agregarProducto,
    eliminarProducto,
    guardar,
    cancelar,
  } = useTareaForm();

  if (cargandoDatos) {
    return <View style={STYLE.container} />;
  }

  // Determinar qué mensaje mostrar: prioridad al error del servidor
  const mensajeError = errores.general || (submitted && Object.keys(errores).some(k => k !== "general" && errores[k]) ? "Revisa los campos obligatorios marcados con *" : "");

  return (
    <View style={STYLE.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={STYLE.contentWrapper}>
          {/* Formulario dentro del Card */}
          <Card style={styles.card}>
            {/* Nombre */}
            <Input
              label="Nombre de la tarea *"
              value={nombre}
              onChangeText={(v) => handleChange("nombre", v)}
              placeholder="Ej: Cambio de aceite"
              style={submitted && errores.nombre ? styles.inputError : null}
              labelStyle={styles.label}
            />

            {/* Descripción */}
            <Input
              label="Descripción *"
              value={descripcion}
              onChangeText={(v) => handleChange("descripcion", v)}
              placeholder="Describe la tarea en detalle"
              multiline
              style={[styles.textArea, submitted && errores.descripcion ? styles.inputError : null]}
              labelStyle={styles.label}
            />

            {/* Categoría */}
            <Select
              label="Categoría *"
              options={OPCIONES_CATEGORIA}
              value={categoria}
              onChange={(v) => handleChange("categoria", v)}
              placeholder="Seleccionar categoría"
              selectStyle={submitted && errores.categoria ? styles.inputError : null}
              labelStyle={styles.label}
            />

            {/* Duración estimada */}
            <NumberInput
              label="Duración estimada (horas) *"
              value={duracion}
              onChangeText={(v) => handleChange("duracion", v)}
              min={0.5}
              max={100}
              step={0.5}
              style={submitted && errores.duracion ? styles.inputError : null}
              labelStyle={styles.label}
            />

            {/* Estado */}
            <Select
              label="Estado"
              options={OPCIONES_ESTADO}
              value={estado}
              onChange={(v) => handleChange("estado", v)}
              placeholder="Seleccionar estado"
              labelStyle={styles.label}
            />

            {/* Productos utilizados */}
            <View style={styles.productosSection}>
              <CustomText size={14} weight="600" color={COLORS.textSecondary} style={styles.sectionLabel}>
                Productos utilizados (opcional)
              </CustomText>

              <Input
                label="Buscar producto"
                placeholder="Escribe para buscar un producto..."
                value={busquedaProducto}
                onChangeText={handleBusquedaProducto}
                containerStyle={styles.searchInputContainer}
                style={styles.searchInput}
              />

              <Select
                label="Seleccionar producto"
                placeholder={hayResultados ? "Selecciona un producto" : "No hay productos que coincidan"}
                options={opcionesProductos}
                value={productoSeleccionado?.id || ""}
                onChange={(value) => {
                  const producto = opcionesProductos.find(p => p.value === value);
                  if (producto) {
                    const prodCompleto = { id: producto.value, nombre: producto.label.split(" (")[0] };
                    seleccionarProducto(prodCompleto);
                  }
                }}
                containerStyle={styles.selectProductoContainer}
                selectStyle={styles.selectProducto}
                labelStyle={styles.label}
                disabled={!hayResultados}
              />

              {productoSeleccionado && (
                <View style={styles.productoSeleccionadoContainer}>
                  <CustomText size={13} weight="600" color={COLORS.textSecondary}>
                    Agregar {productoSeleccionado.nombre}
                  </CustomText>
                  <NumberInput
                    label="Cantidad"
                    value={cantidadProducto}
                    onChangeText={handleCantidadProducto}
                    min={1}
                    max={999}
                    step={1}
                    containerStyle={styles.cantidadInput}
                  />
                  <View style={styles.botonesProducto}>
                    <Button
                      variant="outline"
                      onPress={() => {
                        seleccionarProducto(null);
                        handleCantidadProducto("");
                      }}
                      style={styles.btnCancelarProducto}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="outline"
                      onPress={agregarProducto}
                      style={styles.btnAgregarProducto}
                      textStyle={{ color: COLORS.primary }}
                    >
                      <View style={styles.contenidoBotonProducto}>
                        <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
                        <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>Agregar</CustomText>
                      </View>
                    </Button>
                  </View>
                </View>
              )}

              <View style={styles.listaProductosSeleccionados}>
                {productos.length === 0 ? (
                  <CustomText size={13} color={COLORS.textTertiary}>
                    No hay productos agregados.
                  </CustomText>
                ) : (
                  productos.map((p) => {
                    const producto = productosDisponibles.find(prod => prod.id === p.productoId) || { nombre: `ID: ${p.productoId}`, unidad: "u" };
                    return (
                      <View key={p.productoId} style={styles.itemProductoSeleccionado}>
                        <CustomText style={styles.itemProductoSeleccionadoText}>
                          {producto.nombre} - {p.cantidad} {producto.unidad}
                        </CustomText>
                        <Button
                          variant="outline"
                          onPress={() => eliminarProducto(p.productoId)}
                          style={styles.btnEliminarProducto}
                        >
                          <Icon icon={ICONS.delete} size={14} color={COLORS.error} />
                        </Button>
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          </Card>

          {/* ─── MENSAJES DE ERROR Y BOTÓN FUERA DEL CARD ─── */}
          <View style={{ marginTop: 16 }}>
            {mensajeError !== "" && (
              <Alert
                variant="danger"
                message={mensajeError}
                style={styles.alert}
                textStyle={styles.alertText}
              />
            )}

            <View style={styles.botonesContainer}>
              <Button
                variant="outline"
                onPress={guardar}
                style={styles.btnGuardar}
                disabled={loading}
              >
                <View style={styles.contenidoBoton}>
                  <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
                  <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>
                    {loading ? "Guardando..." : "Guardar Tarea"}
                  </CustomText>
                </View>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}