/**
 * ============================================================
 * PANTALLA: NUEVOCOMPRADORSCREEN
 * ============================================================
 * Módulo: Compradores
 *
 * Formulario de alta de un nuevo comprador.
 *
 * FUNCIONALIDAD:
 * 1. Campos: nombre*, cédula*, teléfono*, correo, dirección, notas
 *    (los marcados con * son obligatorios). La cédula, una vez
 *    guardado el comprador, ya no se puede modificar (ver
 *    EditarCompradorScreen.jsx, donde se muestra deshabilitada).
 * 2. Valida al presionar "Guardar comprador" (useNuevoCompradorScreen):
 *    pinta de rojo cada campo inválido y muestra un solo mensaje
 *    general debajo del botón.
 * 3. Al guardar exitosamente, muestra una alerta de éxito en la
 *    misma pantalla (el guardado real queda pendiente de
 *    integración con backend).
 *
 * IMPORTANTE:
 * - Mismo regex y misma regla de teléfono/correo que
 *   useEditarCompradorScreen.js.
 * - El borde rojo nunca aparece antes del primer intento de
 *   guardar.
 * - El campo "Tipo de producto" se eliminó del formulario: las
 *   opciones (antibióticos, fertilizantes, equipos, etc.) no
 *   aplicaban a este flujo.
 * ============================================================
 */



import React from "react";
import { View, ScrollView } from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Text from "../../../shared/components/Text";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import Alert from "../../../shared/components/Alert";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { styles, ICON_SIZES } from "../styles/StylesNuevoComprador";

import { useNuevoCompradorScreen, TELEFONO_MAX_LENGTH, CEDULA_MAX_LENGTH } from "../hooks/useNuevoCompradorScreen";

export default function NuevoCompradorScreen() {
  const {
    nombre,
    setNombre,
    cedula,
    telefono,
    correo,
    setCorreo,
    direccion,
    setDireccion,
    notas,
    setNotas, 
    errorNombre,
    errorCedula,
    errorTelefono,
    errorCorreo,
    mensajeError,  
    guardadoExitoso,
    guardando,
    handleCedulaChange,
    handleTelefonoChange,
    handleSubmit,
    handleVolver,
  } = useNuevoCompradorScreen();

  return (
    <View style={styles.container}>

      {/* Formulario con scroll para evitar que el teclado tape los campos */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, STYLE.contentWrapper]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
           <View style={styles.cardHeader}>
             <Icon icon={ICONS.addUser} color={COLORS.primary} size={22} />
             <Text style={styles.cardTitle}>Información del comprador</Text>
           </View>
          {/* Campos del formulario */}
          <Input
            label="Nombre del comprador *"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. María José Solano Vargas"
            containerStyle={styles.field}
            style={[styles.input, errorNombre && styles.inputError]}
            labelStyle={styles.label}
          />

           <Input
            label="Cédula *"
            value={cedula}
            onChangeText={handleCedulaChange}
            placeholder="Ej. 102340567"
            keyboardType="numeric"
            maxLength={CEDULA_MAX_LENGTH}
            containerStyle={styles.field}
            style={[styles.input, errorCedula && styles.inputError]}
            labelStyle={styles.label}
          />

          <Input
            label="Teléfono *"
            value={telefono}
            onChangeText={handleTelefonoChange}
            placeholder="88881234"
            keyboardType="phone-pad"
            maxLength={TELEFONO_MAX_LENGTH}
            containerStyle={styles.field}
            style={[styles.input, errorTelefono && styles.inputError]}
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
            style={[styles.input, errorCorreo && styles.inputError]}
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

          

          {guardadoExitoso && (
            <Alert
              variant="success"
              message="Comprador guardado correctamente."
              style={styles.alertBox}
              textStyle={styles.alertText}
            />
          )}

          {mensajeError !== "" && (
            <Alert
              variant="danger"
              message={mensajeError}
              style={styles.alertBox}
              textStyle={styles.alertText}
            />
          )}


          {/* Botón para guardar, dispara la validación */}
          <Button variant="outline" onPress={handleSubmit} disabled={guardando} style={styles.saveButton}>
            <View style={styles.buttonContent}>
               <Icon icon={ICONS.add} size={ICON_SIZES.save} color={COLORS.primary} />
               <Text style={styles.saveButtonText}>
                 {guardando ? "Guardando..." : "Guardar comprador"}
               </Text>
            </View>
          </Button>
          
        </Card>
      </ScrollView>
    </View>
  );
}