/**
 * ============================================================
 * COMPONENTE: EquipoForm
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Formulario para crear o editar equipos.
 * Refleja el modelo real del backend: ya no incluye
 * marca, modelo, serie ni subcategoría (no existen en la
 * tabla equipos del backend).
 *
 * Props:
 * - initialData: objeto con datos iniciales (para edición)
 * - onSubmit: función que recibe los datos del formulario al enviar
 * - isEditing: booleano que indica si es edición
 * - tiposEquipo: lista de tipos disponibles
 * - estanquesDisponibles: lista de estanques para asociar
 * - hideSubmitButton: booleano para ocultar el botón de envío interno
 * - onValidationError: función que se llama con el mensaje de error
 *
 * Ejemplo:
 * <EquipoForm
 *   initialData={{}}
 *   onSubmit={handleSubmit}
 *   isEditing={false}
 *   tiposEquipo={tipos}
 *   estanquesDisponibles={estanques}
 *   hideSubmitButton={true}
 *   onValidationError={(msg) => setAlert({ type: 'danger', message: msg })}
 * />
 * ============================================================
 */

import React, { forwardRef, useImperativeHandle } from "react";
import { ScrollView } from "react-native";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import DateInput from "../../../shared/components/DateInput";
import { useEquipoForm } from "../hooks/useEquipoForm";
import { styles } from "../styles/equiposListStyles";
import Alert from "../../../shared/components/Alert";

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const EquipoForm = forwardRef(function EquipoForm(
  {
    initialData = {},
    onSubmit,
    isEditing = false,
    tiposEquipo = [],
    estanquesDisponibles = [],
    hideSubmitButton = false,
    onValidationError,
  },
  ref
) {
  const {
    form,
    errors,
    submitted,
    handleChange,
    handleSubmit,
    getValidationMessage,
  } = useEquipoForm({ initialData, onSubmit, isEditing, onValidationError });

  // Exponer handleSubmit al padre
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      {/* Nombre */}
      <Input
        label="Nombre del equipo *"
        value={form.nombre}
        onChangeText={(v) => handleChange("nombre", v)}
        placeholder="Ej: Aireador principal"
        style={submitted && errors.nombre ? styles.errorInput : null}
      />

      {/* Descripción */}
      <Input
        label="Descripción *"
        value={form.descripcion}
        onChangeText={(v) => handleChange("descripcion", v)}
        placeholder="Ej: Aireador de paletas para oxigenación"
        multiline
        style={submitted && errors.descripcion ? styles.errorInput : null}
      />

      {/* Tipo */}
      <Select
        label="Tipo de equipo *"
        options={tiposEquipo}
        value={form.tipo}
        onChange={(v) => handleChange("tipo", v)}
        placeholder="Seleccione un tipo"
        selectStyle={submitted && errors.tipo ? styles.errorInput : null}
      />

      {/* Fecha de instalación */}
      <DateInput
        label="Fecha de instalación *"
        value={form.fechaInstalacion}
        onChangeText={(v) => handleChange("fechaInstalacion", v)}
        allowFutureDates={false}
        inputStyle={submitted && errors.fechaInstalacion ? styles.errorInput : null}
      />

      {/* Función */}
      <Input
        label="Función del equipo *"
        value={form.funcionEquipo}
        onChangeText={(v) => handleChange("funcionEquipo", v)}
        placeholder="Ej: Mantener la oxigenación constante"
        multiline
        style={submitted && errors.funcionEquipo ? styles.errorInput : null}
      />

      {/* Estanque asociado */}
      <Select
        label="Estanque asociado"
        options={estanquesDisponibles}
        value={form.estanqueId}
        onChange={(v) => handleChange("estanqueId", v)}
        placeholder="Seleccione un estanque"
      />

      {/* Horas para mantenimiento */}
      <Input
        label="Horas para mantenimiento"
        value={String(form.horasMantenimiento)}
        onChangeText={(v) => handleChange("horasMantenimiento", v)}
        placeholder="Ej: 500"
        keyboardType="numeric"
        style={submitted && errors.horasMantenimiento ? styles.errorInput : null}
      />

      {/* Estado operativo */}
      <Select
        label="Estado"
        options={[
          { label: "Activo", value: "activo" },
          { label: "Inactivo", value: "inactivo" },
          { label: "Mantenimiento", value: "mantenimiento" },
        ]}
        value={form.estado}
        onChange={(v) => handleChange("estado", v)}
      />

      {/* Mensaje de error de validación */}
      {submitted && getValidationMessage() !== "" && (
        <Alert
          variant="danger"
          message={getValidationMessage()}
          style={{ marginBottom: 12 }}
          textStyle={{ textAlign: "left", fontSize: 13 }}
        />
      )}
    </ScrollView>
  );
});

export default EquipoForm;