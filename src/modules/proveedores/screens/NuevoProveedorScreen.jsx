import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Text from "../../../shared/components/Text";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomAlert from "../../../shared/components/Alert";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles, ICON_SIZES } from "../styles/StylesNuevoProveedor.js";
import { TIPOS_PRODUCTO } from "../screens/NuevoProveedorData.js";

import {
  useNuevoProveedorScreen,
  TELEFONO_MAX_LENGTH,
} from "../hooks/useNuevoProveedorScreen";

export default function NuevoProveedorScreen() {
  const router = useRouter();
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
    handleTelefonoChange,
    handleSubmit,
  } = useNuevoProveedorScreen();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card
          title="Información del proveedor"
          style={styles.card}
          titleStyle={styles.cardTitle}
        >
          <Input
            label="Nombre de la empresa "
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Biomar S.A."
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />

          <Select
            label="Tipo de producto "
            value={tipoProducto}
            options={TIPOS_PRODUCTO}
            onChange={setTipoProducto}
            placeholder="Seleccione un tipo de producto"
            containerStyle={styles.field}
            selectStyle={styles.select}
            labelStyle={styles.label}
            selectedTextStyle={styles.selectText}
            optionTextStyle={styles.selectOption}
          />

          <Input
            label="Teléfono "
            value={telefono}
            onChangeText={handleTelefonoChange}
            placeholder="+506 7689-9087"
            keyboardType="phone-pad"
            maxLength={TELEFONO_MAX_LENGTH}
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />

          <Input
            label="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            placeholder="ventas@empresa.com"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />

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

          <Button onPress={handleSubmit} style={styles.saveButton}>
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} size={ICON_SIZES.save} color={COLORS.white} />
              <Text style={styles.saveButtonText}>Guardar proveedor</Text>
            </View>
          </Button>

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
              style={styles.alertBox}
              textStyle={styles.alertText}
            />
          )}
        </Card>
      </ScrollView>
    </View>
  );
}
