/**
 * EditarProveedorScreen
 * Pantalla para editar la información de un proveedor existente.
 * Permite modificar el tipo de producto, teléfono, correo, dirección y notas del proveedor.
 * Incluye validaciones para teléfono y correo electrónico.
 * Al guardar, redirige a la pantalla de detalle del proveedor.
 */
import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Alert from "../../../shared/components/Alert";

import { styles, ICON_STYLES } from "../styles/EditarProveedorStyles";
import { ICONS } from "../../../theme/icons";
import { tiposProducto } from "../services/ProveedorData";

import {
  useEditarProveedorScreen,
  TELEFONO_MAX_LENGTH,
} from "../hooks/useEditarProveedorScreen";

export default function EditarProveedorScreen() {
  const router = useRouter();
  const {
    base,
    nombre,
    tipoProducto,
    setTipoProducto,
    telefono,
    correo,
    direccion,
    setDireccion,
    notas,
    setNotas,
    errorTelefono,
    errorCorreo,
    alerta,
    handleTelefonoChange,
    handleCorreoChange,
    guardar,
  } = useEditarProveedorScreen();

  function volverADetalle() {
    router.replace({
      pathname: "/(drawer)/proveedores/detalleProveedor",
      params: { id: base.id.toString() },
    });
  }

  return (
    <View style={styles.container}>
      <Navbar
        title="Editar proveedor"
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        leftContent={
          <Button variant="ghost" onPress={volverADetalle}>
            <Icon
              icon={ICONS.exit}
              size={ICON_STYLES.exit.size}
              color={ICON_STYLES.exit.color}
            />
          </Button>
        }
        rightContent={<View style={styles.navbarPlaceholder} />}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card
          title="Información del proveedor"
          style={styles.card}
          titleStyle={styles.cardTitle}
        >
          {alerta && (
            <Alert
              variant={alerta.variant}
              message={alerta.message}
              style={styles.alertContainer}
            />
          )}

          <Input
            label="Nombre de la empresa"
            value={nombre}
            editable={false}
            containerStyle={styles.field}
            style={styles.inputDisabled}
            labelStyle={styles.label}
          />

          <Select
            label="Tipo de producto"
            value={tipoProducto}
            onChange={setTipoProducto}
            options={tiposProducto}
            containerStyle={styles.field}
            selectStyle={styles.select}
            labelStyle={styles.label}
          />

          <Input
            label="Teléfono"
            value={telefono}
            onChangeText={handleTelefonoChange}
            placeholder="+506 2222-3344"
            keyboardType="phone-pad"
            maxLength={TELEFONO_MAX_LENGTH}
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />
          {errorTelefono !== "" && (
            <CustomText style={styles.errorText}>{errorTelefono}</CustomText>
          )}

          <Input
            label="Correo electrónico"
            value={correo}
            onChangeText={handleCorreoChange}
            placeholder="ventas@empresa.com"
            keyboardType="email-address"
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />
          {errorCorreo !== "" && (
            <CustomText style={styles.errorText}>{errorCorreo}</CustomText>
          )}

          <Input
            label="Dirección"
            value={direccion}
            onChangeText={setDireccion}
            placeholder="San José, Costa Rica"
            containerStyle={styles.field}
            style={styles.input}
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

          <Button
            onPress={guardar}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}
          >
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} size={ICON_STYLES.save.size} color={ICON_STYLES.exit.color} />
              <CustomText style={styles.saveButtonText}>Guardar proveedor</CustomText>
            </View>
          </Button>
        </Card>
      </ScrollView>
    </View>
  );
}
