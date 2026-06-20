import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getProveedorById,
  updateProveedor,
  TIPOS_PRODUCTO,
} from "../services/proveedoresService";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";

import { styles } from "../styles/editarProveedorStyles";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

function validarTelefono(valor) {
  if (!valor) return "El teléfono es obligatorio.";
  const soloDigitos = valor.replace(/\D/g, "");
  if (soloDigitos.length !== 8)
    return "El teléfono debe tener exactamente 8 dígitos.";
  return "";
}

function validarCorreo(valor) {
  if (!valor) return "El correo es obligatorio.";
  if (!valor.includes("@")) return "El correo debe contener @.";
  const partes = valor.split("@");
  if (!partes[1] || !partes[1].includes("."))
    return "Ingrese un correo válido. Ej: ventas@empresa.com";
  return "";
}

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

  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");

  const originalForm = {
    nombre: base.nombre ?? "",
    tipoProducto: base.tipoProducto ?? "",
    telefono: base.telefono ?? "",
    correo: base.correo ?? "",
    direccion: base.direccion ?? "",
    notas: base.notas ?? "",
  };
  const currentForm = {
    nombre,
    tipoProducto,
    telefono,
    correo,
    direccion,
    notas,
  };
  const hasChanges =
    JSON.stringify(currentForm) !== JSON.stringify(originalForm);

  const hasRequiredData = telefono !== "" && correo !== "";
  const canSave = hasRequiredData && hasChanges;

  const validationMessage = !hasRequiredData
    ? "Complete los campos obligatorios para guardar."
    : !hasChanges
      ? "Realice algún cambio para guardar la actualización."
      : "";

  function handleTelefonoChange(valor) {
    setTelefono(valor);
    setErrorTelefono(validarTelefono(valor));
  }

  function handleCorreoChange(valor) {
    setCorreo(valor);
    setErrorCorreo(validarCorreo(valor));
  }

  function volverADetalle() {
    router.replace({
      pathname: "/(drawer)/inventarios/detalleProveedor",
      params: { id: base.id.toString() },
    });
  }

  function guardar() {
    const errorTel = validarTelefono(telefono);
    const errorCorr = validarCorreo(correo);
    setErrorTelefono(errorTel);
    setErrorCorreo(errorCorr);

    if (errorTel !== "" || errorCorr !== "") return;
    if (!hasChanges) return;

    updateProveedor({
      id: base.id,
      nombre,
      tipoProducto,
      telefono,
      correo,
      direccion,
      notas,
    });
    volverADetalle();
  }

  return (
    <View style={styles.screen}>
      <Navbar
        title="Editar proveedor"
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        leftContent={
          <Button
            variant="ghost"
            onPress={volverADetalle}
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
            onChangeText={handleTelefonoChange}
            placeholder="+506 2222-3344"
            keyboardType="phone-pad"
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />
          {errorTelefono !== "" && (
            <CustomText style={styles.validationText}>{errorTelefono}</CustomText>
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
            <CustomText style={styles.validationText}>{errorCorreo}</CustomText>
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
