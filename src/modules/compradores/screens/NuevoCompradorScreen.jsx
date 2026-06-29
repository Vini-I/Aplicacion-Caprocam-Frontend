import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Navbar from "../../../shared/components/Navbar";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import CustomText from "../../../shared/components/Text";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomAlert from "../../../shared/components/Alert";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles, ICON_SIZES } from "../styles/StylesNuevoComprador";
import { TIPOS_PRODUCTO } from "../services/NuevoCompradorData";

import { useNuevoCompradorScreen, TELEFONO_MAX_LENGTH } from "../hooks/useNuevoCompradorScreen";

export default function NuevoCompradorScreen() {
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
    handleVolver,
  } = useNuevoCompradorScreen();

  return (
    <View style={styles.container}>

      {/* Navbar con botón para volver a la lista de compradores */}
      <View style={styles.navbar}>
        <View style={styles.navbarRow}>
          <Button
            variant="ghost"
            onPress={handleVolver}
            style={styles.backBtn}
          >
            <Icon icon={ICONS.exit} size={ICON_SIZES.back} color={COLORS.white} />
          </Button>
          <CustomText style={styles.navbarTitle}>Nuevo comprador</CustomText>
        </View>
      </View>

      {/* Formulario con scroll para evitar que el teclado tape los campos */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card
          title="Información del comprador"
          style={styles.card}
          titleStyle={styles.cardTitle}
        >
          {/* Campos del formulario */}
          <Input
            label="Nombre del comprador"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Biomar S.A."
            containerStyle={styles.field}
            style={styles.input}
            labelStyle={styles.label}
          />

          <Select
            label="Tipo de producto"
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
            label="Teléfono"
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

          {/* Botón para guardar, dispara la validación */}
          <Button onPress={handleSubmit} style={styles.saveButton}>
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} size={ICON_SIZES.save} color={COLORS.white} />
              <CustomText style={styles.saveButtonText}>Guardar comprador</CustomText>
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
              message="Comprador guardado correctamente."
              style={styles.alertBox}
              textStyle={styles.alertText}
            />
          )}
        </Card>
      </ScrollView>
    </View>
  );
}
