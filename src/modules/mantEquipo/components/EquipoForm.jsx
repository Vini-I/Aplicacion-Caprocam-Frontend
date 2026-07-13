/**
 * ============================================================
 * COMPONENTE: EquipoForm
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Formulario para crear o editar equipos.
 * Incluye validaciones de campos y generación automática de código.
 * Ahora expone errores específicos por campo y un estado `submitted`
 * para mostrar alertas de validación en el modal padre.
 *
 * Props:
 * - initialData: objeto con datos iniciales (para edición)
 * - onSubmit: función que recibe los datos del formulario al enviar
 * - isEditing: booleano que indica si es edición
 * - tiposEquipo: lista de tipos disponibles
 * - subcategorias: lista de subcategorías según el tipo seleccionado
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
 *   subcategorias={subcats}
 *   estanquesDisponibles={estanques}
 *   hideSubmitButton={true}
 *   onValidationError={(msg) => setAlert({ type: 'danger', message: msg })}
 * />
 * ============================================================
 */

import React, { forwardRef, useImperativeHandle } from "react";
import { View, ScrollView } from "react-native";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import DateInput from "../../../shared/components/DateInput";
import CustomText from "../../../shared/components/Text";
import { useEquipoForm } from "../hooks/useEquipoForm";
import { styles } from "../styles/equiposListStyles";
import { COLORS } from "../../../theme/colors";
import Alert from "../../../shared/components/Alert";

// ============================================================
// VALIDADORES
// ============================================================
const validarNombre = (nombre) => {
  if (!nombre || !nombre.trim()) return "El nombre del equipo es obligatorio";
  if (nombre.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  return "";
};

const validarDescripcion = (descripcion) => {
  if (!descripcion || !descripcion.trim()) return "La descripción es obligatoria";
  if (descripcion.trim().length < 5) return "La descripción debe tener al menos 5 caracteres";
  return "";
};

const validarMarca = (marca) => {
  if (!marca || !marca.trim()) return "La marca es obligatoria";
  return "";
};

const validarModelo = (modelo) => {
  if (!modelo || !modelo.trim()) return "El modelo es obligatorio";
  return "";
};

const validarSerie = (serie) => {
  if (!serie || !serie.trim()) return "El número de serie es obligatorio";
  return "";
};

const validarFuncion = (funcion) => {
  if (!funcion || !funcion.trim()) return "La función del equipo es obligatoria";
  return "";
};

const validarHorasMantenimiento = (horas) => {
  if (!horas) return "";
  if (Number(horas) <= 0) return "Las horas de mantenimiento deben ser mayores a 0";
  return "";
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const EquipoForm = forwardRef(function EquipoForm(
  {
    initialData = {},
    onSubmit,
    isEditing = false,
    tiposEquipo = [],
    subcategorias = [],
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
    resetForm,
    isFormValid,
    getValidationMessage,
  } = useEquipoForm({ initialData, onSubmit, isEditing, onValidationError });

  // Exponer handleSubmit al padre
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  // Manejadores internos
  const handleTipoChange = (value) => {
    handleChange("tipo", value);
    handleChange("subcategoria", "");
  };

  const subcategoriasFiltradas = subcategorias[form.tipo] || [];

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
        onChange={handleTipoChange}
        placeholder="Seleccione un tipo"
        selectStyle={submitted && errors.tipo ? styles.errorInput : null}
      />

      {/* Subcategoría */}
      {subcategoriasFiltradas.length > 0 && (
        <Select
          label="Subcategoría"
          options={subcategoriasFiltradas}
          value={form.subcategoria}
          onChange={(v) => handleChange("subcategoria", v)}
          placeholder="Seleccione una subcategoría"
        />
      )}

      {/* Marca */}
      <Input
        label="Marca *"
        value={form.marca}
        onChangeText={(v) => handleChange("marca", v)}
        placeholder="Ej: Makita"
        style={submitted && errors.marca ? styles.errorInput : null}
      />

      {/* Modelo */}
      <Input
        label="Modelo *"
        value={form.modelo}
        onChangeText={(v) => handleChange("modelo", v)}
        placeholder="Ej: MX-2000"
        style={submitted && errors.modelo ? styles.errorInput : null}
      />

      {/* Serie */}
      <Input
        label="Número de serie *"
        value={form.serie}
        onChangeText={(v) => handleChange("serie", v)}
        placeholder="Ej: 9-0050"
        style={submitted && errors.serie ? styles.errorInput : null}
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

      {/* Estado */}
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