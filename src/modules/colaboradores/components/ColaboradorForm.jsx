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
 * - successMessage: mensaje de éxito (opcional)
 * - roleOptions: array de { label, value } para el select de roles (opcional)
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
    userRole,
    fincaId,
    onCancel,
    serverError = "",
    successMessage = "",
    roleOptions,
    fincasOptions = [],
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

  // Exponer resetForm al padre
  useImperativeHandle(ref, () => ({
    resetForm,
  }));

  const opcionesFincas = hookFincasOptions || fincasOptions || [];

  // Roles que requieren una finca asociada (IDs)
  const ROLES_CON_FINCA = [3, 5]; // Gerente de Finca, Operario de Campo
  const rolId = Number(form.rol);
  const mostrarSelectFinca = form.rol !== "" && ROLES_CON_FINCA.includes(rolId);

  // Estado local para controlar la visibilidad del alert (reaparece en cada submit)
  const [localErrorVisible, setLocalErrorVisible] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  // Cuando cambia validationMessage, actualizamos la visibilidad y el mensaje
  useEffect(() => {
    if (validationMessage) {
      setLocalMessage(validationMessage);
      setLocalErrorVisible(true);
      // Programar ocultación después de 6 segundos
      const timer = setTimeout(() => {
        setLocalErrorVisible(false);
      }, 6000);
      return () => clearTimeout(timer);
    } else {
      setLocalErrorVisible(false);
      setLocalMessage("");
    }
  }, [validationMessage]);

  // También manejar serverError (errores del backend)
  useEffect(() => {
    if (serverError) {
      setLocalMessage(serverError);
      setLocalErrorVisible(true);
      const timer = setTimeout(() => {
        setLocalErrorVisible(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  // Si hay mensaje de éxito, se muestra sin temporizador (se maneja en el padre)
  const mensajeError = localErrorVisible ? localMessage : "";
  const mostrarError = localErrorVisible && mensajeError !== "";

  return (
    <View style={styles.container}>
      {/* ─── Card con el formulario ─── */}
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
          label="Rol"
          options={rolesDisponibles}
          value={form.rol}
          onChange={(v) => handleChange("rol", v)}
          placeholder="Seleccione una opción"
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

{/* ─── Alert de error (fuera del Card, encima del botón) ─── */}
{mostrarError && (
  <View style={styles.alertContainer}>
    <Alert
      variant="danger"
      message={mensajeError}
      textStyle={styles.alertText}
    />
  </View>
)}

{/* ─── Alert de éxito (fuera del Card, encima del botón) ─── */}
{successMessage !== "" && !mostrarError && (
  <View style={styles.alertContainer}>
    <Alert
      variant="success"
      message={successMessage}
      textStyle={styles.alertText}
    />
  </View>
)}

      {/* ─── Botón de acción fuera del Card ─── */}
      <View style={styles.buttonContainer}>
        <Button variant="outline" onPress={handleSubmit} style={styles.submitButton}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
            <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
              {isEditing ? "Editar Colaborador" : "Registrar Colaborador"}
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
});

export default ColaboradorForm;