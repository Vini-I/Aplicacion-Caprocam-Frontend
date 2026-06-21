import React, { useState } from "react";
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

const TELEFONO_REGEX = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
const TELEFONO_MAX_LENGTH = 14;
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NuevoProveedorScreen() {
  const [nombre, setNombre] = useState("");
  const [tipoProducto, setTipoProducto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");

  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const router = useRouter();

  const handleTelefonoChange = (valor) => {
    setTelefono(valor.replace(/[^\d\s\-+]/g, ""));
  };

  function obtenerMensajeError(nuevosErrores) {
    if (nuevosErrores.nombre || nuevosErrores.tipoProducto || nuevosErrores.telefono) {
      return "Complete los campos obligatorios para guardar.";
    }
    if (nuevosErrores.telefono) return "El teléfono debe tener 8 dígitos";
    if (nuevosErrores.correo) return "Ingrese un correo electrónico válido";
    return "";
  }

  function handleSubmit() {
    const nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = true;
    if (!tipoProducto) nuevosErrores.tipoProducto = true;
    if (!telefono.trim()) nuevosErrores.telefono = true;
    if (telefono.trim() !== "" && !TELEFONO_REGEX.test(telefono.trim())) {
      nuevosErrores.telefono = true;
    }
    if (correo.trim() !== "" && !CORREO_REGEX.test(correo.trim())) {
      nuevosErrores.correo = true;
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setMensajeError(obtenerMensajeError(nuevosErrores));
      setGuardadoExitoso(false);
      return;
    }

    setErrores({});
    setMensajeError("");
    setGuardadoExitoso(true);

    const proveedor = {
      nombre: nombre.trim(),
      tipoProducto,
      telefono: telefono.trim(),
      correo: correo.trim(),
      direccion: direccion.trim(),
      notas: notas.trim(),
    };

    console.log("Proveedor guardado:", proveedor);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.navbar}>
        <View style={styles.navbarRow}>
          <Button
            variant="ghost"
            onPress={() => router.replace("/(drawer)/proveedores/proveedorScreen")}
            style={styles.backBtn}
          >
            <Icon icon={ICONS.exit} size={ICON_SIZES.back} color={COLORS.white} />
          </Button>
          <Text style={styles.navbarTitle}>Nuevo proveedor</Text>
        </View>
      </View>

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

          <Button
            onPress={handleSubmit}
            style={styles.saveButton}
          >
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