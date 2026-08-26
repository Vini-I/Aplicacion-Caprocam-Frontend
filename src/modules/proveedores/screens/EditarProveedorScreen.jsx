/**
 * EditarProveedorScreen.jsx
 * Pantalla con el formulario para editar un proveedor.
 *
 * FUNCIONALIDAD:
 * - Renderiza el formulario de edición (nombre de solo lectura).
 * - Muestra un alert de error si la edición falla.
 *
 * REGLAS IMPORTANTES:
 * - Deshabilita la edición del nombre del proveedor (editable=false).
 * - Delega toda la lógica de negocio al hook.
 * - Solo construye la pantalla: no usa useRouter, ese vive en app/
 *   (mismo patrón que las demás pantallas de proveedores y que finca).
 *
 * @dependencies - React, Componentes UI, Alert, useEditarProveedorScreen
 * @validations - Valida campos requeridos y formato numérico en UI
 * @navigation - N/A (delegado al wrapper de ruta vía prop onProveedor)
 */
import React from "react";
import { View, ScrollView } from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Alert from "../../../shared/components/Alert";
import Spinner from "../../../shared/components/Spinner";

import { styles, ICON_STYLES } from "../styles/EditarProveedorStyles";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { tiposProducto } from "../services/proveedor.service";

import { useEditarProveedorScreen, telefonoMaxLength } from "../hooks/useEditarProveedorScreen";
import { formatearTelefono } from "../utils/contactValidators";

export default function EditarProveedorScreen({ onProveedor, id }) {
  const {
    scrollViewRef,
    nombre,
    tipoProducto,
    setTipoProducto,
    telefono,
    correo,
    direccion,
    setDireccion,
    notas,
    setNotas,
    errores,
    alerta,
    cargando,
    handleTelefonoChange,
    handleCorreoChange,
    guardar,
  } = useEditarProveedorScreen({ onProveedor, id });

  if (cargando) {
    return (
      <View style={STYLE.container}>
        <View style={STYLE.contentWrapper}>
          <Spinner text="Cargando datos del proveedor..." style={{ marginTop: 40 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={STYLE.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={STYLE.contentWrapper}>
        <Card style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon icon={ICONS.id} color={ICON_STYLES.subtitle.color} />
            <CustomText style={styles.cardTitle}>Información del proveedor</CustomText>
          </View>

          <Input
            label="Nombre de la empresa"
            value={nombre}
            editable={false}
            containerStyle={styles.field}
            style={styles.inputDisabled}
            labelStyle={styles.label}
          />

          <Select
            label="Tipo de producto *"
            value={tipoProducto}
            onChange={setTipoProducto}
            options={tiposProducto}
            containerStyle={styles.field}
            selectStyle={[styles.select, !!errores.tipoProducto && styles.inputError]}
            labelStyle={styles.label}
          />

          <Input
            label="Teléfono *"
            value={formatearTelefono(telefono)}
            onChangeText={handleTelefonoChange}
            placeholder="Ej: 1234-5678"
            keyboardType="numeric"
            maxLength={telefonoMaxLength}
            containerStyle={styles.field}
            style={[styles.input, !!errores.telefono && styles.inputError]}
            labelStyle={styles.label}
          />

          <Input
            label="Correo electrónico *"
            value={correo}
            onChangeText={handleCorreoChange}
            placeholder="ventas@empresa.com"
            keyboardType="email-address"
            maxLength={120}
            containerStyle={styles.field}
            style={[styles.input, !!errores.correo && styles.inputError]}
            labelStyle={styles.label}
          />

          <Input
            label="Dirección *"
            value={direccion}
            onChangeText={setDireccion}
            placeholder="San José, Costa Rica"
            maxLength={255}
            containerStyle={styles.field}
            style={[styles.input, !!errores.direccion && styles.inputError]}
            labelStyle={styles.label}
          />

          <Input
            label="Notas"
            value={notas}
            onChangeText={setNotas}
            placeholder="Observaciones adicionales..."
            multiline={true}
            maxLength={255}
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />

          {alerta && (
            <Alert
              variant={alerta.variant}
              message={alerta.message}
              style={[
                styles.alertBox,
                alerta.variant === "success" && styles.alertSuccess,
              ]}
              textStyle={styles.alertText}
            />
          )}

          <Button
            onPress={guardar}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}
          >
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} color={ICON_STYLES.save.color} />
              <CustomText style={styles.saveButtonText}>Editar Proveedor</CustomText>
            </View>
          </Button>
        </Card>
        </View>
      </ScrollView>
    </View>
  );
}