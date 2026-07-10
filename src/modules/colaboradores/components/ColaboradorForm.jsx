/**
 * ============================================================
 * COMPONENTE: ColaboradorForm
 * ============================================================
 *
 * Formulario para crear o editar colaboradores.
 * Incluye validaciones de campos, consulta simulada al TSE para
 * autocompletar nombre y apellidos a partir de la cédula.
 *
 * Props:
 * - initialData: objeto con datos iniciales (para edición)
 * - onSubmit: función que recibe los datos del formulario al enviar
 * - isEditing: booleano que indica si es edición (deshabilita cambio de cédula)
 * - userRole: "camprocam_admin" o "external_owner" - define roles disponibles
 * - fincaId: ID de finca (se asigna automáticamente para external_owner)
 *
 * Ejemplo:
 * <ColaboradorForm
 *   initialData={{}}
 *   onSubmit={handleSubmit}
 *   userRole="camprocam_admin"
 * />
 */

// ============================================================
// IMPORTS
// ============================================================
import React, { useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import { styles } from "../styles/colaboradorFormStyles";
import Icon from "../../../shared/components/Icons";
import { ICONS } from "../../../theme/icons";
import Text from "../../../shared/components/Text";
import { COLORS } from "../../../theme/colors";
// ============================================================
// CONSTANTES Y VALIDADORES
// ============================================================
const ROLES_CAMPROCAM = [
  { label: "Trabajador Camprocam", value: "camprocam_worker" },
  { label: "Dueño Externo", value: "external_owner" },
];

const ROLES_EXTERNO = [
  { label: "Trabajador Externo", value: "external_worker" },
];

const validarCedula = (cedula) => {
  const cedulaRegex = /^\d{9}$/;
  return cedulaRegex.test(cedula);
};

const validarTelefono = (telefono) => {
  const telefonoRegex = /^\d{8}$/;
  return telefonoRegex.test(telefono);
};

const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validarNombre = (nombre) => {
  return nombre.trim().length >= 2;
};

const validarApellidos = (apellidos) => {
  return apellidos.trim().length >= 2;
};

// ============================================================
// SIMULACIÓN DE CONSULTA A API EXTERNA (TSE)
// ============================================================

/**
 * Simula una consulta al Tribunal Supremo de Elecciones (TSE)
 * para obtener nombre y apellidos a partir de la cédula.
 * @param {string} cedula - Número de cédula de 9 dígitos
 * @returns {Promise<Object>} { success, nombre?, apellidos?, error? }
 * @async
 */
const consultarCedulaTSE = async (cedula) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (cedula === "123456789") {
        resolve({ success: true, nombre: "Carlos", apellidos: "Rodríguez Pérez" });
      } else if (cedula === "987654321") {
        resolve({ success: true, nombre: "María", apellidos: "Fernández Gómez" });
      } else if (cedula === "112233445") {
        resolve({ success: true, nombre: "Juan", apellidos: "Pérez Solano" });
      } else if (cedula === "301234567") {
        resolve({ success: true, nombre: "Dueño", apellidos: "Externo S.A." });
      } else {
        resolve({ success: false, error: "Cédula no encontrada" });
      }
    }, 1000);
  });
};

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
  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------
  const [form, setForm] = useState({
    cedula: initialData.cedula || "",
    nombre: initialData.nombre?.split(" ")[0] || "",
    apellidos: initialData.nombre?.split(" ").slice(1).join(" ") || "",
    telefono: initialData.telefono || "",
    email: initialData.email || "",
    rol: initialData.rol || (userRole === "camprocam_admin" ? "camprocam_worker" : "external_worker"),
    fincaId: initialData.fincaId || fincaId || "",
  });

  const [errors, setErrors] = useState({});
  const [loadingTSE, setLoadingTSE] = useState(false);
  const [consultedCedula, setConsultedCedula] = useState(false);

  const rolesDisponibles = userRole === "camprocam_admin" ? ROLES_CAMPROCAM : ROLES_EXTERNO;

  // --------------------------------------------------------
  // MANEJADORES DE CAMBIOS
  // --------------------------------------------------------

  /** Actualiza un campo del formulario y limpia su error asociado */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  /**
   * Consulta automática al perder el foco del campo cédula.
   * Solo si no es edición, la cédula tiene 9 dígitos y no se ha consultado antes.
   */
  const handleCedulaBlur = async () => {
    const { cedula } = form;
    if (!cedula || cedula.length !== 9 || consultedCedula || isEditing) return;

    if (!validarCedula(cedula)) {
      setErrors((prev) => ({ ...prev, cedula: "Cédula debe tener 9 dígitos" }));
      return;
    }

    setLoadingTSE(true);
    try {
      const result = await consultarCedulaTSE(cedula);
      if (result.success) {
        setForm((prev) => ({
          ...prev,
          nombre: result.nombre,
          apellidos: result.apellidos,
        }));
        setConsultedCedula(true);
        Alert.alert("Éxito", "Datos cargados automáticamente");
      } else {
        Alert.alert("Advertencia", "Cédula no encontrada. Ingrese datos manualmente.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo consultar la cédula");
    } finally {
      setLoadingTSE(false);
    }
  };

  // --------------------------------------------------------
  // VALIDACIÓN Y ENVÍO
  // --------------------------------------------------------

  /** Valida todos los campos del formulario */
  const validateForm = () => {
    const newErrors = {};

    if (!form.cedula) {
      newErrors.cedula = "La cédula es obligatoria";
    } else if (!validarCedula(form.cedula)) {
      newErrors.cedula = "Cédula debe tener 9 dígitos";
    }

    if (!form.nombre) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (!validarNombre(form.nombre)) {
      newErrors.nombre = "Nombre debe tener al menos 2 caracteres";
    }

    if (!form.apellidos) {
      newErrors.apellidos = "Los apellidos son obligatorios";
    } else if (!validarApellidos(form.apellidos)) {
      newErrors.apellidos = "Apellidos deben tener al menos 2 caracteres";
    }

    if (form.telefono && !validarTelefono(form.telefono)) {
      newErrors.telefono = "Teléfono debe tener 8 dígitos";
    }

    if (form.email && !validarEmail(form.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (userRole === "camprocam_admin" && form.rol === "external_owner" && !form.fincaId) {
      newErrors.fincaId = "El ID de finca es obligatorio para dueños externos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Envía el formulario si es válido */
  const handleSubmit = () => {
    if (!validateForm()) return;
    const fullName = `${form.nombre} ${form.apellidos}`;
    const submitData = { ...form, nombre: fullName };
    delete submitData.apellidos;
    onSubmit(submitData);
  };

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

      {/* Botones */}

              <View style={styles.buttonContainer}>
          <Button variant="outline" onPress={onCancel} style={styles.cancelButton}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon icon={ICONS.exit} size={18} color={COLORS.primary} />
              <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Cancelar</Text>
            </View>
          </Button>
        {onCancel && (
        <Button onPress={handleSubmit} style={styles.submitButton}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon icon={ICONS.save} size={18} color={COLORS.white} />
            <Text style={{ color: COLORS.white, fontWeight: '600' }}>
              {isEditing ? "Actualizar" : "Registrar"}
            </Text>
          </View>
        </Button>
        )}

      </View>
    </View>
  );
}