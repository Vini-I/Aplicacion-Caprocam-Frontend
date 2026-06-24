/**
 * EditarProveedorScreen
 * Pantalla para editar la información de un proveedor existente.
 * Permite modificar el tipo de producto, teléfono, correo, dirección y notas del proveedor.
 * Incluye validaciones para teléfono y correo electrónico.
 * Al guardar, redirige a la pantalla de detalle del proveedor.
 */
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { tiposProducto, proveedoresMock } from "../services/ProveedorData";

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

// Regex para validar teléfonos con o sin código de país +506
const TELEFONO_REGEX = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
const TELEFONO_MAX_LENGTH = 14;

// Regex básico para validar formato de correo electrónico
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Retorna mensaje de error si el teléfono está vacío o tiene formato inválido
function validarTelefono(valor) {
  if (!valor) return "El teléfono es obligatorio.";
  if (!TELEFONO_REGEX.test(valor))
    return "Ingrese un teléfono válido. Ej: +506 2222-3344";
  return "";
}

// Retorna mensaje de error si el correo está vacío o tiene formato inválido
function validarCorreo(valor) {
  if (!valor) return "El correo es obligatorio.";
  if (!CORREO_REGEX.test(valor))
    return "Ingrese un correo válido. Ej: ventas@empresa.com";
  return "";
}

export default function EditarProveedorScreen() {
  const router = useRouter();

  // Carga los datos actuales del proveedor como valores iniciales del formulario
  const base = proveedoresMock[0];

  // Campos del formulario
  const [nombre, setNombre] = useState(base.nombre);
  const [tipoProducto, setTipoProducto] = useState(base.tipoProducto);
  const [telefono, setTelefono] = useState(base.telefono);
  const [correo, setCorreo] = useState(base.correo);
  const [direccion, setDireccion] = useState(base.direccion);
  const [notas, setNotas] = useState(base.notas);

  // Errores por campo y alerta general del formulario
  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [alerta, setAlerta] = useState(null);

  // Valida el teléfono en tiempo real mientras el usuario escribe
  function handleTelefonoChange(valor) {
    setTelefono(valor);
    setErrorTelefono(validarTelefono(valor));
  }

  // Valida el correo en tiempo real mientras el usuario escribe
  function handleCorreoChange(valor) {
    setCorreo(valor);
    setErrorCorreo(validarCorreo(valor));
  }

  function volverADetalle() {
    router.replace({
      pathname: "/(drawer)/proveedores/detalleProveedor",
      params: { id: base.id.toString() },
    });
  }

  // Valida todos los campos y guarda si no hay errores
  function guardar() {
    const errorTel = validarTelefono(telefono);
    const errorCorr = validarCorreo(correo);
    setErrorTelefono(errorTel);
    setErrorCorreo(errorCorr);

    if (errorTel !== "" || errorCorr !== "") {
      setAlerta({
        variant: "danger",
        message: "Por favor corrige los datos antes de guardar.",
      });
      return;
    }

    if (!direccion || !notas) {
      setAlerta({
        variant: "warning",
        message: "Hay campos sin completar. Revisa la información antes de continuar.",
      });
      return;
    }

    setAlerta({
      variant: "success",
      message: "Proveedor actualizado correctamente.",
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

      {/* Formulario con scroll para evitar que el teclado tape los campos */}
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
          {/* Alerta general: error, advertencia o confirmación de guardado */}
          {alerta && (
            <Alert
              variant={alerta.variant}
              message={alerta.message}
              style={styles.alertContainer}
            />
          )}

          {/* Nombre deshabilitado, no se permite editar */}
          <Input
            label="Nombre de la empresa"
            value={nombre}
            editable={false}
            containerStyle={styles.field}
            style={styles.inputDisabled}
            labelStyle={styles.label}
          />

          {/* Campos editables del proveedor */}
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

          {/* Botón para guardar, dispara la validación completa */}
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