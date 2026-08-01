/**
 * ============================================================
 * PANTALLA NUEVO PROVEEDOR
 * ============================================================
 *
 * Pantalla para registrar un nuevo proveedor.
 *
 * FUNCIONALIDAD:
 * 1. Muestra un formulario con nombre, tipo de producto, telefono,
 *    correo, direccion y notas.
 * 
 * 2. Los campos obligatorios (nombre, tipo de producto, telefono,
 *    correo, direccion) llevan asterisco visible desde el primer
 *    render. Notas es el unico campo opcional.
 * 
 * 3. Al presionar Guardar proveedor se valida el formulario:
 *    - Cada campo invalido se marca en rojo solo el borde, sin
 *      mensaje ni icono individual debajo del campo.
 *    - Arriba del boton Guardar proveedor aparece el mensaje
 *      general, dentro de una alerta.
 * 
 * 4. Si el guardado es exitoso, se muestra una alerta de confirmacion
 *    tambien arriba del boton "Guardar proveedor", y el proveedor
 *    queda agregado a proveedoresMock (se refleja en ProveedorScreen).
 *
 * IMPORTANTE:
 * - No navega a otras pantallas; al guardar exitosamente se queda en
 *   la misma vista.

 * - Toda la logica de validacion vive en useNuevoProveedorScreen, la
 *   screen solo pinta el estado.
 */
import React from "react";
import { View, ScrollView } from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Text from "../../../shared/components/Text";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomAlert from "../../../shared/components/Alert";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { styles } from "../styles/NuevoProveedorStyles.js";
import { tiposProducto } from "../services/proveedor.service.js";

import {
  useNuevoProveedorScreen,
  TELEFONO_MAX_LENGTH,
} from "../hooks/useNuevoProveedorScreen";

export default function NuevoProveedorScreen() {
  const {
    nombre,
    setNombre,
    tipoProducto,
    setTipoProducto,
    telefono,
    correo,
    setCorreo,
    direccion,
    setDireccion,
    notas,
    setNotas,
    mensajeError,
    guardadoExitoso,
    errores,
    handleTelefonoChange,
    handleSubmit,
  } = useNuevoProveedorScreen();

  return (
    <View style={STYLE.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={STYLE.contentWrapper}>
          <Card style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon icon={ICONS.id} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Información del proveedor</Text>
          </View>

          <Input
            label="Nombre de la empresa *"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Biomar S.A."
            containerStyle={styles.field}
            style={[styles.input, errores.nombre && styles.inputError]}
            labelStyle={styles.label}
          />

          <Select
            label="Tipo de producto *"
            value={tipoProducto}
            options={tiposProducto}
            onChange={setTipoProducto}
            placeholder="Seleccione un tipo de producto"
            containerStyle={styles.field}
            selectStyle={[styles.select, errores.tipoProducto && styles.inputError]}
            labelStyle={styles.label}
            selectedTextStyle={styles.selectText}
            optionTextStyle={styles.selectOption}
          />

          <Input
            label="Teléfono *"
            value={telefono}
            onChangeText={handleTelefonoChange}
            placeholder="+506 7689-9087"
            keyboardType="phone-pad"
            maxLength={TELEFONO_MAX_LENGTH}
            containerStyle={styles.field}
            style={[styles.input, errores.telefono && styles.inputError]}
            labelStyle={styles.label}
          />

          <Input
            label="Correo electrónico *"
            value={correo}
            onChangeText={setCorreo}
            placeholder="ventas@empresa.com"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.field}
            style={[styles.input, errores.correo && styles.inputError]}
            labelStyle={styles.label}
          />

          <Input
            label="Dirección *"
            value={direccion}
            onChangeText={setDireccion}
            placeholder="San José, Costa Rica"
            containerStyle={styles.field}
            style={[styles.input, errores.direccion && styles.inputError]}
            labelStyle={styles.label}
          />

          <Input
            label="Notas"
            value={notas}
            onChangeText={setNotas}
            placeholder="Observaciones adicionales..."
            multiline={true}
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />

          {mensajeError !== "" && (
            <CustomAlert
              variant="danger"
              message={mensajeError}
              style={styles.alertBox}
              textStyle={styles.alertText}
            />
          )}

          {guardadoExitoso && (
            <CustomAlert
              variant="success"
              message="Proveedor guardado correctamente."
              style={[styles.alertBox, styles.alertSuccess]}
              textStyle={styles.alertText}
            />
          )}

          <Button onPress={handleSubmit} style={styles.saveButton}>
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} color={COLORS.primary} />
              <Text style={styles.saveButtonText}>Guardar proveedor</Text>
            </View>
          </Button>
        </Card>
        </View>
      </ScrollView>
    </View>
  );
}