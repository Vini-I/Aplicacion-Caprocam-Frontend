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
 * - userRole: "camprocam_admin" o "external_owner" - define roles disponibles
 * - fincaId: ID de finca (se asigna automáticamente para external_owner)
 * - onCancel: función para cerrar el modal sin guardar
 * - serverError: mensaje de error del servidor (opcional)
 * - roleOptions: array de { label, value } para el select de roles (opcional)
 * - fincasOptions: array de { label, value } para el select de fincas (opcional)
 * - onResetPin: función para restablecer el PIN (solo en edición)
 * - resetLoading: booleano para mostrar estado de carga en el botón de reset
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
    userRole,
    fincaId,
    onCancel,
    serverError = "",
    roleOptions,
    fincasOptions = [],
    onResetPin,
    resetLoading = false,
  },
  ref
) {
  const {
    form,
    errors,
    submitted,
    validationMessage,
    rolesDisponibles,
    fincasOptions: hookFincasOptions,
    handleChange,
    handleCedulaChange,
    handleTelefonoChange,
    handleNombreChange,
    handleApellidosChange,
    handleSubmit,
    resetForm,
  } = useColaboradorForm({
    initialData,
    isEditing,
    userRole,
    fincaId,
    onSubmit,
    availableRoles: roleOptions,
    fincasOptions,
  });

  useImperativeHandle(ref, () => ({
    resetForm,
  }));

  const opcionesFincas = hookFincasOptions || fincasOptions || [];

  const ROLES_CON_FINCA = [3, 5];
  const rolId = Number(form.rol);
  const mostrarSelectFinca = form.rol !== "" && ROLES_CON_FINCA.includes(rolId);

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
          label="Rol *"
          options={rolesDisponibles}
          value={form.rol}
          onChange={(v) => handleChange("rol", v)}
          placeholder="Seleccione una opción"
          selectStyle={submitted && errors.rol ? styles.inputError : null}
        />

        {mostrarSelectFinca && (
          <Select
            label="Finca asociada *"
            options={opcionesFincas}
            value={form.fincaId}
            onChange={(v) => handleChange("fincaId", v)}
            placeholder="Seleccione una finca"
            selectStyle={submitted && errors.fincaId ? styles.inputError : null}
          />
        )}
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

      {/* Botón de restablecer PIN (solo en edición) */}
      {isEditing && (
        <View style={styles.resetButtonContainer}>
          <Button
            variant="outline"
            onPress={onResetPin}
            disabled={resetLoading}
            style={styles.resetButton}
          >
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.update} size={18} color={COLORS.primary} />
              <Text style={styles.buttonText}>
                {resetLoading ? "Restableciendo..." : "Restablecer PIN"}
              </Text>
            </View>
          </Button>
        </View>
      )}
    </View>
  );
});

export default ColaboradorForm;