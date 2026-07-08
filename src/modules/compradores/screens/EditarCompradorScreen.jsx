/**
 * ============================================================
 * PANTALLA: EDITARCOMPRADORSCREEN
 * ============================================================
 * Módulo: Compradores
 *
 * Formulario para editar un comprador existente.
 *
 * FUNCIONALIDAD:
 * 1. Nombre no editable (deshabilitado); tipo de producto,
 *    teléfono, correo, dirección y notas sí se pueden modificar.
 * 2. Teléfono y correo son obligatorios y se validan con formato,
 *    solo al presionar "Guardar comprador" (useEditarCompradorScreen).
 * 3. Muestra una única alerta general arriba del formulario:
 *    error, advertencia o éxito según corresponda.
 *
 * IMPORTANTE:
 * - El borde rojo de Teléfono/Correo se activa por campo, pero el
 *   texto de error es un solo mensaje general (la alerta de
 *   arriba), no uno por campo, según el estándar 1.5.
 * - guardar() no navega a otra pantalla: solo muestra la alerta de
 *   resultado en el mismo formulario.
 * ============================================================
 */

import React, { useState } from "react";
import { View, ScrollView } from "react-native";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Alert from "../../../shared/components/Alert";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles, ICON_STYLES } from "../styles/EditarCompradorStyles";

import { tiposProducto } from "../services/CompradorData";

import { useEditarCompradorScreen, TELEFONO_MAX_LENGTH } from "../hooks/useEditarCompradorScreen";

export default function EditarCompradorScreen() {
  const {
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
    volverADetalle,
    guardar,
  } = useEditarCompradorScreen();

  return (
    <View style={styles.container}>


      {/* Formulario con scroll para evitar que el teclado tape los campos */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card
          title="Información del comprador"
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
            label="Nombre de el comprador *"
            value={nombre}
            editable={false}
            containerStyle={styles.field}
            style={styles.inputDisabled}
            labelStyle={styles.label}
          />

          {/* Campos editables del comprador */}
          <Select
            label="Tipo de producto *"
            value={tipoProducto}
            onChange={setTipoProducto}
            options={tiposProducto}
            containerStyle={styles.field}
            selectStyle={styles.select}
            labelStyle={styles.label}
          />

          <Input
            label="Teléfono *"
            value={telefono}
            onChangeText={handleTelefonoChange}
            placeholder="+506 2222-3344"
            keyboardType="phone-pad"
            maxLength={TELEFONO_MAX_LENGTH}
            containerStyle={styles.field}
            style={[styles.input, errorTelefono !== "" && styles.inputError]}
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
            style={[styles.input, errorCorreo !== "" && styles.inputError]}
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
          <Button variant="outline" onPress={guardar} style={styles.saveButton} textStyle={styles.saveButtonText}>
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} size={ICON_STYLES.save.size} color={COLORS.primary} />
              <CustomText style={styles.saveButtonText}>Guardar comprador</CustomText>
            </View>
          </Button>
        </Card>
      </ScrollView>
    </View>
  );
}
