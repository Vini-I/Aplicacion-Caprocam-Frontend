/**
 * EditarProveedorScreen
 * Pantalla para editar la información de un proveedor existente.
 * Permite modificar el tipo de producto, teléfono, correo, dirección y notas del proveedor.
 * Incluye validaciones para teléfono y correo electrónico.
 * Al guardar, redirige a la pantalla de detalle del proveedor.
 *
 * Funcionalidades principales:
 * - Mostrar los datos actuales del proveedor en un formulario editable.
 * - Validar que el teléfono tenga exactamente 8 dígitos.
 * - Validar que el correo tenga un formato válido.
 * - Mostrar mensajes de error en tiempo real al escribir.
 * - Navegar de vuelta al detalle del proveedor al guardar.
 *
 * Datos:
 * - Los datos iniciales del proveedor se cargan desde proveedorData (datos de ejemplo).
 */
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { tiposProducto, proveedoresMock } from "../services/proveedorData";

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

// Validación de teléfono: debe tener exactamente 8 dígitos (sin espacios ni guiones)
function validarTelefono(valor) {
  if (!valor) return "El teléfono es obligatorio.";
  const soloDigitos = valor.replace(/\D/g, "");
  if (soloDigitos.length !== 8)
    return "El teléfono debe tener exactamente 8 dígitos.";
  return "";
}

// Validación de correo: debe tener un formato válido (contener @ y .)
function validarCorreo(valor) {
  if (!valor) return "El correo es obligatorio.";
  if (!valor.includes("@")) return "El correo debe contener @.";
  const partes = valor.split("@");
  if (!partes[1] || !partes[1].includes("."))
    return "Ingrese un correo válido. Ej: ventas@empresa.com";
  return "";
}

export default function EditarProveedorScreen() {
  const router = useRouter();
  const base = proveedoresMock[0];

  const [nombre, setNombre] = useState(base.nombre);
  const [tipoProducto, setTipoProducto] = useState(base.tipoProducto);
  const [telefono, setTelefono] = useState(base.telefono);
  const [correo, setCorreo] = useState(base.correo);
  const [direccion, setDireccion] = useState(base.direccion);
  const [notas, setNotas] = useState(base.notas);

  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");

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
    volverADetalle();
  }

  return (
    <View style={styles.screen}>
      <Navbar
        title="Editar proveedor"
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        leftContent={
          <Button variant="ghost" onPress={volverADetalle}>
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
            Guardar cambios
          </Button>
        </Card>
      </ScrollView>
    </View>
  );
}
