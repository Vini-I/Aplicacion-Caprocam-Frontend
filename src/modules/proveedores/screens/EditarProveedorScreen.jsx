/**
 * ============================================================
 * PANTALLA EDITAR PROVEEDOR
 * ============================================================
 *
 * Pantalla para editar la informacion de un proveedor existente.
 *
 * FUNCIONALIDAD:
 * 1. Permite modificar tipo de producto, telefono, correo, direccion y
 *    notas (nombre queda de solo lectura).
 * 
 * 2. Tipo de producto, telefono, correo y direccion son obligatorios,
 *    con asterisco visible desde el primer render. Notas es el unico
 *    campo opcional.
 * 
 * 3. Al presionar Guardar proveedor se valida el formulario:
 *    - Cada campo invalido se marca en rojo solo el borde, sin
 *      mensaje ni icono individual debajo del campo.
 *    - Arriba del boton "Guardar proveedor" aparece la alerta general
 *      alerta, centrada.
 * 
 * 4. Si no se modifico ningun campo respecto al proveedor original, no
 *    se guarda: se muestra una alerta de error en su lugar.
 *
 * IMPORTANTE:
 * - Al guardar exitosamente permanece en la pantalla mostrando la
 *   alerta de exito; no redirige automaticamente a otra ruta.
 */
import React from "react";
import { View, ScrollView } from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Alert from "../../../shared/components/Alert";

import { styles, ICON_STYLES } from "../styles/EditarProveedorStyles";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { tiposProducto } from "../services/proveedor.service";

import {
  useEditarProveedorScreen,
  TELEFONO_MAX_LENGTH,
} from "../hooks/useEditarProveedorScreen";

export default function EditarProveedorScreen() {
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
    errores,
    alerta,
    handleTelefonoChange,
    handleCorreoChange,
    guardar,
  } = useEditarProveedorScreen();

  return (
    <View style={STYLE.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={STYLE.contentWrapper}>
        <Card style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon icon={ICONS.id} color={ICON_STYLES.subtitle.color} />
            <CustomText style={styles.cardTitle}>Información del proveedor</CustomText>
          </View>

          <Input
            label="Nombre de la empresa"
            value={nombre}
            editable={false}
            containerStyle={styles.field}
            style={styles.inputDisabled}
            labelStyle={styles.label}
          />

          <Select
            label="Tipo de producto *"
            value={tipoProducto}
            onChange={setTipoProducto}
            options={tiposProducto}
            containerStyle={styles.field}
            selectStyle={[styles.select, !!errores.tipoProducto && styles.inputError]}
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
            style={[styles.input, !!errores.telefono && styles.inputError]}
            labelStyle={styles.label}
          />

          <Input
            label="Correo electrónico *"
            value={correo}
            onChangeText={handleCorreoChange}
            placeholder="ventas@empresa.com"
            keyboardType="email-address"
            containerStyle={styles.field}
            style={[styles.input, !!errores.correo && styles.inputError]}
            labelStyle={styles.label}
          />

          <Input
            label="Dirección *"
            value={direccion}
            onChangeText={setDireccion}
            placeholder="San José, Costa Rica"
            containerStyle={styles.field}
            style={[styles.input, !!errores.direccion && styles.inputError]}
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

          {alerta && (
            <Alert
              variant={alerta.variant}
              message={alerta.message}
              style={[styles.alertContainer, alerta.variant === "success" && styles.alertSuccess]}
              textStyle={styles.alertText}
            />
          )}

          <Button
            onPress={guardar}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}
          >
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} color={ICON_STYLES.save.color} />
              <CustomText style={styles.saveButtonText}>Guardar proveedor</CustomText>
            </View>
          </Button>
        </Card>
        </View>
      </ScrollView>
    </View>
  );
}