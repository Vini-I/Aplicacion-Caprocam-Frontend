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
import { View, ActivityIndicator } from "react-native";
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
    loadingTSE,
    consultedCedula,
    rolesDisponibles,
    handleChange,
    handleCedulaBlur,
    handleSubmit,
  } = useColaboradorForm({ initialData, isEditing, userRole, fincaId, onSubmit });

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------
  return (
    <View style={styles.container}>
      <Input
        label="Cédula *"
        value={form.cedula}
        onChangeText={(v) => handleChange("cedula", v)}
        onBlur={handleCedulaBlur}
        placeholder="Ej: 123456789"
        keyboardType="numeric"
        error={errors.cedula}
        editable={!isEditing}
      />
      {loadingTSE && <ActivityIndicator style={styles.loader} color="#009EF5" />}

      <Input
        label="Nombre *"
        value={form.nombre}
        onChangeText={(v) => handleChange("nombre", v)}
        placeholder="Ej: Juan"
        error={errors.nombre}
        editable={!consultedCedula}
      />

      <Input
        label="Apellidos *"
        value={form.apellidos}
        onChangeText={(v) => handleChange("apellidos", v)}
        placeholder="Ej: Pérez Solano"
        error={errors.apellidos}
        editable={!consultedCedula}
      />

      <Input
        label="Teléfono (8 dígitos)"
        value={form.telefono}
        onChangeText={(v) => handleChange("telefono", v)}
        placeholder="Ej: 88881234"
        keyboardType="numeric"
        error={errors.telefono}
      />

      <Input
        label="Correo electrónico"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
        placeholder="Ej: juan@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <Select
        label="Rol"
        options={rolesDisponibles}
        value={form.rol}
        onChange={(v) => handleChange("rol", v)}
      />

      {userRole === "camprocam_admin" && form.rol === "external_owner" && (
        <Input
          label="ID de Finca *"
          value={form.fincaId}
          onChangeText={(v) => handleChange("fincaId", v)}
          placeholder="Ej: finca1, finca2, finca3"
          error={errors.fincaId}
        />
      )}

      {submitted && validationMessage !== "" && (
        <Alert
          variant="danger"
          message={validationMessage}
          style={{ marginBottom: 12 }}
          textStyle={{ textAlign: "left", fontSize: 13 }}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button variant="outline" onPress={onCancel} style={styles.cancelButton}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon icon={ICONS.exit} size={18} color={COLORS.primary} />
            <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Cancelar</Text>
          </View>
        </Button>

        <Button onPress={handleSubmit} style={styles.submitButton}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon icon={ICONS.save} size={18} color={COLORS.white} />
            <Text style={{ color: COLORS.white, fontWeight: '600' }}>
              {isEditing ? "Actualizar" : "Registrar"}
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
}