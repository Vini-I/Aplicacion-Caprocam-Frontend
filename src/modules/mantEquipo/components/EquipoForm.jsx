/**
 * ============================================================
 * COMPONENTE: EquipoForm
 * ============================================================
 *
 * Formulario para crear o editar equipos.
 * Incluye validaciones de campos y generación automática de código.
 *
 * Props:
 * - initialData: objeto con datos iniciales (para edición)
 * - onSubmit: función que recibe los datos del formulario al enviar
 * - isEditing: booleano que indica si es edición
 * - tiposEquipo: lista de tipos disponibles
 * - subcategorias: lista de subcategorías según el tipo seleccionado
 * - estanquesDisponibles: lista de estanques para asociar
 * - hideSubmitButton: booleano para ocultar el botón de envío interno
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
 * />
 */

// ============================================================
// IMPORTS
// ============================================================
import React, { forwardRef, useImperativeHandle } from "react";
import { View, ScrollView } from "react-native";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import DateInput from "../../../shared/components/DateInput";
import CustomText from "../../../shared/components/Text";
import { useEquipoForm } from "../hooks/useEquipoForm";
import { styles } from "../styles/equiposListStyles";
import { COLORS } from "../../../theme/colors";

// ============================================================
// VALIDADORES (se mantienen igual)
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
  },
  ref
) {
  // --------------------------------------------------------
  // HOOK DE FORMULARIO
  // --------------------------------------------------------
  const {
    form,
    errors,
    submitted,
    handleChange,
    handleSubmit,
    resetForm,
    isFormValid,
  } = useEquipoForm({ initialData, onSubmit, isEditing });

  // Exponer handleSubmit al padre
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  // --------------------------------------------------------
  // MANEJADORES INTERNOS
  // --------------------------------------------------------
  const handleTipoChange = (value) => {
    handleChange("tipo", value);
    handleChange("subcategoria", "");
  };

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------
  const subcategoriasFiltradas = subcategorias[form.tipo] || [];

  return (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      {/* Nombre */}
      <Input
        label="Nombre del equipo *"
        value={form.nombre}
        onChangeText={(v) => handleChange("nombre", v)}
        placeholder="Ej: Aireador principal"
        error={submitted && errors.nombre}
      />

      {/* Descripción */}
      <Input
        label="Descripción *"
        value={form.descripcion}
        onChangeText={(v) => handleChange("descripcion", v)}
        placeholder="Ej: Aireador de paletas para oxigenación"
        multiline
        error={submitted && errors.descripcion}
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
        error={submitted && errors.marca}
      />

      {/* Modelo */}
      <Input
        label="Modelo *"
        value={form.modelo}
        onChangeText={(v) => handleChange("modelo", v)}
        placeholder="Ej: MX-2000"
        error={submitted && errors.modelo}
      />

      {/* Serie */}
      <Input
        label="Número de serie *"
        value={form.serie}
        onChangeText={(v) => handleChange("serie", v)}
        placeholder="Ej: 9-0050"
        error={submitted && errors.serie}
      />

      {/* Fecha de instalación */}
      <DateInput
        label="Fecha de instalación *"
        value={form.fechaInstalacion}
        onChangeText={(v) => handleChange("fechaInstalacion", v)}
        allowFutureDates={false}
      />

      {/* Función */}
      <Input
        label="Función del equipo *"
        value={form.funcionEquipo}
        onChangeText={(v) => handleChange("funcionEquipo", v)}
        placeholder="Ej: Mantener la oxigenación constante"
        multiline
        error={submitted && errors.funcionEquipo}
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
        error={submitted && errors.horasMantenimiento}
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

      {/* Botón de envío (solo si no se oculta) */}
      {!hideSubmitButton && (
        <Button
          variant="outline"
          onPress={handleSubmit}
          style={styles.submitButton}
          textStyle={{ color: COLORS.primary }}
        >
          {isEditing ? "Actualizar equipo" : "Registrar equipo"}
        </Button>
      )}
    </ScrollView>
  );
});

export default EquipoForm;