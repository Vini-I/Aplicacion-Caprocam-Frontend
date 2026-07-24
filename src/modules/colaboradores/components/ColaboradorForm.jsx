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
 */

// ============================================================
// IMPORTS
// ============================================================
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

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ColaboradorForm({
  initialData = {},
  onSubmit,
  isEditing = false,
  userRole,
  fincaId,
  onCancel,
}) {
  const {
    form,
    errors,
    submitted,
    validationMessage,
    rolesDisponibles,
    handleChange,
    handleCedulaChange,
    handleTelefonoChange,
    handleNombreChange,
    handleApellidosChange,
    handleSubmit,
  } = useColaboradorForm({ initialData, isEditing, userRole, fincaId, onSubmit });

  return (
    <View style={styles.container}>
      {/* Cédula - Solo números, máximo 9 dígitos */}
      <Input
        label="Cédula *"
        value={form.cedula}
        onChangeText={handleCedulaChange}
        placeholder="Ej: 123456789"
        keyboardType="numeric"
        editable={!isEditing}
        style={submitted && errors.cedula ? styles.inputError : null}
      />

      {/* Nombre - Solo letras */}
      <Input
        label="Nombre *"
        value={form.nombre}
        onChangeText={handleNombreChange}
        placeholder="Ej: Juan"
        editable={!isEditing}
        style={submitted && errors.nombre ? styles.inputError : null}
      />

      {/* Apellidos - Solo letras */}
      <Input
        label="Apellidos *"
        value={form.apellidos}
        onChangeText={handleApellidosChange}
        placeholder="Ej: Pérez Solano"
        editable={!isEditing}
        style={submitted && errors.apellidos ? styles.inputError : null}
      />

      {/* Teléfono - Solo números, máximo 8 dígitos */}
      <Input
        label="Teléfono (8 dígitos)"
        value={form.telefono}
        onChangeText={handleTelefonoChange}
        placeholder="Ej: 88881234"
        keyboardType="numeric"
        style={submitted && errors.telefono ? styles.inputError : null}
      />

      {/* Correo electrónico */}
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
      />

      {/* ID de Finca (solo para dueños externos) */}
      {userRole === "camprocam_admin" && form.rol === "external_owner" && (
        <Input
          label="ID de Finca *"
          value={form.fincaId}
          onChangeText={(v) => handleChange("fincaId", v)}
          placeholder="Ej: finca1, finca2, finca3"
          style={submitted && errors.fincaId ? styles.inputError : null}
        />
      )}

      {/* Mensaje de validación general */}
      {submitted && validationMessage !== "" && (
        <Alert
          variant="danger"
          message={validationMessage}
          style={styles.alertContainer}
          textStyle={styles.alertText}
        />
      )}

      {/* Botón de acción */}
      <View style={styles.buttonContainer}>
        <Button
          variant="outline"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
            <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
              {isEditing ? "Actualizar" : "Registrar"}
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
}