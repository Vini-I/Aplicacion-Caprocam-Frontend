import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProveedorById, updateProveedor } from "../services/proveedoresService";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";

const TIPOS_PRODUCTO = [
  { label: "Alimento", value: "alimento" },
  { label: "Antibióticos", value: "antibioticos" },
  { label: "Fertilizantes", value: "fertilizantes" },
  { label: "Probióticos", value: "probioticos" },
  { label: "Equipos", value: "equipos" },
];

export default function EditarProveedorScreen() {
  const { id } = useLocalSearchParams();
  const base = getProveedorById(id) || {};
  const router = useRouter();

  const [nombre, setNombre] = useState(base.nombre ?? "");
  const [tipoProducto, setTipoProducto] = useState(base.tipoProducto ?? "");
  const [telefono, setTelefono] = useState(base.telefono ?? "");
  const [correo, setCorreo] = useState(base.correo ?? "");
  const [direccion, setDireccion] = useState(base.direccion ?? "");
  const [notas, setNotas] = useState(base.notas ?? "");

  const originalForm = {
    nombre: base.nombre ?? "",
    tipoProducto: base.tipoProducto ?? "",
    telefono: base.telefono ?? "",
    correo: base.correo ?? "",
    direccion: base.direccion ?? "",
    notas: base.notas ?? "",
  };
  const currentForm = { nombre, tipoProducto, telefono, correo, direccion, notas };
  const hasChanges = JSON.stringify(currentForm) !== JSON.stringify(originalForm);

  const hasRequiredData = telefono !== "" && correo !== "";
  const canSave = hasRequiredData && hasChanges;

  const validationMessage = !hasRequiredData
    ? "Complete los campos obligatorios para guardar."
    : !hasChanges
      ? "Realice algún cambio para guardar la actualización."
      : "";

  function volverADetalle() {
    router.replace({
      pathname: "/(drawer)/inventarios/detalleProveedor",
      params: { id: base.id.toString() },
    });
  }

  function guardar() {
    if (!canSave) return;

    updateProveedor({ id: base.id, nombre, tipoProducto, telefono, correo, direccion, notas });
    volverADetalle();
  }

  return (
    <View style={styles.screen}>
      <Navbar
        title="Editar proveedor"
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        leftContent={
          <Button variant="ghost" onPress={volverADetalle} style={styles.backBtn}>
            <Icon icon={ICONS.exit} size={20} color={COLORS.white} />
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
          <Input
            label="Nombre de la empresa"
            value={nombre}
            editable={false}
            containerStyle={styles.field}
            style={[styles.input, { color: COLORS.textSecondary }]}
            labelStyle={styles.label}
          />

          <Select
            label="Tipo de producto"
            value={tipoProducto}
            onChange={setTipoProducto}
            options={TIPOS_PRODUCTO}
            containerStyle={styles.field}
            selectStyle={styles.select}
            labelStyle={styles.label}
          />

          <Input
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            placeholder="+506 2222-3344"
            keyboardType="phone-pad"
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

          <Button
            onPress={guardar}
            disabled={!canSave}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            textStyle={styles.saveButtonText}
          >
            Guardar cambios
          </Button>

          {validationMessage !== "" && (
            <CustomText style={styles.validationText}>
              {validationMessage}
            </CustomText>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
  },
  navbarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },
  backBtn: {
    marginTop: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  navbarPlaceholder: { width: 32, height: 32 },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: COLORS.white,
    borderColor: COLORS.header,
  },
  cardTitle: {
    fontSize: 19,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  field: { marginBottom: 14 },
  label: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.black,
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.header,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  select: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.header,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textQuaternary || "#D1D5DB",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.white,
  },
  validationText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});