// src/modules/colaboradores/components/ColaboradorForm.jsx

/**
 * ============================================================
 * COMPONENTE: ColaboradorForm
 * ============================================================
 *
 * Formulario para crear o editar colaboradores.
 * Utiliza el hook useColaboradorForm para manejar estado,
 * validaciones y consulta TSE.
 *
 * Props:
 * - initialData: objeto con datos iniciales (para edición)
 * - onSubmit: función que recibe los datos del formulario al enviar
 * - isEditing: booleano que indica si es edición (deshabilita cambio de cédula)
 * - fincaId: ID de finca (se asigna automáticamente para external_owner)
 * - onCancel: función para cerrar el modal sin guardar
 * - serverError: mensaje de error del servidor (opcional)
 * - fincasOptions: array de { label, value } para el select de fincas (opcional)
 */

import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { View } from "react-native";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import Card from "../../../shared/components/Card";
import { useColaboradorForm } from "../hooks/useColaboradorForm";
import { styles } from "../styles/colaboradorFormStyles";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

const ColaboradorForm = forwardRef(function ColaboradorForm(
  {
    initialData = {},
    onSubmit,
    isEditing = false,
    fincaId,
    onCancel,
    serverError = "",
    fincasOptions = [],
  },
  ref
) {
  const {
    form,
    errors,
    submitted,
    validationMessage,
    handleChange,
    handleCedulaChange,
    handleTelefonoChange,
    handleNombreChange,
    handleApellidosChange,
    handlePinChange,
    handleConfirmPinChange,
    pin,
    confirmPin,
    handleSubmit,
    resetForm,
  } = useColaboradorForm({
    initialData,
    isEditing,
    fincaId,
    onSubmit,
    fincasOptions,
  });

  useImperativeHandle(ref, () => ({
    resetForm,
  }));

  const [localErrorVisible, setLocalErrorVisible] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    if (validationMessage) {
      setLocalMessage(validationMessage);
      setLocalErrorVisible(true);
      const timer = setTimeout(() => setLocalErrorVisible(false), 6000);
      return () => clearTimeout(timer);
    } else {
      setLocalErrorVisible(false);
      setLocalMessage("");
    }
  }, [validationMessage]);

  useEffect(() => {
    if (serverError) {
      setLocalMessage(serverError);
      setLocalErrorVisible(true);
      const timer = setTimeout(() => setLocalErrorVisible(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  const mensajeError = localErrorVisible ? localMessage : "";
  const mostrarError = localErrorVisible && mensajeError !== "";

  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Icon icon={ICONS.user} size={20} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Información del colaborador</Text>
        </View>

        <Input
          label="Cédula *"
          value={form.cedula}
          onChangeText={handleCedulaChange}
          placeholder="Ej: 123456789"
          keyboardType="numeric"
          editable={!isEditing}
          style={submitted && errors.cedula ? styles.inputError : null}
        />

        <Input
          label="Nombre *"
          value={form.nombre}
          onChangeText={handleNombreChange}
          placeholder="Ej: Juan"
          editable={!isEditing}
          style={submitted && errors.nombre ? styles.inputError : null}
        />

        <Input
          label="Apellidos *"
          value={form.apellidos}
          onChangeText={handleApellidosChange}
          placeholder="Ej: Pérez Solano"
          editable={!isEditing}
          style={submitted && errors.apellidos ? styles.inputError : null}
        />

        <Input
          label="Teléfono (8 dígitos)"
          value={form.telefono}
          onChangeText={handleTelefonoChange}
          placeholder="Ej: 88881234"
          keyboardType="numeric"
          style={submitted && errors.telefono ? styles.inputError : null}
        />

        <Input
          label="Correo electrónico"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          placeholder="Ej: juan@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          style={submitted && errors.email ? styles.inputError : null}
        />

        <Select
          label="Finca asociada"
          options={fincasOptions}
          value={form.fincaId}
          onChange={(v) => handleChange("fincaId", v)}
          placeholder="Seleccione una finca (opcional)"
          selectStyle={submitted && errors.fincaId ? styles.inputError : null}
        />

        <Input
          label={isEditing ? "Nuevo PIN (opcional)" : "PIN *"}
          value={pin}
          onChangeText={handlePinChange}
          placeholder="4 dígitos"
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          style={submitted && errors.pin ? styles.inputError : null}
          helperText={isEditing ? "Deje vacío para mantener el PIN actual" : undefined}
        />

        <Input
          label={isEditing ? "Confirmar nuevo PIN (opcional)" : "Confirmar PIN *"}
          value={confirmPin}
          onChangeText={handleConfirmPinChange}
          placeholder="4 dígitos"
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          style={submitted && errors.confirmPin ? styles.inputError : null}
        />
      </Card>

      {mostrarError && (
        <View style={styles.alertContainer}>
          <Alert variant="danger" message={mensajeError} textStyle={styles.alertText} />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button variant="outline" onPress={handleSubmit} style={styles.submitButton}>
          <View style={styles.buttonContent}>
            <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
            <Text style={styles.buttonText}>
              {isEditing ? "Editar Colaborador" : "Registrar Colaborador"}
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
});

export default ColaboradorForm;