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
 */

// ============================================================
// IMPORTS
// ============================================================
// src/modules/colaboradores/components/ColaboradorForm.jsx

import React from "react";
import { View } from "react-native";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import { useColaboradorForm } from "../hooks/useColaboradorForm";
import { styles } from "../styles/colaboradorFormStyles";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

export default function ColaboradorForm({
  initialData = {},
  onSubmit,
  isEditing = false,
  userRole,
  fincaId,
  onCancel,
  serverError = "",
  roleOptions,
  fincasOptions = [],
}) {
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
  } = useColaboradorForm({
    initialData,
    isEditing,
    userRole,
    fincaId,
    onSubmit,
    availableRoles: roleOptions,
    fincasOptions,
  });

  const opcionesFincas = hookFincasOptions || fincasOptions || [];

  // Roles que requieren una finca asociada (IDs)
  const ROLES_CON_FINCA = [3, 5]; // Gerente de Finca, Operario de Campo
  const rolId = Number(form.rol);
  const mostrarSelectFinca = form.rol !== "" && ROLES_CON_FINCA.includes(rolId);

  const mensajeMostrar = (submitted && validationMessage) || serverError;

  return (
    <View style={styles.container}>
      {/* Cédula */}
      <Input
        label="Cédula *"
        value={form.cedula}
        onChangeText={handleCedulaChange}
        placeholder="Ej: 123456789"
        keyboardType="numeric"
        editable={!isEditing}
        style={submitted && errors.cedula ? styles.inputError : null}
      />

      {/* Nombre */}
      <Input
        label="Nombre *"
        value={form.nombre}
        onChangeText={handleNombreChange}
        placeholder="Ej: Juan"
        editable={!isEditing}
        style={submitted && errors.nombre ? styles.inputError : null}
      />

      {/* Apellidos */}
      <Input
        label="Apellidos *"
        value={form.apellidos}
        onChangeText={handleApellidosChange}
        placeholder="Ej: Pérez Solano"
        editable={!isEditing}
        style={submitted && errors.apellidos ? styles.inputError : null}
      />

      {/* Teléfono */}
      <Input
        label="Teléfono (8 dígitos)"
        value={form.telefono}
        onChangeText={handleTelefonoChange}
        placeholder="Ej: 88881234"
        keyboardType="numeric"
        style={submitted && errors.telefono ? styles.inputError : null}
      />

      {/* Correo */}
      <Input
        label="Correo electrónico"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
        placeholder="Ej: juan@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        style={submitted && errors.email ? styles.inputError : null}
      />

      {/* Rol */}
      <Select
        label="Rol"
        options={rolesDisponibles}
        value={form.rol}
        onChange={(v) => handleChange("rol", v)}
        placeholder="Seleccione una opción"
      />

      {/* Finca - Solo para roles que requieren finca y hay un rol seleccionado */}
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

      {/* Mensaje de error */}
      {mensajeMostrar !== "" && (
        <View style={{ marginBottom: 12 }}>
          <Alert
            variant="danger"
            message={mensajeMostrar}
            style={styles.alertContainer}
            textStyle={styles.alertText}
          />
        </View>
      )}

      {/* Botón de acción */}
      <View style={styles.buttonContainer}>
        <Button variant="outline" onPress={handleSubmit} style={styles.submitButton}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
            <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
              {isEditing ? "Actualizar" : "Registrar"}
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
}