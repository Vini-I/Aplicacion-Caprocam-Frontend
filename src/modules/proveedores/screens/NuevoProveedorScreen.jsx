/**
 * NuevoProveedorScreen.jsx
 * Pantalla con el formulario para registrar un nuevo proveedor.
 *
 * FUNCIONALIDAD:
 * - Renderiza el formulario con campos requeridos marcados con asterisco.
 * - Muestra la alerta de éxito o error al presionar Guardar.
 *
 * REGLAS IMPORTANTES:
 * - Toda la lógica reside en el hook, la pantalla es solo UI.
 * - Navega de regreso al listado únicamente al guardar con éxito.
 *
 * @dependencies - React, expo-router, Componentes UI, Alert, useNuevoProveedorScreen
 * @validations - Valida campos requeridos y formato numérico en UI
 * @navigation - /(drawer)/proveedores (al guardar)
 */
import React, { useRef, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

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

import { useNuevoProveedorScreen, telefonoMaxLength } from "../hooks/useNuevoProveedorScreen";

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

  const router = useRouter();
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (mensajeError !== "") {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [mensajeError]);

  useEffect(() => {
    if (guardadoExitoso) {
      router.replace("/(drawer)/proveedores");
    }
  }, [guardadoExitoso, router]);

  return (
    <View style={STYLE.container}>
      <ScrollView
        ref={scrollViewRef}
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
            placeholder="Ej: 12345678"
            keyboardType="numeric"
            maxLength={telefonoMaxLength}
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

          <Button onPress={handleSubmit} style={styles.saveButton}>
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} color={COLORS.primary} />
              <Text style={styles.saveButtonText}>Registrar Proveedor</Text>
            </View>
          </Button>
        </Card>
        </View>
      </ScrollView>
    </View>
  );
}