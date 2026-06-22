import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

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
import { addProveedor } from "../services/proveedoresService";
import { styles } from "../styles/nuevoProveedorStyles";

const TIPOS_PRODUCTO = [
  { label: "Alimento", value: "alimento" },
  { label: "Antibióticos", value: "antibioticos" },
  { label: "Fertilizantes", value: "fertilizantes" },
  { label: "Probióticos", value: "probioticos" },
  { label: "Equipos", value: "equipos" },
];

export default function NuevoProveedorScreen() {
  const [nombre, setNombre] = useState("");
  const [tipoProducto, setTipoProducto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");

  const router = useRouter();

  const hasRequiredData = nombre.trim() !== "" && tipoProducto !== "";
  const canSave = hasRequiredData;

  const validationMessage = !hasRequiredData
    ? "Complete los campos obligatorios para guardar."
    : "";

  function handleSubmit() {
    if (!canSave) return;

    const proveedor = {
      nombre: nombre.trim(),
      tipoProducto,
      telefono,
      correo,
      direccion,
      notas,
    };

    addProveedor(proveedor);
    router.replace("/(drawer)/inventarios/proveedorScreen");
  }

  return (
    <View style={styles.screen}>
      <Navbar
        title="Nuevo proveedor"
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        leftContent={
          <Button
            variant="ghost"
            onPress={() => router.replace("/(drawer)/inventarios/proveedorScreen")}
            style={styles.backBtn}
          >
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
            label="Nombre de la empresa *"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Biomar S.A."
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />

          <Select
            label="Tipo de producto *"
            value={tipoProducto}
            options={TIPOS_PRODUCTO}
            onChange={setTipoProducto}
            placeholder="Seleccione un tipo de producto"
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
            onPress={handleSubmit}
            disabled={!canSave}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            textStyle={styles.saveButtonText}
          >
            Guardar proveedor
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

