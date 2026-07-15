/**
 * ============================================================
 * PANTALLA: TareaFormScreen
 * ============================================================
 *
 * Responsabilidad:
 * Formulario para crear o editar una tarea de mantenimiento.
 *
 * Funcionalidad:
 * - Permite ingresar nombre, descripción, categoría, duración estimada y estado.
 * - Permite asociar productos al inventario (búsqueda, selección, cantidad).
 * - Muestra validaciones de campos obligatorios.
 * - Guarda la tarea (creación o edición) y navega de vuelta a la lista.
 *
 * Datos:
 * - Recibe un id opcional por parámetro de ruta para edición.
 *
 * Validaciones:
 * - Nombre, descripción, categoría y duración son obligatorios.
 * - Los productos son opcionales.
 *
 * Navegación:
 * - Al guardar o cancelar, navega a la lista de tareas ('/equipos/tareas').
 *
 * Dependencias:
 * - useTareaForm (hook)
 * - NavbarRegistro, Card, Input, Select, Button, Alert, SearchBar, NumberInput
 * - STYLE global, TareaFormStyles
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { STYLE } from '../../../theme/style';
import { styles } from '../styles/TareaFormStyles';

import NavbarRegistro from '../../../shared/components/NavbarRegistro';
import Card from '../../../shared/components/Card';
import Input from '../../../shared/components/Input';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
import Alert from '../../../shared/components/Alert';
import Icon from '../../../shared/components/Icons';
import CustomText from '../../../shared/components/Text';
import SearchBar from '../../inventarios/components/SearchBar';
import NumberInput from '../../../shared/components/NumberInput';

import { useTareaForm } from '../hooks/useTareaForm';
import { OPCIONES_CATEGORIA, OPCIONES_ESTADO } from '../constants/tareasMensajes';
import { ICONS } from '../../../theme/icons';
import { COLORS } from '../../../theme/colors';

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
    productosFiltrados,
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
    return (
      <View style={STYLE.container}>
        <CustomText>Cargando tarea...</CustomText>
      </View>
    );
  }


  // Validación de errores generales
  const tieneErrores = Object.keys(errores).some(k => k !== 'general' && errores[k]);

  return (
    <>

      <View style={STYLE.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={STYLE.contentWrapper}>
            <Card style={styles.card}>
              {/* Nombre */}
              <Input
                label="Nombre de la tarea *"
                value={nombre}
                onChangeText={(v) => handleChange('nombre', v)}
                placeholder="Ej: Cambio de aceite"
                style={submitted && errores.nombre ? styles.inputError : null}
                labelStyle={styles.label}
              />

              {/* Descripción */}
              <Input
                label="Descripción *"
                value={descripcion}
                onChangeText={(v) => handleChange('descripcion', v)}
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
                onChange={(v) => handleChange('categoria', v)}
                placeholder="Seleccionar categoría"
                selectStyle={submitted && errores.categoria ? styles.inputError : null}
                labelStyle={styles.label}
              />

              {/* Duración estimada */}
              <NumberInput
                label="Duración estimada (horas) *"
                value={duracion}
                onChangeText={(v) => handleChange('duracion', v)}
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
                onChange={(v) => handleChange('estado', v)}
                placeholder="Seleccionar estado"
                labelStyle={styles.label}
              />

              {/* Productos utilizados */}
              <View style={styles.productosSection}>
                <CustomText size={14} weight="600" color={COLORS.textSecondary} style={styles.sectionLabel}>
                  Productos utilizados (opcional)
                </CustomText>

                <SearchBar
                  value={busquedaProducto}
                  onChangeText={handleBusquedaProducto}
                  placeholder="Buscar producto..."
                  containerStyle={styles.searchBarContainer}
                />

                {busquedaProducto.trim() !== '' && productosFiltrados.length > 0 && (
                  <View style={styles.listaProductosDisponibles}>
                    {productosFiltrados.map((p) => (
<Button
  key={p.id}
  variant="outline"
  onPress={() => seleccionarProducto(p)}
  style={styles.itemProducto}
>
  <CustomText style={styles.itemProductoText}>
    {p.nombre} ({p.unidad}) - Stock: {p.cantidad}
  </CustomText>
</Button>
                    ))}
                  </View>
                )}

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
                          setProductoSeleccionado(null);
                          setCantidadProducto('');
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
                          <CustomText style={{ color: COLORS.primary, fontWeight: '600' }}>Agregar</CustomText>
                        </View>
                      </Button>
                    </View>
                  </View>
                )}

                {/* Lista de productos seleccionados */}
                <View style={styles.listaProductosSeleccionados}>
                  {productos.length === 0 ? (
                    <CustomText size={13} color={COLORS.textTertiary}>
                      No hay productos agregados.
                    </CustomText>
                  ) : (
                    productos.map((p) => {
                      const producto = productosFiltrados.find(prod => prod.id === p.productoId) || { nombre: `ID: ${p.productoId}`, unidad: 'u' };
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

              {/* Alerta de errores de validación */}
              {submitted && tieneErrores && (
                <Alert
                  variant="danger"
                  message="Revisa los campos obligatorios marcados con * antes de guardar."
                  style={styles.alert}
                  textStyle={styles.alertText}
                />
              )}

              {errores.general && (
                <Alert
                  variant="danger"
                  message={errores.general}
                  style={styles.alert}
                  textStyle={styles.alertText}
                />
              )}

              {/* Botones */}
              <View style={styles.botonesContainer}>

                <Button
                  variant="outline"
                  onPress={guardar}
                  style={styles.btnGuardar}
                  disabled={loading}
                >
                  <View style={styles.contenidoBoton}>
                    <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
                    <CustomText style={{ color: COLORS.primary, fontWeight: '600' }}>
                      {loading ? 'Guardando...' : 'Guardar'}
                    </CustomText>
                  </View>
                </Button>
              </View>
            </Card>
          </View>
        </ScrollView>
      </View>
    </>
  );
}